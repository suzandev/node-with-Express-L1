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

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_tTzU3ab9xBPG@ep-noisy-darkness-aq7t2d6v-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Suzan Chandra",
  });
});
//? creating a post route */
app.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  res.status(200).json({
    message: "Data received successfully",
    data: {
      name,
      email,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
