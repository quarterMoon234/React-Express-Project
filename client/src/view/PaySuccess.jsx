// src/pages/PaySuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function PaySuccess() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let done = false;
    (async () => {
      if (done) return; // ✅ 이미 실행된 경우 재실행 방지
      done = true;

      try {
        const paymentKey = sp.get("paymentKey");
        const orderId = sp.get("orderId");
        const amount = Number(sp.get("amount") || 0);

        const res = await fetch(`${API_BASE}/api/payments/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "결제 승인 실패");
        }

        navigate("/order/complete", { replace: true });
      } catch (e) {
        console.error("confirm 실패:", e);
        setErr(e.message);
      }
    })();

    return () => { done = true; }; // ✅ cleanup
  }, [sp, navigate]);


  return <div>결제를 확인 중입니다...</div>;
}
