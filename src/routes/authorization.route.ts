import * as controller from '../controllers/authorization.controller';
import { Router } from "express";

const authRouter = Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);

export default authRouter;
