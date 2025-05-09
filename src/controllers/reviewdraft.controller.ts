import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ReviewDraftCreateRequest = Request<{}, {}, {
  bookId: string;
  userId: string;
  title: string;
  description: string;
  rating: number;
  tags: string[];
}>;

export const createReviewDraft = async (req: ReviewDraftCreateRequest, res: Response) => {
  try {
    const { bookId, title, description, rating, tags } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

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
    const newReview = await prisma.reviewDraft.create({
      data: {
        bookId,
        authorId: userId,
        title,
        description,
        rating,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        tags: true,
      },
    });

    // Fetch the complete review with rating
    const reviewWithRating = await prisma.reviewDraft.findUnique({
      where: { id: newReview.id },
      include: {
        tags: true,
      },
    });

    res.status(201).json(reviewWithRating);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateReviewDraft = async (req: Request, res: Response) => {
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
    const updatedReviewDraft = await prisma.reviewDraft.update({
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
    const reviewWithUpdatedRating = await prisma.reviewDraft.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    res.json(reviewWithUpdatedRating);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};