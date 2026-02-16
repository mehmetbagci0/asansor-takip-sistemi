import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { generateQRData, generateQRCode } from '../services/qrcode.service';

const prisma = new PrismaClient();

// Tüm asansörleri listele
export const getAllElevators = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type, buildingId } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (buildingId) where.buildingId = buildingId;

    const elevators = await prisma.elevator.findMany({
      where,
      include: {
        building: {
          include: {
            company: true,
          },
        },
        _count: {
          select: {
            maintenances: true,
            faults: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(elevators);
  } catch (error) {
    console.error('Asansör listeleme hatası:', error);
    res.status(500).json({ error: 'Asansörler listelenemedi' });
  }
};

// Tek asansör detayı
export const getElevatorById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const elevator = await prisma.elevator.findUnique({
      where: { id },
      include: {
        building: {
          include: {
            company: true,
          },
        },
        maintenances: {
          take: 10,
          orderBy: { scheduledDate: 'desc' },
          include: {
            technician: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        faults: {
          take: 10,
          orderBy: { reportedDate: 'desc' },
        },
        inspections: {
          orderBy: { inspectionDate: 'desc' },
        },
      },
    });

    if (!elevator) {
      return res.status(404).json({ error: 'Asansör bulunamadı' });
    }

    res.json(elevator);
  } catch (error) {
    console.error('Asansör detay hatası:', error);
    res.status(500).json({ error: 'Asansör bilgileri alınamadı' });
  }
};

// Yeni asansör oluştur
export const createElevator = async (req: AuthRequest, res: Response) => {
  try {
    const {
      serialNumber,
      type,
      brand,
      model,
      capacity,
      personCapacity,
      floors,
      yearInstalled,
      ceNumber,
      buildingId,
      notes,
    } = req.body;

    // Seri no kontrolü
    const existing = await prisma.elevator.findUnique({
      where: { serialNumber },
    });

    if (existing) {
      return res.status(400).json({ error: 'Bu seri numarası zaten kullanılıyor' });
    }

    // Asansör oluştur
    const elevator = await prisma.elevator.create({
      data: {
        serialNumber,
        type,
        brand,
        model,
        capacity,
        personCapacity,
        floors,
        yearInstalled,
        ceNumber,
        buildingId,
        notes,
      },
      include: {
        building: true,
      },
    });

    // QR kod oluştur
    const qrData = generateQRData(elevator, elevator.building);
    const qrCode = await generateQRCode(qrData);

    // QR kodu asansöre kaydet
    const updatedElevator = await prisma.elevator.update({
      where: { id: elevator.id },
      data: { qrCode },
      include: {
        building: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(201).json(updatedElevator);
  } catch (error) {
    console.error('Asansör oluşturma hatası:', error);
    res.status(500).json({ error: 'Asansör oluşturulamadı' });
  }
};

// Asansör güncelle
export const updateElevator = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const elevator = await prisma.elevator.update({
      where: { id },
      data: updateData,
      include: {
        building: {
          include: {
            company: true,
          },
        },
      },
    });

    res.json(elevator);
  } catch (error) {
    console.error('Asansör güncelleme hatası:', error);
    res.status(500).json({ error: 'Asansör güncellenemedi' });
  }
};

// Asansör sil
export const deleteElevator = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.elevator.delete({
      where: { id },
    });

    res.json({ message: 'Asansör başarıyla silindi' });
  } catch (error) {
    console.error('Asansör silme hatası:', error);
    res.status(500).json({ error: 'Asansör silinemedi' });
  }
};

// Asansör QR kodunu yeniden oluştur
export const regenerateQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const elevator = await prisma.elevator.findUnique({
      where: { id },
      include: { building: true },
    });

    if (!elevator) {
      return res.status(404).json({ error: 'Asansör bulunamadı' });
    }

    const qrData = generateQRData(elevator, elevator.building);
    const qrCode = await generateQRCode(qrData);

    const updatedElevator = await prisma.elevator.update({
      where: { id },
      data: { qrCode },
    });

    res.json({ qrCode: updatedElevator.qrCode });
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
    res.status(500).json({ error: 'QR kod oluşturulamadı' });
  }
};
