import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";

const API_BASE = "http://localhost:3000";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          상품을 불러오지 못했습니다.
        </Typography>
      </Box>
    );
  }

  const categories = Array.isArray(product.categories) ? product.categories : [];

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Card sx={{ boxShadow: 4 }}>
        {/* 이미지 영역 */}
        <CardMedia
          component="img"
          sx={{ height: 400, objectFit: "cover" }}
          image={product.image || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.name}
        />

        {/* 정보 영역 */}
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          {/* 카테고리 */}
          {!!categories.length && (
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
              {categories.map((c) => (
                <Chip key={c} label={c} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>
          )}

          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" color="primary" fontWeight={700} sx={{ mb: 2 }}>
            {product.price?.toLocaleString()}원
          </Typography>

          {/* 버튼 영역 */}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">
              장바구니 담기
            </Button>
            <Button href="/" variant="outlined" color="secondary">
              계속 쇼핑하기
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
