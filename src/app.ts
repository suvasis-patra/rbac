import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.router";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);

export { app };
