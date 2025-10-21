import Review from "../models/Review.js";
import Product from "../models/Product.js";

async function recalcProductRating(productId) {
    const agg = await Review.aggregate([
        {$match: { productId }},
        {$group: { _id: "$productId", count: { $sum: 1 }, avg: { $avg: "$rating" }}},
    ]);

    const { count = 0, avg = 0 } = agg[0] || {};
    await Product.findByIdAndUpdate(productId, { ratingAvg: avg, ratingCount: count });
}

// 리뷰 생성
export async function addReview({ productId, userId, content, rating }) {

    // 리뷰 생성/업서트(중복 제한 인덱스가 있으니 insert 한 번 시도)
    const review = await Review.create({ productId, userId, content, rating });

    // 리뷰의 개수와 평점의 평균을 구함
    recalcProductRating(productId);

    return review;
}

// 리뷰 수정
export async function updateReview({ reviewId, userId, content, rating }) {
    const review = await Review.findOne({ _id: reviewId, userId: userId}); // 리뷰 작성자 본인만 가능
    if (!review) return null;
    if (typeof content == "string") review.content = content.trim();
    if (typeof rating == "number") review.rating = rating;
    await review.save();
    await recalcProductRating(review.productId);
    return review;
}

// 리뷰 삭제
export async function deleteReview({ reviewId, userId, isAdmin = false }) {
    const review = await Review.findById(reviewId);
    if (!review) return null;

    if (!isAdmin && review.userId.toString() !== String(userId)) {
        // 관리자면 무시, 아니면 본인 검증
        return false;
    }
    const productId = review.productId;
    await review.deleteOne();
    await recalcProductRating(productId);
    return true;
}

// 특정 상품의 리뷰 목록 (페이지네이션)
export async function listReviews({ productId, page = 1, limit = 10 }) {
    const p = Math.max(1, Number(page));
    const l = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
        Review.find({ productId })
            .populate("userId", "username") // 작성자 표시용
            .sort({ createdAt: -1 })
            .skip(( p - 1 ) * l)
            .limit(l)
            .lean(),
        Review.countDocuments({ productId })
    ])

    return {
        items,
        total,
        page: p,
        limit: l,
        pageCount: Math.max(1, Math.ceil(total / l))
    };
}

