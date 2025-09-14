import AppError from "../errors/AppError.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
    const products = await Product.find({}).lean();
    res.status(200).json(products);
})

export const create = asyncHandler(async (req, res) => {
    const { name, description, price, image } = req.body; // req.validated 로 받아야 할 수도 있음 추후 TODO 요소임 아래도 전부 바꿔야 함
    const product = await Product.create({ name, description, price, image });
    res.status(201).json(product);
})

export const update = asyncHandler(async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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