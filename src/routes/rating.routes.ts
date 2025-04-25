import { Router, RequestHandler } from 'express';
import { createRating, updateRating } from '../controllers/rating.controller';

const router = Router();

router.post('/', createRating as RequestHandler);
router.put('/:id', updateRating as RequestHandler);

export default router; 