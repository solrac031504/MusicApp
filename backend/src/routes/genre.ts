import { Router } from 'express';
import { 
    updateGenre,
    getSingleGenre
} from '../controllers/genreControllers';

const router: Router = Router();

// PATCH genre
router.patch('/updateinfo', updateGenre);

// GET single genre
router.get('/', getSingleGenre);

export default router;