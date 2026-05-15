import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

//? creating a post route */
router.post("/", userController.createUser);

//? creating a get route to retrieve all users */
router.get("/", userController.getAllUsers);

//? creating a single route to retrieve a user by id */
router.get("/:id", userController.getUserById);

//? creating a put route to update a user by id */
router.put("/:id", userController.updateUserById);

//? creating a delete route to delete a user by id */
router.delete("/:id", userController.deleteUserById);

export const userRoute = router;
