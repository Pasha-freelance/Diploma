import { AuthorizationController } from '../controllers/authorization.controller';
import { Router } from "express";

const authRouter = Router();
const authorizationController = new AuthorizationController();

authRouter.post('/register', authorizationController.register);
authRouter.post('/login', authorizationController.login);

export default authRouter;
