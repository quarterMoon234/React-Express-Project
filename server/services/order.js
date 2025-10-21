import { v4 as uuid } from "uuid";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AppError from "../errors/AppError.js";

export async function createOrderFromCart({ userId, cartId }) {
  // 1) 유저 카트 우선, 없으면 cartId(게스트) 기준
  let cart = null;
  if (userId) cart = await Cart.findOne({ userId }).lean();
  if (!cart && cartId) cart = await Cart.findOne({ cartId }).lean();
  if (!cart || !cart.items?.length) throw new AppError(400, "장바구니가 비어 있습니다.");

  // 2) 상품 최신 가격으로 총액 계산 (프론트 금액은 절대 신뢰 X)
  const productIds = cart.items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const items = cart.items.map(i => {
    const p = products.find(x => String(x._id) === String(i.productId));
    const price = p?.price ?? 0;
    return {
      productId: i.productId,
      name: p?.name || "상품",
      price,
      qty: i.qty || 1,
    };
  });

  const amount = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  // 3) 주문 생성 (미결제 상태)
  const order = await Order.create({
    orderId: `ORD-${uuid()}`,
    userId: userId || null,
    items,
    amount,
    status: "PENDING",
  });

  return { orderId: order.orderId, amount: order.amount, orderDbId: order._id };
}
