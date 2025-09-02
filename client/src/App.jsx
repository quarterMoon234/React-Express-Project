import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductGrid from "./view/ProductGrid";
import AdminPage from "./view/AdminPage";
import Button from "@mui/material/Button";

export default function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* 상단 네비게이션 버튼 */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            <Button variant="contained" color="primary">상품 목록</Button>
          </Link>
          <Link to="/admin">
            <Button variant="contained" color="primary">관리자 페이지</Button>
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
