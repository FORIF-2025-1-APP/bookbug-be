import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reply, reviewId } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Create reply
    const newReply = await prisma.reply.create({
      data: {
        reply,
        authorId,
        reviewId,
      },
      include: {
        author: true,
        review: true,
      },
    });

    res.status(201).json(newReply);
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReplies = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    const replies = await prisma.reply.findMany({
      where: { reviewId },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(replies);
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id },
      include: {
        author: true,
        review: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    res.json(reply);
  } catch (error) {
    console.error('Get reply error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if reply exists and belongs to the user
    const existingReply = await prisma.reply.findUnique({
      where: { id },
    });

    if (!existingReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (existingReply.authorId !== authorId) {
      return res.status(403).json({ message: 'Not authorized to update this reply' });
    }

    const updatedReply = await prisma.reply.update({
      where: { id },
      data: { reply },
      include: {
        author: true,
        review: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    res.json(updatedReply);
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteReply = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if reply exists and belongs to the user
    const existingReply = await prisma.reply.findUnique({
      where: { id },
    });

    if (!existingReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (existingReply.authorId !== authorId) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    await prisma.reply.delete({
      where: { id },
    });

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 