import { Router } from "express";
import * as review from "../controllers/review.js";

const router = Router();

router.get("/:productId/reviews", review.list);
router.post("/:productId/reviews", review.create); // 로그인 필요(컨트롤러에서 체크)

router.patch("/:productId/reviews/:reviewId", review.update);
router.delete("/:productId/reviews/:reviewId", review.remove);

export default router;