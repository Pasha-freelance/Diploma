import authRouter from './src/routes/authorization.route';
import auth from './src/middleware/auth'
import { Response } from "express";

require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use('/auth', authRouter);

app.get("/welcome", auth, (req: Request, res: Response) => {
    res.status(200).send("Welcome 🙌 ");
});

app.use("*", (req: any, res: any) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});

export default app;
