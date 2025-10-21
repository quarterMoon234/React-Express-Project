import { Router } from "express";
import * as auth from "../controllers/auth.js";
import { validate } from "../middleware/validate.js"
import { registerSchema, loginSchema } from "../validators/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), auth.register);
router.post("/login", validate(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.get("/session", auth.session);
router.get("/me", auth.me);

export default router;  