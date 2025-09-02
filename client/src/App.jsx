import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductGrid from "./view/ProductGrid";
import AdminPage from "./view/AdminPage";

export default function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* 상단 네비게이션 버튼 */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            <button>상품목록</button>
          </Link>
          <Link to="/admin">
            <button>관리자 페이지</button>
          </Link>
        </nav>

        {/* 라우팅 영역 */}
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}
