import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CategoryCreateRequest = Request<{}, {}, {
  name: string;
}>;

export const createCategory = async (req: CategoryCreateRequest, res: Response) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create category
    const newCategory = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            reviews: {
              include: {
                author: true,
                rating: true,
                tags: true,
              },
            },
          },
        },
        _count: {
          select: { books: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (duplicateCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has books
    const booksCount = await prisma.book.count({
      where: { categoryId: id },
    });

    if (booksCount > 0) {
      return res.status(400).json({ message: 'Cannot delete category with books' });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 