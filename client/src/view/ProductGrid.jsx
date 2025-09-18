import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  Grid,
  Stack,
  Pagination,
  Snackbar,
  Alert,
  TextField,
  Box,
  Button,
  AppBar,
  Toolbar,
  Container
} from "@mui/material";

import Product from "./Product";

const API_BASE = "http://localhost:3000";

export default function ProductGrid() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [limit] = useState(20);
  const [pageCount, setPageCount] = useState(1);
  const [flash, setFlash] = useState(null);

  const q = searchParams.get("q") || ""; // <- 전역 검색바가 넣어준 q를 사용

  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("limit", String(limit));

    fetch(`${API_BASE}/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        // 컨트롤러가 {items,total,page,pageCount,...} 형태면 아래처럼
        setProducts(data.items || []);
        setPageCount(data.pageCount || 1);
      })
      .catch(err => {
        console.error("상품 로드 실패:", err);
        setProducts([]);
        setPage(1);
      });
  }, [q, page, limit]);

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
          <Grid key={p._id} item xs={12} sm={6} md={4} lg={3}>
            <Product product={p} />
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" sx={{ mt: 3 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_e, v) => setPage(v)}
          color="primary"
        />
      </Stack>
    </>
  );
}
