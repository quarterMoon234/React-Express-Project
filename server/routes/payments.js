import { Router } from "express";
import * as payments from "../controllers/payments.js";

const router = Router();
router.post("/confirm", payments.confirm); 
export default router;
