import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ReviewCreateRequest = Request<{}, {}, {
  bookId: string;
  userId: string;
  title: string;
  description: string;
  rating: number;
  tags: string[];
}>;

export const getReviews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviews = await prisma.review.findMany({
    where: { bookId: id },
  });
  res.json(reviews);
};


export const createReview = async (req: ReviewCreateRequest, res: Response) => {
  try {
    const { bookId, userId, title, description, rating, tags } = req.body;

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate rating value (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Create or connect tags
    const tagConnections = await Promise.all(
      tags.map(async (tagName) => {
        // Try to find existing tag
        let tag = await prisma.tag.findFirst({
          where: { name: tagName },
        });

        // If tag doesn't exist, create it
        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName },
          });
        }

        return { id: tag.id };
      })
    );

    // Create review
    const newReview = await prisma.review.create({
      data: {
        bookId,
        authorId: userId,
        title,
        description,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        tags: true,
      },
    });

    // Create rating separately
    await prisma.rating.create({
      data: {
        bookId,
        reviewId: newReview.id,
        rating,
      },
    });

    // Fetch the complete review with rating
    const reviewWithRating = await prisma.review.findUnique({
      where: { id: newReview.id },
      include: {
        rating: true,
        tags: true,
      },
    });

    res.status(201).json(reviewWithRating);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, rating, tags } = req.body;

    // Validate rating value if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: { rating: true, tags: true },
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Create or connect new tags if provided
    let tagConnections;
    if (tags) {
      tagConnections = await Promise.all(
        tags.map(async (tagName: string) => {
          let tag = await prisma.tag.findFirst({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await prisma.tag.create({
              data: { name: tagName },
            });
          }

          return { id: tag.id };
        })
      );
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        title,
        description,
        ...(tags && {
          tags: {
            set: [], // Remove all existing tags
            connect: tagConnections, // Connect new tags
          },
        }),
      },
      include: {
        rating: true,
        tags: true,
      },
    });

    // Update rating if provided
    if (rating && existingReview.rating) {
      await prisma.rating.update({
        where: { id: existingReview.rating.id },
        data: { rating },
      });
    } else if (rating) {
      // Create new rating if it doesn't exist
      await prisma.rating.create({
        data: {
          bookId: existingReview.bookId,
          reviewId: id,
          rating,
        },
      });
    }

    // Fetch the complete review with updated rating
    const reviewWithUpdatedRating = await prisma.review.findUnique({
      where: { id },
      include: {
        rating: true,
        tags: true,
      },
    });

    res.json(reviewWithUpdatedRating);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete review (this will cascade delete the rating and tag connections)
    await prisma.review.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 