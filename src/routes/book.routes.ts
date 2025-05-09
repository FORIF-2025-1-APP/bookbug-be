import { RequestHandler, Router } from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBook,
  getBookByIsbn,
} from "../controllers/book.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Search for books
 *     description: Retrieve all books from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         type: string
 *         description: Search query
 *       - in: query
 *         name: display
 *         required: false
 *         type: number
 *         description: Number of books to display
 *       - in: query
 *         name: start
 *         required: false
 *         type: number
 *         description: Start index
 *       - in: query
 *         name: sort
 *         required: false
 *         type: string
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Books found
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.get("/", getBooks as unknown as RequestHandler);

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags:
 *       - Books
 *     summary: Create a new book
 *     description: Add a new book to the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isbn
 *         required: true
 *         type: string
 *         description: Book ISBN
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/", createBook as unknown as RequestHandler);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a book by ID
 *     description: Retrieve a specific book using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 author:
 *                   type: string
 *                 description:
 *                   type: string
 *                 coverImage:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Book not found
 */
router.get("/:id", getBook as RequestHandler);

/**
 * @swagger
 * /api/books/isbn/{isbn}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a book by ISBN
 *     description: Retrieve a specific book using its ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ISBN
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 author:
 *                   type: string
 *                 description:
 *                   type: string
 *                 coverImage:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Book not found
 */
router.get("/isbn/:isbn", getBookByIsbn as RequestHandler);

/**
 * @swagger
 * /api/books/{id}:
 *   patch:
 *     tags:
 *       - Books
 *     summary: Update a book
 *     description: Update an existing book's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               link:
 *                 type: string
 *               image:
 *                 type: string
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               pubDate:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Book not found
 */
router.patch(
  "/:id",
  adminMiddleware as RequestHandler,
  updateBook as RequestHandler
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags:
 *       - Books
 *     summary: Delete a book
 *     description: Remove a book from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Book not found
 */
router.delete(
  "/:id",
  adminMiddleware as RequestHandler,
  deleteBook as RequestHandler
);

export default router;
