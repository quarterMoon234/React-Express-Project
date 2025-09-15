import React, { useState } from "react";
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Snackbar, Alert, Chip, Stack
} from "@mui/material";

const API_BASE = "http://localhost:3000";

export default function Product({ product }) {
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg: string }

  const categories = Array.isArray(product.categories) ? product.categories : [];

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const res = await fetch(`${API_BASE}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cartId 쿠키 포함 중요!
        body: JSON.stringify({ productId: product._id, qty: 1 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "담기 실패");
      }
      setToast({ type: "success", msg: "장바구니에 담겼습니다." });
      // 필요하면 여기서 상단 배지 갱신 콜백(onAdded) 호출 가능
    } catch (e) {
      setToast({ type: "error", msg: e.message || "담기 실패" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 300, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {product.name}
          </Typography>
          {/* ✅ 카테고리 칩들 */}
          {!!categories.length && (
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", rowGap: 1 }}>
              {categories.map((c) => (
                <Chip key={c} label={c} size="small" variant="outlined" />
              ))}
            </Stack>
          )}

          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            {product.price.toLocaleString()}원
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" onClick={handleAddToCart} disabled={adding}>
            {adding ? "담는 중..." : "장바구니"}
          </Button>
          <Button size="small" variant="outlined" color="secondary">상세보기</Button>
        </CardActions>
      </Card >

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.type || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
