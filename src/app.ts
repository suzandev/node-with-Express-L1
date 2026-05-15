import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

//? Middleware */
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // for url

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Suzan Chandra",
  });
});

app.use("/api/users", userRoute);

export default app;
