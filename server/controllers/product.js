import AppError from "../errors/AppError.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { categories: category } : {}; // 파라미터로 카테고리 정보가 들어왔다면 카테고리로 검색하고 아니면 그냥 전체 검색
    const products = await Product.find(filter).lean(); // 지금은 단일 카테고리를 상정하였으나 추후 여러 카테고리 OR 검색을 원하면 ?categories=Shoes,Sale 받고 { categories: { $in: ["Shoes","Sale"] } } 로 처리
    res.status(200).json(products);
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