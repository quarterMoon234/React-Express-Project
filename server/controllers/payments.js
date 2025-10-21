import asyncHandler from "../utils/asyncHandler.js";
import fetch from "node-fetch";
import Order from "../models/Order.js";

export const confirm = asyncHandler(async (req, res) => {
    try {
        const { paymentKey, orderId, amount } = req.body;

        // A) 주문 검증
        const order = await Order.findOne({ orderId });
        if (!order) return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
        if (order.status !== "PENDING") return res.status(400).json({ message: "이미 처리된 주문입니다." });
        if (order.amount !== Number(amount)) return res.status(400).json({ message: "금액 불일치" });

        // 토스 승인 요청
        const secretKey = process.env.TOSS_SECRET_KEY; // 테스트 시크릿 키
        const base64 = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");
        
        const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${base64}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentKey, orderId, amount })   
        });

        if (!tossRes.ok) {
            const err = await tossRes.json().catch(() => ({})); 
            return res.status(400).json({ message: "승인 실패", detail: err });
        }

        const paid = await tossRes.json();

        // 주문 확정
        order.status = "PAID";
        order.paidAt = new Date();
        order.pg = "toss";
        order.pgPayload = paid;
        await order.save();

        return res.sendStatus(200);
        
    } catch (e) {
        console.error("/payments/confirm error", e);
        res.status(500).json({ message: "결제 승인 오류" });
    }
});