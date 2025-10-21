// src/pages/PayFail.jsx
import { useSearchParams } from "react-router-dom";
export default function PayFail() {
  const [sp] = useSearchParams();
  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>결제 실패</h2>
      <p>사유: {sp.get("message") || "실패"}</p>
      <p>에러코드: {sp.get("code") || "실패"}</p>
      <a href="/checkout">다시 시도</a>
    </div>
  );
}
