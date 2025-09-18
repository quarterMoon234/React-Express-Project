import AppError from "../errors/AppError.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
    const {
        q = "", // 검색어
        category, //카테고리
        minPrice, // 가격 필터링
        maxPrice, // 가격 필터링
        sort = "recent", // 정렬 방식
        page = 1, // 현재 페이지
        limit = 20 // 페이지당 상품 수
    } = req.query;

    const filter = {};

    if (q.trim()) filter.$text = { $search: q.trim() };
    if (category) filter.categories = category;

    const price = {};
    if (minPrice) price.$gte = Number(minPrice);
    if (maxPrice) price.$lte = Number(maxPrice);
    if (Object.keys(price).length) filter.price = price;

    let sortSpec = { _id: -1 }; //recent
    if (sort === "price_asc") sortSpec = { price: 1, _id: -1 };
    if (sort === "price_desc") sortSpec = { price: -1, _id: -1 };

    const p = Math.max(1, Number(page)); // page 값이 올바른 수인지 점검 (1 이상 & 정수)
    const cap = 100; // 한 페이지의 노출할 수 있는 최대 상품 수
    const l = Math.min(cap, Math.max(1, Number(limit) || 20)); // 한 페이지의 노출할 상품 수가 cap을 넘지 않고 1 이상 정수인지 점검

    let query = Product.find(filter).sort(sortSpec).skip((p - 1) * l).limit(l).lean();

    if (filter.$text) {
        query = query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    }

    const [items, total] = await Promise.all([query, Product.countDocuments(filter)]); // 
    const pageCount = Math.max(1, Math.ceil(total / l));

    res.status(200).json({
        items,
        total,
        page: p,
        limit: l,
        pageCount,
        hasMore: p < pageCount
    })
})

export const create = asyncHandler(async (req, res) => {
    const { name, description, price, image, categories = [] } = req.body; // req.validated 로 받아야 할 수도 있음 추후 TODO 요소임 아래도 전부 바꿔야 함
    const product = await Product.create({ name, description, price, image, categories });
    res.status(201).json(product);
})

export const update = asyncHandler(async (req, res) => {
    const updated = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updated) {
        throw new AppError(404, "상품을 찾을 수 없습니다.");
    }
    res.status(200).json(updated);
})

export const remove = asyncHandler(async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
        throw new AppError(404, "상품을 찾을 수 없습니다.");
    }
    res.status(204).send();
})