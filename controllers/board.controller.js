import {
  getAllBoards,
  createBoard,
  updateBoard,
  getBoardById,
} from "../database/queries/queries.js";

export const getBoards = async (req, res, next) => {
  try {
    const boards = await getAllBoards();
    res.status(200).json({
      success: true,
      message: "Boards retrieved successfully",
      data: boards,
    });
  } catch (error) {
    next(error);
  }
};
export const createBoards = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const { user } = req;
    const newBoard = await createBoard({ title, description, userId: user.id });
    res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    next(error);
  }
};

export const editBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Board = await getBoardById(id);
    if (!Board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }
    const { title, description } = req.body;
    const updatedBoard = await updateBoard({ id, title, description });
    res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: updatedBoard,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Board = await getBoardById(id);
    if (!Board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }
    await deleteBoardById(id);
    res.status(200).json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
