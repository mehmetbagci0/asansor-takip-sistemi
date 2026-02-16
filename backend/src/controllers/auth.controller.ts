import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

// Kullanıcı kaydı
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role || 'TECHNICIAN',
      },
    });

    // Token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Şifreyi response'dan kaldır
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Kayıt işlemi başarısız' });
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    // Aktif mi kontrol et
    if (!user.isActive) {
      return res.status(401).json({ error: 'Hesabınız devre dışı bırakılmış' });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    // Token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Şifreyi response'dan kaldır
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Giriş başarılı',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Giriş işlemi başarısız' });
  }
};

// Kullanıcı profili
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profil hatası:', error);
    res.status(500).json({ error: 'Profil bilgileri alınamadı' });
  }
};
