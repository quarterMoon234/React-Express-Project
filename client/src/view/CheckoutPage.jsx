// src/pages/CheckoutPage.jsx
import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CheckoutPage() {
  const [order, setOrder] = useState(null); // {orderId, amount}
  const [err, setErr] = useState("");

  const createdRef = useRef(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (createdRef.current) return;
    createdRef.current = true;

    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data?.message || "주문 생성 실패");
        }
        const data = await r.json();
        setOrder(data);
      } catch (e) {
        setErr(e.message || "주문 생성 실패");
      }
    })();
  }, []);

  useEffect(() => {
    // 2) 토스 결제 위젯 로드 & 렌더
    if (!order) return;
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        import.meta.env.VITE_TOSS_CLIENT_KEY, // 공개키(테스트)
        "guest-user" // 고객식별자(문자열, 선택)
      );
      paymentWidget.renderPaymentMethods("#payment-methods", { value: order.amount });
      widgetRef.current = paymentWidget;
    })();
  }, [order]);

  const requestPay = async () => {
    if (!order || !widgetRef.current) return;
    await widgetRef.current.requestPayment({
      orderId: order.orderId,
      orderName: "장바구니 결제",
      customerName: "게스트",
      successUrl: `${window.location.origin}/pay/success`,
      failUrl: `${window.location.origin}/pay/fail`,
    });
  };

  if (err) return <div style={{ maxWidth: 520, margin: "40px auto" }}>에러: {err}</div>;
  if (!order) return <div style={{ maxWidth: 520, margin: "40px auto" }}>주문 준비중...</div>;

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>결제 테스트</h2>
      <p>주문번호: {order.orderId}</p>
      <p>금액: {order.amount.toLocaleString()}원</p>
      <div id="payment-methods" style={{ margin: "16px 0" }} />
      <button onClick={requestPay}>결제하기</button>
    </div>
  );
}
