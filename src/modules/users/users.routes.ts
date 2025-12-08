import express from "express";
import { usersController } from "./users.controller";
import auth from "../../middlewere/auth";

const router = express.Router();

router.get("/", auth("admin"), usersController.getAllUsers);
router.get("/:id", auth("admin", "customer"), usersController.getSingleUser);
router.put("/:id", auth("admin", "customer"), usersController.updateUser);
router.delete("/:id", auth("admin"), usersController.deleteUser);

export const usersRoutes = router;