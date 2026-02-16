import QRCode from 'qrcode';
import { Elevator } from '@prisma/client';

// QR kod verisi oluştur
export const generateQRData = (elevator: Elevator, building?: any): string => {
  const data = {
    elevatorId: elevator.id,
    serialNumber: elevator.serialNumber,
    type: elevator.type,
    ceNumber: elevator.ceNumber,
    address: building?.address || '',
    phone: building?.contactPhone || '',
  };
  
  return JSON.stringify(data);
};

// QR kod görseli oluştur (Base64)
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
    return qrCode;
  } catch (error) {
    throw new Error('QR kod oluşturulamadı');
  }
};

// QR kod buffer olarak oluştur (PDF için)
export const generateQRCodeBuffer = async (data: string): Promise<Buffer> => {
  try {
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
    });
    return buffer;
  } catch (error) {
    throw new Error('QR kod oluşturulamadı');
  }
};
