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