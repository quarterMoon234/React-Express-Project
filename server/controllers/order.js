import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/order.js";

export const create = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ messaeg: "로그인이 필요합니다." });

    const { orderId, amount } = await orderService.createOrderFromCart(userId);
    return res.status(200).json({ orderId, amount });
  } catch (e) {
    return next(e);
  }
});
