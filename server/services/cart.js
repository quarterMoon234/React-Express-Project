import AppError from "../errors/AppError.js";
import Cart from "../models/Cart.js";
import { touchGuestExpiry } from "../utils/utils.js";

const GUEST_TTL = 1000 * 60 * 60 * 24; // 비로그인 만기시간 (1일)

export async function getCart({ userId, cartId }) {
  if (!cartId && !userId) {
    throw new AppError(400, "cartId 또는 userId 필요");
  }

  let cart = null;

  if (userId) {
    cart = await Cart.findOne({ userId }).populate("items.productId");
  }

  if (!cart && cartId) {
    cart = await Cart.findOne({ cartId }).populate("items.productId");
  }

  if (!cart) {
    cart = await Cart.create({
      cartId: cartId,
      userId: userId || null,
      items: [],
      updatedAt: new Date(),
      expiresAt: userId ? null : new Date(Date.now() + GUEST_TTL)
    });
    cart = await Cart.findById(cart._id).populate("items.productId");
  } else {
    touchGuestExpiry(cart);
    await cart.save();
    cart = await Cart.findById(cart._id).populate("items.productId");
  }

  return cart;
}

export async function addItem({ userId, cartId, productId, qty }) {
  if (!cartId && !userId) {
    throw new AppError(400, "cartId 또는 userId 필요");
  }

  let cart = userId ? await Cart.findOne({ userId }) : await Cart.findOne({ cartId });

  if (!cart) {
    cart = await Cart.create({
      userId: userId || null,
      cartId: cartId,
      items: [],
      updatedAt: new Date(),
      expiresAt: userId ? null : new Date(Date.now() + GUEST_TTL)
    });
  }

  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx >= 0) {
    cart.items[idx].qty += qty
  } else {
    cart.items.push({ productId, qty });
  }

  if (!userId) {
    touchGuestExpiry(cart);
  }
  await cart.save();
}

export async function promoteGuestCartToUser({ cartId, userId }) {
  if (!cartId) return { promoted: false };
  const cart = await Cart.findOne({ cartId });
  if (!cart) return { promoted: false };

  cart.userId = userId;
  cart.expiresAt = null;
  await cart.save();
  return { prometed: true}; // 객체를 리턴하는 이유는 controller에게 단순 결과를 알려주기 위함임. 리턴 안해도 상관 X
}