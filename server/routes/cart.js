import { Router } from "express";
import * as cart from "../controllers/cart.js";
import { validate } from "../middleware/validate.js";
import { addItemSchema, deleteItemSchema, getCartSchema, updateQtySchema } from "../validators/cart.js";

const router = Router();

router.get("/", validate(getCartSchema), cart.getCart);
router.post("/items", validate(addItemSchema), cart.addItem);

router.patch("/items", validate(updateQtySchema), cart.updateItemQty);
router.delete("/items/:productId", validate(deleteItemSchema), cart.removeItem);

export default router;