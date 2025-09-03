import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Snackbar, Alert } from "@mui/material";

import Product from "./Product";

export default function ProductGrid() {
  const location = useLocation();
  const navigate = useNavigate();

  const [flash, setFlash] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // 라우터 state에 flash가 있으면 꺼내서 로컬 상태로 옮기고, history state는 깨끗이 정리
    if (location.state?.flash) {
      setFlash(location.state.flash);
      // 뒤로가기/새로고침 시 다시 뜨지 않도록 state 제거
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Grid container spacing={3} justifyContent="center" sx={{ p: 3 }}>
        {products.map((p) => (
          <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
            <Product product={p} />
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={Boolean(flash)}
        autoHideDuration={3000}
        onClose={() => setFlash(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFlash(null)}
          severity={flash?.type || "info"}
          variant="filled"
          sx={{ width: "100%" }}  
        >
          {flash?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
