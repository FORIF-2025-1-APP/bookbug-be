import { Router, RequestHandler } from 'express';
import { createTag, getTags, getTag, updateTag, deleteTag } from '../controllers/tag.controller';

const router = Router();

/**
 * @swagger
 * /api/tags:
 *   post:
 *     tags:
 *       - Tags
 *     summary: Create a new tag
 *     description: Add a new tag for categorizing books
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
 *         description: Tag created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', createTag as RequestHandler);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get all tags
 *     description: Retrieve a list of all available tags
 *     responses:
 *       200:
 *         description: List of tags retrieved successfully
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
router.get('/', getTags as RequestHandler);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get a tag by ID
 *     description: Retrieve a specific tag using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                   description:
 *                     type: string
 */
router.get('/:id', getTag as RequestHandler);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     tags:
 *       - Tags
 *     summary: Update a tag
 *     description: Update an existing tag's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
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
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Tag not found
 */
router.put('/:id', updateTag as RequestHandler);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     tags:
 *       - Tags
 *     summary: Delete a tag
 *     description: Remove a tag from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 */
router.delete('/:id', deleteTag as RequestHandler);

export default router; 