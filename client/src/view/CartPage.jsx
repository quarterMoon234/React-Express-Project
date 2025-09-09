import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Button,
} from "@mui/material";

// 금액 표시 유틸
function currency(n) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("ko-KR") + "원";
}

/**
 * 조회 전용 장바구니 페이지
 * 서버는 GET /api/cart 를 제공한다고 가정.
 * - populate 되어 p = item.productId({ _id, name, price, image })가 오는 경우를 우선 가정
 * - populate가 없다면 p가 ObjectId일 수 있으므로 방어코드 포함
 */
export default function CartPage() {
  const [cart, setCart] = useState(null); // { items: [{ productId: {...}, qty, priceAtAdd? }], ... }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchCart = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch( "http://localhost:3000/api/cart" , {
        credentials: "include", // cartId 쿠키 포함
      });
      if (!res.ok) throw new Error("장바구니를 불러오지 못했습니다.");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      setErr(e.message || "에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, it) => {
      const p = it.productId;
      const price =
        typeof it.priceAtAdd === "number"
          ? it.priceAtAdd
          : (p && typeof p.price === "number" ? p.price : 0);
      return sum + price * (it.qty || 0);
    }, 0);
  }, [cart]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        장바구니
      </Typography>

      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {!cart?.items?.length ? (
        <Card sx={{ p: 3 }}>
          <Typography>장바구니가 비어 있습니다.</Typography>
          <Button href="/" sx={{ mt: 2 }} variant="contained">
            상품 보러가기
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {cart.items.map((it, idx) => {
            const p = it.productId; // populate되면 객체, 아니면 ObjectId
            const name = p && p.name ? p.name : "상품명";
            const image =
              p && p.image
                ? p.image
                : "https://via.placeholder.com/120x120?text=No+Image";
            const price =
              typeof it.priceAtAdd === "number"
                ? it.priceAtAdd
                : p && typeof p.price === "number"
                ? p.price
                : 0;

            return (
              <Card key={p?._id || idx} sx={{ overflow: "hidden" }}>
                <Box sx={{ display: "flex", alignItems: "stretch" }}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={name}
                    sx={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      단가: {currency(price)}
                    </Typography>
                    <Typography sx={{ mt: 1.5 }} fontWeight={700}>
                      수량: {it.qty} &nbsp;|&nbsp; 합계: {currency(price * (it.qty || 0))}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            );
          })}

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.03)",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              총 주문 금액
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {currency(subtotal)}
            </Typography>
          </Box>

          {/* 조회 전용이므로 버튼은 링크 정도만 제공 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" href="/">
              계속 쇼핑하기
            </Button>
            <Button
              variant="contained"
              disabled
              title="결제는 추후 구현 예정입니다."
            >
              결제하기 (준비중)
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
