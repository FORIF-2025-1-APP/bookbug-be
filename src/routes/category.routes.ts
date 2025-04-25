import { Router, RequestHandler } from 'express';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

router.post('/', adminMiddleware as RequestHandler, createCategory as RequestHandler);
router.get('/', getCategories as RequestHandler);
router.get('/:id', getCategory as RequestHandler);
router.patch('/:id', adminMiddleware as RequestHandler, updateCategory as RequestHandler);
router.delete('/:id', adminMiddleware as RequestHandler, deleteCategory as RequestHandler);

export default router; 