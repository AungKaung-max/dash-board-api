import pkg from "pg";
import { DB_URI } from "../config/config.js";

const { Pool } = pkg;

if (!DB_URI) {
  throw new Error(
    "Please define DB_URI environment variable in your .env file"
  );
}

const client = new Pool({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ DB Connection Error", err);
    process.exit(1);
  }
};

export default client;
