import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type TagCreateRequest = Request<{}, {}, {
  name: string;
}>;

export const createTag = async (req: TagCreateRequest, res: Response) => {
  try {
    const { name } = req.body;

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: { name },
    });

    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    // Create tag
    const newTag = await prisma.tag.create({
      data: { name },
    });

    res.status(201).json(newTag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if new name already exists
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (duplicateTag) {
      return res.status(400).json({ message: 'Tag name already exists' });
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    res.json(updatedTag);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await prisma.tag.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 