import Router from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { authUser } from "../middlewares/authorization.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(authUser, logoutUser);

export default router;
