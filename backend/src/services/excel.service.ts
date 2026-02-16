import ExcelJS from 'exceljs';
import { ChecklistTemplate } from '@prisma/client';

// Excel'den kontrol listesi şablonunu içe aktar
export const importChecklistFromExcel = async (
  filePath: string
): Promise<Partial<ChecklistTemplate>[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0];
  const items: Partial<ChecklistTemplate>[] = [];
  
  worksheet.eachRow((row, rowNumber) => {
    // İlk satır başlık, atla
    if (rowNumber === 1) return;
    
    const item: Partial<ChecklistTemplate> = {
      category: row.getCell(1).value?.toString() || '',
      itemNumber: parseInt(row.getCell(2).value?.toString() || '0'),
      description: row.getCell(3).value?.toString() || '',
      isActive: true,
      order: rowNumber - 1,
    };
    
    items.push(item);
  });
  
  return items;
};

// Bakım raporunu Excel'e aktar
export const exportMaintenanceToExcel = async (
  maintenance: any,
  elevator: any
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Bakım Raporu');
  
  // Başlık
  worksheet.mergeCells('A1:D1');
  worksheet.getCell('A1').value = 'ASANSÖR BAKIM RAPORU';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };
  
  // Asansör bilgileri
  worksheet.addRow(['Seri No:', elevator.serialNumber]);
  worksheet.addRow(['Marka/Model:', `${elevator.brand || ''} ${elevator.model || ''}`]);
  worksheet.addRow(['Bakım Tarihi:', maintenance.scheduledDate]);
  worksheet.addRow(['Teknisyen:', maintenance.technician?.firstName + ' ' + maintenance.technician?.lastName]);
  worksheet.addRow([]);
  
  // Kontrol listesi başlıkları
  worksheet.addRow(['Kategori', 'Madde No', 'Açıklama', 'Durum']);
  
  // Kontrol maddeleri
  maintenance.checklistItems?.forEach((item: any) => {
    worksheet.addRow([
      item.category,
      item.itemNumber,
      item.description,
      item.isCompliant ? 'Uygun' : item.isCompliant === false ? 'Uygun Değil' : 'Kontrol Edilmedi',
    ]);
  });
  
  // Kullanılan malzemeler
  if (maintenance.usedMaterials?.length > 0) {
    worksheet.addRow([]);
    worksheet.addRow(['KULLANILAN MALZEMELER']);
    worksheet.addRow(['Malzeme Adı', 'Miktar', 'Birim', 'Notlar']);
    
    maintenance.usedMaterials.forEach((material: any) => {
      worksheet.addRow([
        material.name,
        material.quantity,
        material.unit || '',
        material.notes || '',
      ]);
    });
  }
  
  // Excel buffer oluştur
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
};
