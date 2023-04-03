import authRouter from './src/routes/authorization.route';
import documentRouter from "./src/routes/document.route";
import authMiddleware from "./src/middleware/auth.middleware";

require("dotenv").config();
const express = require("express");
const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const app = express();

app.use(express.json({ limit: "50mb" }), cors(corsOptions));

app.use('/auth', authRouter);
app.use('/dashboard/documents', documentRouter);

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
