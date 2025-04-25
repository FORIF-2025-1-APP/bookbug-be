import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type BookCreateRequest = Request<{}, {}, {
  title: string;
  link: string;
  image: string;
  author: string;
  publisher: string;
  pubDate: Date;
  isbn: string;
  description: string;
  categoryName: string;
}>;

export const createBook = async (req: BookCreateRequest, res: Response) => {
  try {
    const { title, link, image, author, publisher, pubDate, isbn, description, categoryName } = req.body;

    // Check if book with ISBN already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn },
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName },
      });
    }

    // Create book
    const newBook = await prisma.book.create({
      data: {
        title,
        link,
        image,
        author,
        publisher,
        pubDate,
        isbn,
        description,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      link,
      image,
      author,
      publisher,
      pubDate,
      description,
      categoryName,
    } = req.body;

    const updateData: any = {
      ...(title && { title }),
      ...(link && { link }),
      ...(image && { image }),
      ...(author && { author }),
      ...(publisher && { publisher }),
      ...(pubDate && { pubDate: new Date(pubDate) }),
      ...(description && { description }),
    };

    if (categoryName) {
      // Find or create category
      let category = await prisma.category.findFirst({
        where: { name: categoryName },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName },
        });
      }

      updateData.categoryId = category.id;
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            author: true,
            rating: true,
            tags: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBookByIsbn = async (req: Request, res: Response) => {
  try {
    const { isbn } = req.params;

    const book = await prisma.book.findUnique({
      where: { isbn },
      include: {
        category: true,
        reviews: {
          include: {
            author: true,
            rating: true,
            tags: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book by ISBN error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 