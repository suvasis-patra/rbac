import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.router";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundError } from "./controllers/error.controller";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use(errorHandler);
app.all("*", notFoundError);

export { app };
