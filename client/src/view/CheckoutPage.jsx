import { useEffect, useMemo, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const API_BASE = import.meta.env.VITE_API_BASE;
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

export default function CheckoutPage() {
  // 상태
  const [order, setOrder] = useState(null);        // { orderId, amount }
  const [loading, setLoading] = useState(false);   // 주문 생성 로딩
  const [error, setError] = useState("");          // 사용자 표시용 에러
  const [reqPaying, setReqPaying] = useState(false); // 결제 요청 중복 방지

  // refs
  const abortRef = useRef(null);     // fetch 취소용
  const widgetRef = useRef(null);    // 결제 위젯 인스턴스 ref
  const containerId = useMemo(() => "payment-methods", []); // 컨테이너 id 고정

  // 필수 ENV 체크 (초기 한 번)
  useEffect(() => {
    if (!API_BASE) {
      setError("환경변수 VITE_API_BASE가 설정되지 않았습니다.");
    } else if (!TOSS_CLIENT_KEY) {
      setError("환경변수 VITE_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
    }
  }, []);

  // 1) 주문 생성
  useEffect(() => {
    if (error || order || !API_BASE) return;

    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const r = await fetch(`${API_BASE}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: ac.signal,
        });

        // 에러 메시지 보존
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(data?.message || "주문 생성 실패");
        }

        setOrder(data); // { orderId, amount }
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "주문 생성 실패");
        }
      } finally {
        setLoading(false);
      }
    })();

    // 언마운트/재요청 시 취소 + 위젯/DOM 정리
    return () => {
      ac.abort();
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = ""; // 위젯 컨테이너 정리
      widgetRef.current = null;
    };
  }, [API_BASE, containerId, error, order]);

  // 2) 토스 결제 위젯 로드 & 렌더 (order.amount가 준비되면)
  useEffect(() => {
    if (!order?.amount || !TOSS_CLIENT_KEY) return;

    let cancelled = false;
    (async () => {
      try {
        const widget = await loadPaymentWidget(TOSS_CLIENT_KEY, "guest-user");
        if (cancelled) return;

        // 결제수단 렌더
        await widget.renderPaymentMethods(`#${containerId}`, { value: order.amount });
        widgetRef.current = widget;
      } catch (e) {
        if (!cancelled) setError(e.message || "결제 위젯 로드 실패");
      }
    })();

    return () => {
      cancelled = true;
      // 컨테이너 정리
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = "";
      widgetRef.current = null;
    };
  }, [containerId, order?.amount]);

  // 3) 결제 요청
  const requestPay = async () => {
    if (!order || !widgetRef.current || reqPaying) return;

    try {
      setReqPaying(true);
      await widgetRef.current.requestPayment({
        orderId: order.orderId,
        orderName: "장바구니 결제",
        customerName: "게스트",
        successUrl: `${window.location.origin}/pay/success`,
        failUrl: `${window.location.origin}/pay/fail`,
      });
      // requestPayment 내부에서 페이지 이동하므로 여기까지 오면 실패 케이스
    } catch (e) {
      setError(e.message || "결제 요청 실패");
    } finally {
      setReqPaying(false);
    }
  };

  // UI
  if (error) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto", color: "crimson" }}>
        에러: {error}
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto" }}>
        주문 준비중...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>결제 테스트</h2>
      <p>주문번호: {order.orderId}</p>
      <p>금액: {order.amount.toLocaleString()}원</p>

      <div id={containerId} style={{ margin: "16px 0" }} />

      <button onClick={requestPay} disabled={reqPaying}>
        {reqPaying ? "결제 요청중..." : "결제하기"}
      </button>
    </div>
  );
}
