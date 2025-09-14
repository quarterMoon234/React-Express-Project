import { Router } from "express";
import * as cart from "../controllers/cart.js";
import { validate } from "../middleware/validate.js";
import { addItemSchema, getCartSchema } from "../validators/cart.js";

const router = Router();

router.get("/", validate(getCartSchema), cart.getCart);
router.post("/items", validate(addItemSchema), cart.addItem);

export default router;