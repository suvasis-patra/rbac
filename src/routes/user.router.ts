import Router from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { authUser } from "../middlewares/authorization.middleware";
import { authorizeRole } from "../middlewares/checkRole.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(authUser, logoutUser);
router
  .route("/general")
  .get(authUser, authorizeRole(["User", "Admin", "Moderator"]));
router.route("/moderator").get(authUser, authorizeRole(["Admin", "Moderator"]));
router.route("/admin").get(authUser, authorizeRole(["Admin"]));

export default router;
