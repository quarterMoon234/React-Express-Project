import { Router } from "express";
import * as order from "../controllers/order.js";

const router = Router();
router.post("/", order.create);  // POST /api/orders
export default router;
