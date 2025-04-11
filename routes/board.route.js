import { Router } from "express";
import {
  createBoards,
  deleteBoard,
  editBoard,
  getBoards,
} from "../controllers/board.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const boardRouter = Router();

boardRouter.get("/", authMiddleware, getBoards);
boardRouter.post("/", authMiddleware, createBoards);
boardRouter.put("/:id", authMiddleware, editBoard);
boardRouter.delete("/:id", authMiddleware, deleteBoard);

export default boardRouter;
