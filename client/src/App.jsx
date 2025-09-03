import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";

import Header from "./view/layout/Header";    
import ProductGrid from "./view/ProductGrid";
import AdminPage from "./view/AdminPage";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
        <Header isLoggedIn={false} />
        <div style={{ paddingTop: "64px" }}>
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
        </div>
    </Router>
  );
}

// ProtectedRoute 컴포넌트
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
