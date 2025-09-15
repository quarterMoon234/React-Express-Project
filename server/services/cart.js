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

export async function updateItemQty({ cartId, userId, productId, qty }) {
  // 카트 조회 (로그인/비로그인 공통)
  let cart = userId
    ? await Cart.findOne({ userId })
    : await Cart.findOne({ cartId });

  if (!cart) {
    throw new AppError(404, "장바구니를 찾을 수 없습니다.");
  }

  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx === -1) {
    throw new AppError(404, "해당 상품이 장바구니에 없습니다.");
  }

  if (qty <= 0) {
    // 0 이하는 제거
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = qty;
  }

  if (!userId) {
    touchGuestExpiry(cart);
  }
  await cart.save();

  // 최신 상태 반환 (프론트에서 즉시 반영)
  return Cart.findById(cart._id).populate("items.productId");
}

export async function promoteGuestCartToUser({ cartId, userId }) {
  if (!cartId) return { promoted: false };
  const cart = await Cart.findOne({ cartId });
  if (!cart) return { promoted: false };

  cart.userId = userId;
  cart.expiresAt = null;
  await cart.save();
  return { prometed: true }; // 객체를 리턴하는 이유는 controller에게 단순 결과를 알려주기 위함임. 리턴 안해도 상관 X
}