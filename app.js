import express from "express";
import { PORT } from "./config/config.js";
import { connectToDatabase } from "./database/db.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import createSchema from "./database/schema.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import boardRouter from "./routes/board.route.js";
import cors from "cors";
// import {
//   default as subscriptionRouter,
//   default as userRouter,
// } from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/boards", boardRouter);
// app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  return res.send("Welcome to Subscription Tracker API");
});

app.listen(PORT, async () => {
  console.log(`server is running on http://localhost:${PORT}`);
  await connectToDatabase();
  await createSchema();
});
