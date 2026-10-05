import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import gymRoutes from './gym.routes.js';
import employeeRoutes from './employee.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/gyms', gymRoutes);
apiRouter.use('/employees', employeeRoutes);

export default apiRouter;
