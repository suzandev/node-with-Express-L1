import { Pool } from "pg";
import config from "../config/env";

//? creating a pool for postgresql connection */
export const pool = new Pool({
  connectionString: config.connection_String,
});

//? initializing the database and creating the users table */
export const initDB = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY, 
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `,
    );
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
