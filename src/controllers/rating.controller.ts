import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RatingCreateRequest = Request<{}, {}, {
  bookId: string;
  reviewId: string;
  rating: number;
}>;

export const createRating = async (req: RatingCreateRequest, res: Response) => {
  try {
    const { bookId, reviewId, rating } = req.body;

    // Validate rating value (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        bookId,
        reviewId,
        rating,
      },
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Validate rating value (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating },
    });

    res.json(updatedRating);
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 