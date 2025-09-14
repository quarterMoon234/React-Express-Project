import { Router } from "express";
import * as product from "../controllers/product.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "../validators/product.js";

const router = Router();

router.get("/", product.list);
router.post("/", validate(createProductSchema), product.create);
router.put("/:id", validate(updateProductSchema), product.update);
router.delete("/:id", product.remove);

export default router;