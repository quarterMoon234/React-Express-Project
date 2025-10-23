import fetch from "node-fetch";
import Order from "../models/Order.js";
import AppError from "../errors/AppError.js";

export async function confirmPayment({ paymentKey, orderId, amount }) {
  // A) 주문 검증
  const order = await Order.findOne({ orderId });
  if (!order) throw new AppError(404, "주문을 찾을 수 없습니다.");
  if (order.status !== "PENDING") throw new AppError(400, "이미 처리된 주문입니다.");
  if (order.amount !== Number(amount)) throw new AppError(400, "금액 불일치");

  // 토스 승인 요청
  const secretKey = process.env.TOSS_SECRET_KEY; // 테스트 시크릿 키
  const base64 = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${base64}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!tossRes.ok) {
    const err = await tossRes.json().catch(() => ({}));
    // 컨트롤러의 기존 응답과 동일한 의미: 400 + "승인 실패" + detail
    throw new AppError(400, "승인 실패", err);
  }

  const paid = await tossRes.json();

  // 주문 확정
  order.status = "PAID";
  order.paidAt = new Date();
  order.pg = "toss";
  order.pgPayload = paid;
  await order.save();

  // 컨트롤러는 200만 보내면 되므로 반환값은 없어도 OK
  return;
}
