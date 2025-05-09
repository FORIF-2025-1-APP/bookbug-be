import { RequestHandler, Router } from 'express';
import { getUser, updateUser, deleteUser, userBadges, changePrimaryBadge, changeFavoriteBook } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /api/user:
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
 * /api/user:
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
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
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
 * /api/user:
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

/**
 * @swagger
 * /api/user/badges:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user badges
 *     description: Retrieve the badges of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User badges retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/badges', userBadges as RequestHandler);

/**
 * @swagger
 * /api/user/primary-badge:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change primary badge
 *     description: Change the primary badge of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primaryBadge:
 *                 type: string
 *     responses:
 *       200:
 *         description: Primary badge changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/primary-badge', changePrimaryBadge as RequestHandler);

/**
 * @swagger
 * /api/user/favorite-book:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change favorite book
 *     description: Change the favorite book of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favoriteBook:
 *                 type: string 
 *     responses:
 *       200:
 *         description: Favorite book changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/favorite-book', changeFavoriteBook as RequestHandler);

export default router; 