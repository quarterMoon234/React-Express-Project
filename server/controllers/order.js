import crypto from "node:crypto";
import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/order.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const create = asyncHandler(async (req, res) => {
  const userId = req.session.userId || null;
  const cartId = req.cookies.cartId; // 게스트 식별
  const { orderId, amount } = await orderService.createOrderFromCart({ userId, cartId });
  res.status(201).json({ orderId, amount }); // 2단계에서 이 값으로 결제창 호출
});

export const ensureOrder = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ messaeg: "로그인이 필요합니다." });

    // 사용자 장바구니 가져오기 (userId 기준)
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "장바구니가 비어 있습니다." });
    }

    // 장바구니에서 상품 목록 가져오기
    const snapItems = cart.items.map(it => ({
      productId: it.productId._id,
      name: it.productId.name,
      price: it.productId.price,
      image: it.productId.image,
      qty: it.qty,
    }));

    // 상품 목록에서 결제 금액 합산 => 주문서 작성을 위해
    const amount = snapItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (amount <= 0) return res.status(400).json({ message: "결제 금액이 올바르지 않습니다." });

    // 기존 PENDING 주문 정리
    await Order.deleteMany({ userId, status: "PENDING" });

    // 새 주문 생성
    const order = await Order.create({
      orderId: `ORD-${crypto.randomUUID()}`,
      userId,
      items: snapItems,
      amount,
      status: "PENDING",
    });

    return res.status(200).json({ orderId: order.orderId, amount: order.amount });
  } catch (e) {
    return next(e);
  }
})