import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { generateMaintenancePDF } from '../services/pdf.service';
import { exportMaintenanceToExcel } from '../services/excel.service';

const prisma = new PrismaClient();

// Tüm bakımları listele
export const getAllMaintenances = async (req: AuthRequest, res: Response) => {
  try {
    const { status, elevatorId, technicianId, startDate, endDate } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (elevatorId) where.elevatorId = elevatorId;
    if (technicianId) where.technicianId = technicianId;
    
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate.gte = new Date(startDate as string);
      if (endDate) where.scheduledDate.lte = new Date(endDate as string);
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        elevator: {
          include: {
            building: true,
          },
        },
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            checklistItems: true,
            usedMaterials: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    res.json(maintenances);
  } catch (error) {
    console.error('Bakım listeleme hatası:', error);
    res.status(500).json({ error: 'Bakımlar listelenemedi' });
  }
};

// Tek bakım detayı
export const getMaintenanceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        elevator: {
          include: {
            building: {
              include: {
                company: true,
              },
            },
          },
        },
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        checklistItems: {
          orderBy: { itemNumber: 'asc' },
        },
        usedMaterials: true,
        documents: true,
      },
    });

    if (!maintenance) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }

    res.json(maintenance);
  } catch (error) {
    console.error('Bakım detay hatası:', error);
    res.status(500).json({ error: 'Bakım bilgileri alınamadı' });
  }
};

// Yeni bakım oluştur
export const createMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const { elevatorId, scheduledDate, technicianId, notes, checklistItems } = req.body;

    const maintenance = await prisma.maintenance.create({
      data: {
        elevatorId,
        scheduledDate: new Date(scheduledDate),
        technicianId,
        notes,
        checklistItems: checklistItems ? {
          create: checklistItems,
        } : undefined,
      },
      include: {
        elevator: {
          include: {
            building: true,
          },
        },
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        checklistItems: true,
      },
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Bakım oluşturma hatası:', error);
    res.status(500).json({ error: 'Bakım oluşturulamadı' });
  }
};

// Bakım güncelle
export const updateMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ChecklistItems ve usedMaterials ayrı işle
    const { checklistItems, usedMaterials, ...mainData } = updateData;

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: mainData,
      include: {
        elevator: {
          include: {
            building: true,
          },
        },
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        checklistItems: true,
        usedMaterials: true,
      },
    });

    res.json(maintenance);
  } catch (error) {
    console.error('Bakım güncelleme hatası:', error);
    res.status(500).json({ error: 'Bakım güncellenemedi' });
  }
};

// Bakımı tamamla
export const completeMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { technicianSignature, customerSignature, customerName, duration } = req.body;

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        technicianSignature,
        customerSignature,
        customerName,
        duration,
      },
      include: {
        elevator: {
          include: {
            building: true,
          },
        },
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        checklistItems: true,
        usedMaterials: true,
      },
    });

    res.json(maintenance);
  } catch (error) {
    console.error('Bakım tamamlama hatası:', error);
    res.status(500).json({ error: 'Bakım tamamlanamadı' });
  }
};

// Bakım kontrol maddesi güncelle
export const updateChecklistItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isCompliant, notes, photoUrl } = req.body;

    const item = await prisma.maintenanceChecklistItem.update({
      where: { id },
      data: { isCompliant, notes, photoUrl },
    });

    res.json(item);
  } catch (error) {
    console.error('Kontrol maddesi güncelleme hatası:', error);
    res.status(500).json({ error: 'Kontrol maddesi güncellenemedi' });
  }
};

// Kullanılan malzeme ekle
export const addUsedMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { maintenanceId } = req.params;
    const { name, quantity, unit, notes } = req.body;

    const material = await prisma.usedMaterial.create({
      data: {
        maintenanceId,
        name,
        quantity,
        unit,
        notes,
      },
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Malzeme ekleme hatası:', error);
    res.status(500).json({ error: 'Malzeme eklenemedi' });
  }
};

// Bakım raporunu PDF olarak indir
export const downloadMaintenancePDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        elevator: true,
        building: true,
        technician: true,
        checklistItems: {
          orderBy: { itemNumber: 'asc' },
        },
        usedMaterials: true,
      },
    });

    if (!maintenance) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }

    const pdfBuffer = await generateMaintenancePDF(
      maintenance,
      (maintenance as any).elevator,
      (maintenance as any).building
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=bakim-raporu-${maintenance.id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    res.status(500).json({ error: 'PDF oluşturulamadı' });
  }
};

// Bakım raporunu Excel olarak indir
export const downloadMaintenanceExcel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        elevator: true,
        technician: true,
        checklistItems: {
          orderBy: { itemNumber: 'asc' },
        },
        usedMaterials: true,
      },
    });

    if (!maintenance) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }

    const excelBuffer = await exportMaintenanceToExcel(
      maintenance,
      (maintenance as any).elevator
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=bakim-raporu-${maintenance.id}.xlsx`
    );
    res.send(excelBuffer);
  } catch (error) {
    console.error('Excel oluşturma hatası:', error);
    res.status(500).json({ error: 'Excel oluşturulamadı' });
  }
};
