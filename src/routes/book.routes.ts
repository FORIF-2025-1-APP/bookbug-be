import { RequestHandler, Router } from 'express';
import { createBook, updateBook, deleteBook, getBook, getBookByIsbn } from '../controllers/book.controller';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// router.get("/", getBooks as RequestHandler);

router.post('/', createBook as RequestHandler);
router.get('/:id', getBook as RequestHandler);
router.get('/isbn/:isbn', getBookByIsbn as RequestHandler);
router.patch('/:id', adminMiddleware as RequestHandler, updateBook as RequestHandler);
router.delete('/:id', adminMiddleware as RequestHandler, deleteBook as RequestHandler);

export default router; 