import { Router } from 'express';
import { 
    getStreamingServices,
    getGenres
} from '../controllers/listControllers';

const router: Router = Router();

// GET streaming services
router.get('/streamingservices', getStreamingServices);

// GET genres
router.get('/genres', getGenres);

export default router;