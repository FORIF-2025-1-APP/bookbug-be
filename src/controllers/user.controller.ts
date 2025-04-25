import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type UserUpdateRequest = Request<{}, {}, {
  username?: string;
  password?: string;
  image?: string;
}>;

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Will be set by auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        badges: true,
        primaryBadge: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req: UserUpdateRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { username, password, image } = req.body;

    // Hash password if it's being updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(image && { image }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        badges: true,
        primaryBadge: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 