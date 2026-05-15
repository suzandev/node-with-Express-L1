import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

//? creating a post route */
router.post("/", userController.createUser);

export const userRoute = router;
