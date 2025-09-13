import { Router } from "express";
import * as cart from "../controllers/cart.js";

const router = Router();

router.get("/", cart.getCart);
router.post("/items", cart.addItem);

export default router;