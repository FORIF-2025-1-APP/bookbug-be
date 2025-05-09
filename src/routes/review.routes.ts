import { Router, RequestHandler } from 'express';
import { createReview, updateReview, deleteReview, getReviews } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/reviews/book/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a book
 *     description: Retrieve all reviews associated with a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   userId:
 *                     type: string
 *                   bookId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *       404:
 *         description: Book not found
 */
router.get('/book/:id', getReviews as RequestHandler);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review
 *     description: Add a new review for a book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - bookId
 *               - rating
 *             properties:
 *               content:
 *                 type: string
 *               bookId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware as RequestHandler, createReview as RequestHandler);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update a review
 *     description: Update an existing review's content and rating
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - rating
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the review owner
 *       404:
 *         description: Review not found
 */
router.put('/:id', authMiddleware as RequestHandler, updateReview as RequestHandler);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Remove a review from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the review owner
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authMiddleware as RequestHandler, deleteReview as RequestHandler);

export default router; 