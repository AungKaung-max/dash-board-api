import db from "./db.js";

const createSchema = async () => {
  try {
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_state') THEN
          CREATE TYPE task_state AS ENUM ('to-do', 'in-progress', 'done');
        END IF;
      END$$;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        state task_state NOT NULL DEFAULT 'to-do',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables created!");

    const userRes = await db.query(`SELECT COUNT(*) FROM users`);
    if (parseInt(userRes.rows[0].count) === 0) {
      const newUser = await db.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ('Alice', 'alice@example.com', 'hashed_password')
        RETURNING id
      `);
      const userId = newUser.rows[0].id;

      const newBoard = await db.query(
        `
        INSERT INTO boards (user_id, title, description)
        VALUES ($1, 'Project Alpha', 'Demo board for testing')
        RETURNING id
      `,
        [userId]
      );
      const boardId = newBoard.rows[0].id;

      await db.query(
        `
        INSERT INTO tasks (board_id, title, description, state, due_date)
        VALUES 
        ($1, 'Setup project', 'Install dependencies and init git', 'to-do', '2025-04-15'),
        ($1, 'Build schema', 'Define tables and enums', 'in-progress', '2025-04-16'),
        ($1, 'Test API', 'Write endpoints and test', 'done', '2025-04-17')
      `,
        [boardId]
      );

      console.log("✅ Sample data inserted!");
    }
  } catch (err) {
    console.error("❌ Schema setup error:", err.message);
  }
};

export default createSchema;
