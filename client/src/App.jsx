import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import ProductGrid from "./view/ProductGrid";
import AdminPage from "./view/AdminPage";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          <button>상품목록</button>
        </Link>
        <Link to="/admin" style={{ marginRight: "10px" }}>
          <button>관리자 페이지</button>
        </Link>
        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>
              <button>로그인</button>
            </Link>
            <Link to="/register">
              <button>회원가입</button>
            </Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ProductGrid />
          </ProtectedRoute>
        }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage onLogin={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage onLogin={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

// ProtectedRoute 컴포넌트
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
