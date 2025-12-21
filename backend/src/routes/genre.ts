import { Router } from 'express';
import { updateGenre } from '../controllers/genreControllers';

const router: Router = Router();

// PATCH genre
router.patch('/updateinfo', updateGenre);

export default router;