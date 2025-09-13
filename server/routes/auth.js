import { Router } from "express";
import * as auth from "../controllers/auth.js";

const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/session", auth.session);

export default router;  