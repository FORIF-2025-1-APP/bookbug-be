import { Router, RequestHandler } from 'express';
import { createReview, updateReview, deleteReview } from '../controllers/review.controller';

const router = Router();

router.post('/', createReview as RequestHandler);
router.put('/:id', updateReview as RequestHandler);
router.delete('/:id', deleteReview as RequestHandler);

export default router; 