import db from "../db.js";

export const findUserByEmail = async (email) => {
  try {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export const createUser = async (name, email, hashedPassword) => {
  try {
    const result = await db.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
        `,
      [name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const findById = async (id) => {
  try {
    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

export const getAllBoards = async () => {
  try {
    const result = await db.query(`SELECT * FROM boards`);
    return result.rows;
  } catch (error) {
    console.error("Error getting all boards:", error);
    throw error;
  }
};

export const getBoardById = async (id) => {
  try {
    const result = await db.query(`SELECT * FROM boards WHERE id = $1`, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting board by ID:", error);
    throw error;
  }
};

export const createBoard = async ({ title, description, userId }) => {
  try {
    const result = await db.query(
      `
        INSERT INTO boards (title, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING title, description, user_id, created_at
        `,
      [title, description, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

export const updateBoard = async ({ id, title, description }) => {
  try {
    const result = await db.query(
      `
      UPDATE boards
      SET title = $1,
          description = $2
      WHERE id = $3
      RETURNING id, title, description, user_id, updated_at
      `,
      [title, description, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
};

export const deleteBoardById = async (id) => {
  try {
    const result = await db.query(`DELETE FROM boards WHERE id = $1`, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
};
