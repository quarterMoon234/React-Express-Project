import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Header from "./view/layout/Header";
import ProductGrid from "./view/ProductGrid";
import AdminPage from "./view/AdminPage";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import CartPage from "./view/CartPage";
import SearchBarGlobal from "./view/components/SearchBarGlobal";
import ProductPage from "./view/ProductPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [session, setSession] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/session", {
          credentials: "include",
        });
        setIsLoggedIn(res.status === 200); // 200이면 true, 204면 false
      } catch {
        setIsLoggedIn(false);
      } finally {
        setSession(false);
      }
    })();
  }, []);

  return (
    <Router>
      <Header isLoggedIn={!!isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      {/* 헤더 자체가 fixed면 본문에 최소한 64px padding이 필요할 수 있음 */}
      <div style={{ paddingTop: "64px" }}>
        {session ? (
          <div style={{ padding: 24 }}>세션 확인중...</div>
        ) : (
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage onLogin={setIsLoggedIn} />} />
            <Route path="/register" element={<RegisterPage onLogin={setIsLoggedIn} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

// ProtectedRoute 컴포넌트
function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

