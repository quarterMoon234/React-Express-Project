import crypto from "node:crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import AppError from "../errors/AppError.js";

export async function createOrderFromCart(userId) {
  // 컨트롤러에서 userId 미인증 응답을 하므로, 여기서는 비즈니스만 처리
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || !cart.items?.length) {
    // 기존 컨트롤러의 400 응답을 서비스에서는 예외로 위임
    throw new AppError(400, "장바구니가 비어 있습니다.");
  }

  // 장바구니 스냅샷
  const snapItems = cart.items.map((it) => ({
    productId: it.productId._id,
    name: it.productId.name,
    price: it.productId.price,
    image: it.productId.image,
    qty: it.qty,
  }));

  // 금액 합계
  const amount = snapItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (amount <= 0) {
    throw new AppError(400, "결제 금액이 올바르지 않습니다.");
  }

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

  return { orderId: order.orderId, amount: order.amount };
}
