import { Router } from 'express';
import { getStreamingServices } from '../controllers/listControllers';

const router: Router = Router();

// GET streaming services
router.get('/streamingservices', getStreamingServices);

export default router;