import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 3000;

//? Middleware */
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // for url

//? creating a pool for postgresql connection */
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_tTzU3ab9xBPG@ep-noisy-darkness-aq7t2d6v-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

//? initializing the database and creating the users table */
const initDB = async () => {
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

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Suzan Chandra",
  });
});
//? creating a post route */
app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  //? inserting data into the users table */
  try {
    const result = await pool.query(
      `
    INSERT INTO users (name, email, password, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
      [name, email, password, age],
    );
    res.status(201).json({
      success: true,
      message: "User Created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

//? creating a get route to retrieve all users */
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM users
      `);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

//? creating a single route to retrieve a user by id */
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
    SELECT * FROM users WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

//? creating a put route to update a user by id */
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
        UPDATE users SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        age = COALESCE($4, age)
        WHERE id = $5
        RETURNING *
      `,
      [name, email, password, age, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
