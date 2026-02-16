import PDFDocument from 'pdfkit';
import { generateQRCodeBuffer } from './qrcode.service';

// Bakım raporunu PDF olarak oluştur
export const generateMaintenancePDF = async (
  maintenance: any,
  elevator: any,
  building: any
): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Başlık
      doc.fontSize(20).text('ASANSÖR BAKIM RAPORU', { align: 'center' });
      doc.moveDown();

      // QR kod ekle
      const qrData = JSON.stringify({
        elevatorId: elevator.id,
        serialNumber: elevator.serialNumber,
        maintenanceId: maintenance.id,
      });
      const qrBuffer = await generateQRCodeBuffer(qrData);
      doc.image(qrBuffer, 450, 80, { width: 100 });

      // Asansör bilgileri
      doc.fontSize(12);
      doc.text(`Seri No: ${elevator.serialNumber}`, 50, 100);
      doc.text(`Tip: ${elevator.type}`);
      doc.text(`Marka/Model: ${elevator.brand || ''} ${elevator.model || ''}`);
      doc.text(`Kapasite: ${elevator.capacity || '-'} kg / ${elevator.personCapacity || '-'} kişi`);
      doc.text(`Kat Sayısı: ${elevator.floors || '-'}`);
      doc.text(`CE No: ${elevator.ceNumber || '-'}`);
      doc.moveDown();

      // Bina bilgileri
      doc.text(`Bina: ${building.name}`);
      doc.text(`Adres: ${building.address}`);
      doc.text(`İletişim: ${building.contactPhone || '-'}`);
      doc.moveDown();

      // Bakım bilgileri
      doc.text(`Bakım Tarihi: ${new Date(maintenance.scheduledDate).toLocaleDateString('tr-TR')}`);
      if (maintenance.completedDate) {
        doc.text(`Tamamlanma Tarihi: ${new Date(maintenance.completedDate).toLocaleDateString('tr-TR')}`);
      }
      doc.text(`Durum: ${maintenance.status}`);
      doc.text(`Teknisyen: ${maintenance.technician?.firstName || ''} ${maintenance.technician?.lastName || ''}`);
      doc.moveDown();

      // Kontrol listesi
      doc.fontSize(14).text('KONTROL LİSTESİ', { underline: true });
      doc.fontSize(10);
      doc.moveDown();

      let currentCategory = '';
      maintenance.checklistItems?.forEach((item: any, index: number) => {
        if (item.category !== currentCategory) {
          currentCategory = item.category;
          doc.fontSize(11).text(currentCategory, { bold: true });
          doc.fontSize(10);
        }

        const status = item.isCompliant
          ? '✓ Uygun'
          : item.isCompliant === false
          ? '✗ Uygun Değil'
          : '○ Kontrol Edilmedi';

        doc.text(`${item.itemNumber}. ${item.description} - ${status}`);
        
        if (item.notes) {
          doc.fontSize(9).text(`   Not: ${item.notes}`, { color: 'gray' });
          doc.fontSize(10);
        }
      });

      // Kullanılan malzemeler
      if (maintenance.usedMaterials?.length > 0) {
        doc.addPage();
        doc.fontSize(14).text('KULLANILAN MALZEMELER', { underline: true });
        doc.fontSize(10);
        doc.moveDown();

        maintenance.usedMaterials.forEach((material: any) => {
          doc.text(`• ${material.name} - ${material.quantity} ${material.unit || ''}`);
          if (material.notes) {
            doc.fontSize(9).text(`  ${material.notes}`, { color: 'gray' });
            doc.fontSize(10);
          }
        });
      }

      // İmzalar
      doc.addPage();
      doc.fontSize(12).text('İMZALAR');
      doc.moveDown();

      // Teknisyen imzası
      if (maintenance.technicianSignature) {
        doc.text('Teknisyen İmzası:');
        doc.image(maintenance.technicianSignature, { width: 150, height: 75 });
      } else {
        doc.text('Teknisyen İmzası: _________________');
      }

      doc.moveDown(3);

      // Müşteri imzası
      if (maintenance.customerSignature) {
        doc.text(`Müşteri İmzası (${maintenance.customerName || ''}):`)
        doc.image(maintenance.customerSignature, { width: 150, height: 75 });
      } else {
        doc.text(`Müşteri İmzası: _________________`);
        doc.text(`Ad Soyad: ${maintenance.customerName || '_________________'}`);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
