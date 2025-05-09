import { RequestHandler, Router } from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Retrieve the profile information of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', getUser as RequestHandler);

/**
 * @swagger
 * /api/users:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user profile
 *     description: Update the profile information of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.patch('/', updateUser as RequestHandler);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete current user account
 *     description: Permanently delete the account of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/', deleteUser as RequestHandler);

export default router; 