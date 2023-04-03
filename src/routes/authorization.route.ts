import { AuthorizationController } from '../controllers/authorization.controller';
import { Router } from "express";

const authRouter = Router();
const authorizationController = new AuthorizationController();

authRouter.post('/register', authorizationController.register.bind(authorizationController));
authRouter.post('/login', authorizationController.login.bind(authorizationController));

export default authRouter;
