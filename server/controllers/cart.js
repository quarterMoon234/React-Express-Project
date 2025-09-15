import * as cartService from "../services/cart.js"
import asyncHandler from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart({
    userId: req.session.userId,
    cartId: req.cookies.cartId  
  });
  res.status(200).json(cart);
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;

  await cartService.addItem({
    userId: req.session.userId,
    cartId: req.cookies.cartId,
    productId,
    qty: Number(qty) || 1,
  });

  res.sendStatus(204);
});

export const updateItemQty = asyncHandler(async (req, res) => {
  const { productId, qty } = req.validated.body;
  const cart = await cartService.updateItemQty({
    cartId: req.cookies.cartId,
    userId: req.session.userId,
    productId,
    qty
  });
  // 프런트에서 바로 갱신할 수 있도록 최신 카트 반환
  res.status(200).json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await cartService.updateItemQty({
    userId: req.session.userId,
    cartId: req.cookies.cartId,
    productId,
    qty: 0,                  // ✅ 0이면 서버에서 해당 아이템 제거
  });
  
  res.status(200).json(cart); // 최신 카트 반환
});