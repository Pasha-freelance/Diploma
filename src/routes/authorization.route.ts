import { AuthorizationController } from '../controllers/authorization.controller';
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();
const authorizationController = new AuthorizationController();

authRouter.post('/register', authorizationController.register.bind(authorizationController));
authRouter.post('/login', authorizationController.login.bind(authorizationController));
authRouter.get('/getUser', authMiddleware, authorizationController.getUser.bind(authorizationController));
authRouter.get('/getUsersByEmail', authMiddleware, authorizationController.getUsersByEmail.bind(authorizationController));

export default authRouter;
