import { Router } from 'express';
import { loginUser } from '../controllers/loginControllers';

const router: Router = Router();

router.post('/login', loginUser);

export default router;