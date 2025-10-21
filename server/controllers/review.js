import AppError from "../errors/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as reviewService from "../services/review.js";

export const create = asyncHandler(async (req, res) => {
    if (!req.session.userId) throw new AppError(401, "로그인이 필요합니다.");
    const { productId } = req.params;
    const { content, rating } = req.body;
    if (!content?.trim()) throw new AppError(400, "내용을 입력하세요.");
    const r = Number(rating);
    if (!(r >= 1 && r <= 5)) throw new AppError(400, "평점은 1~5 사이여야 합니다.");

    const review = await reviewService.addReview({
        productId,
        userId: req.session.userId,
        content: content.trim(),
        rating: r
    });
    res.status(201).json(review);
});

export const update = asyncHandler(async (req, res) => {
    if (!req.session.userId) throw new AppError(401, "로그인이 필요합니다.");
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    if (rating !== undefined) {
        const r = Number(rating);
        if (!(r >= 1 && r <= 5)) throw new AppError(400, "평점은 1~5 사이여야 합니다.");
    }
    const updated = await reviewService.updateReview({
        reviewId,
        userId: req.session.userId,
        content,
        rating: rating !== undefined ? Number(rating) : undefined
    });
    if (updated === null) throw new AppError(404, "리뷰를 찾을 수 없거나 권한이 없습니다.");
    res.json(updated);
})

export const remove = asyncHandler(async (req, res) => {
  if (!req.session.userId) throw new AppError(401, "로그인이 필요합니다.");
  const { reviewId } = req.params;
  // 관리자 여부 체크를 추가하려면 req.session.role 같은 걸 쓰세요.
  const ok = await reviewService.deleteReview({ reviewId, userId: req.session.userId, isAdmin: false });
  if (ok === null) throw new AppError(404, "리뷰를 찾을 수 없습니다.");
  if (ok === false) throw new AppError(403, "삭제 권한이 없습니다.");
  res.sendStatus(204);
});

export const list = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const data = await reviewService.listReviews({ productId, page, limit });
    res.json(data);
})