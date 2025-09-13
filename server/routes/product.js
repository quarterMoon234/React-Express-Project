import { Router } from "express";
import * as product from "../controllers/product.js";

const router = Router();

router.get("/", product.list);
router.post("/", product.create);
router.put("/:id", product.update);
router.delete("/:id", product.remove);

export default router;