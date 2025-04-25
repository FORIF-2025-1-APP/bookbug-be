import { Router, RequestHandler } from 'express';
import { createTag, getTags, updateTag, deleteTag } from '../controllers/tag.controller';

const router = Router();

router.post('/', createTag as RequestHandler);
router.get('/', getTags as RequestHandler);
router.put('/:id', updateTag as RequestHandler);
router.delete('/:id', deleteTag as RequestHandler);

export default router; 