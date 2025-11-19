/**
 * @summary
 * Version 1 API router.
 * Combines internal and external route configurations.
 *
 * @module routes/v1
 */

import { Router } from 'express';
import internalRoutes from './internalRoutes';

const router = Router();

router.use('/internal', internalRoutes);

export default router;
