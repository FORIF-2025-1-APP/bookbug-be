import { RequestHandler, Router } from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUser as RequestHandler);
router.patch('/', updateUser as RequestHandler);
router.delete('/', deleteUser as RequestHandler);

export default router; 