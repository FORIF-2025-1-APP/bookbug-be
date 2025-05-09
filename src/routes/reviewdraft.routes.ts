import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { createReviewDraft, updateReviewDraft } from '../controllers/reviewdraft.controller';

const router = Router();

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
 *               - bookId
 *               - title
 *               - description
 *               - rating
 *               - tags
 *             properties:
 *               bookId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware as RequestHandler, createReviewDraft as RequestHandler);

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
 *               - title
 *               - description
 *               - rating
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
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
router.put('/:id', authMiddleware as RequestHandler, updateReviewDraft as RequestHandler);

export default router; 