import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../errors/AppError.js";
import * as paymentsService from "../services/payments.js";

export const confirm = asyncHandler(async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    await paymentsService.confirmPayment({ paymentKey, orderId, amount });

    // 기존 코드와 동일한 성공 응답
    return res.sendStatus(200);
  } catch (e) {
    // 기존 코드 스타일을 유지: AppError면 상태/메시지 그대로, 그 외 500
    if (e instanceof AppError) {
      return res.status(e.status || 400).json({
        message: e.message,
        detail: e.details, // 원래 컨트롤러 키 이름이 detail이었음
      });
    }
    console.error("/payments/confirm error", e);
    return res.status(500).json({ message: "결제 승인 오류" });
  }
});
