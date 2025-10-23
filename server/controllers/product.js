import asyncHandler from "../utils/asyncHandler.js";
import * as productService from "../services/product.js"

// GET /products
export const list = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.status(200).json(result);
});

// POST /products
export const create = asyncHandler(async (req, res) => {
  const { name, description, price, image, categories = [] } = req.body;
  const product = await productService.createProduct({ name, description, price, image, categories });
  res.status(201).json(product);
});

// GET /products/:id
export const find = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.findProductById(id);
  // 원 코드 그대로: not found여도 200에 null 반환
  res.status(200).json(product);
});

// PATCH/PUT /products/:id
export const update = asyncHandler(async (req, res) => {
  const updated = await productService.updateProductById(req.params.id, req.body);
  res.status(200).json(updated);
});

// DELETE /products/:id
export const remove = asyncHandler(async (req, res) => {
  await productService.removeProductById(req.params.id);
  res.status(204).send();
});
