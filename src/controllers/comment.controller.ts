import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { comment, replyId } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if reply exists
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Create comment
    const newComment = await prisma.comment.create({
      data: {
        comment,
        authorId,
        replyId,
      },
      include: {
        author: true,
        reply: true,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { replyId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { replyId },
      include: {
        author: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        reply: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Get comment error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if comment exists and belongs to the user
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existingComment.authorId !== authorId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { comment },
      include: {
        author: true,
        reply: true,
      },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if comment exists and belongs to the user
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existingComment.authorId !== authorId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 