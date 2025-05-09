import { Router, RequestHandler } from 'express';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     description: Add a new book category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', adminMiddleware as RequestHandler, createCategory as RequestHandler);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Retrieve a list of all book categories
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/', getCategories as RequestHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a category by ID
 *     description: Retrieve a specific category using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategory as RequestHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Update a category
 *     description: Update an existing category's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */
router.patch('/:id', adminMiddleware as RequestHandler, updateCategory as RequestHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     description: Remove a category from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */
router.delete('/:id', adminMiddleware as RequestHandler, deleteCategory as RequestHandler);

export default router; 