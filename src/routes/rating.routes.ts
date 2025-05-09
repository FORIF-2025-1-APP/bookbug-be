import { Router, RequestHandler } from 'express';
import { createRating, updateRating } from '../controllers/rating.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     tags:
 *       - Ratings
 *     summary: Create a new rating
 *     description: Add a new rating for a book
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
 *               - rating
 *             properties:
 *               bookId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware as RequestHandler, createRating as RequestHandler);

/**
 * @swagger
 * /api/ratings/{id}:
 *   put:
 *     tags:
 *       - Ratings
 *     summary: Update a rating
 *     description: Update an existing rating for a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the rating owner
 *       404:
 *         description: Rating not found
 */
router.put('/:id', authMiddleware as RequestHandler, updateRating as RequestHandler);

export default router; 