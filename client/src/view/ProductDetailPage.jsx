import {
  Box, Card, CardContent, CardMedia, Typography, Chip, Stack, Divider, Button, CircularProgress,
  Rating, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 리뷰 상태
  const [reviews, setReviews] = useState([]);
  const [rPage, setRPage] = useState(1);
  const [rPageCount, setRPageCount] = useState(1);

  // 작성 상태
  const [myRating, setMyRating] = useState(5);
  const [myContent, setMyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 로그인 상태
  const [me, setMe] = useState(null);

  // 수정 상태
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  // 로그인 상태 확인
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(setMe)
      .catch(() => setMe(null));
  }, [])

  // 상품 불러오기
  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  // 리뷰 불러오기
  const fetchReviews = () => {
    fetch(`${API_BASE}/api/products/${id}/reviews?page=${rPage}&limit=5`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.items || []);
        setRPageCount(data.pageCount || 1);
      });
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, rPage]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!myContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: myContent, rating: myRating }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "리뷰 작성 실패");
      }
      setMyContent("");
      setMyRating(5);
      setRPage(1); // 최신이 위에 오도록 1페이지로
      fetchReviews();
    } catch (err) {
      alert(err.message); // 에러 메세지
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (r) => {
    setEditTarget(r);
    setEditContent(r.content);
    setEditRating(r.rating);
    setEditOpen(true);
  };
  const closeEdit = () => setEditOpen(false);

  // PATCH 호출
  const submitEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}/reviews/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editContent, rating: editRating }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "수정 실패");
      }
      closeEdit();
      // 리뷰와 상품 요약 갱신
      fetchReviews();
      // 평균/개수 갱신 위해 상품도 다시 로드
      fetch(`${API_BASE}/api/products/${id}`).then(r => r.json()).then(setProduct);
    } catch (e) {
      alert(e.message);
    }
  };

  // DELETE 호출
  const removeReview = async (r) => {
    if (!window.confirm("이 리뷰를 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}/reviews/${r._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "삭제 실패");
      }
      fetchReviews();
      fetch(`${API_BASE}/api/products/${id}`).then(r => r.json()).then(setProduct);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!product) {
    return <Box sx={{ textAlign: "center", mt: 5 }}><Typography color="error">상품을 불러오지 못했습니다.</Typography></Box>;
  }

  const categories = Array.isArray(product.categories) ? product.categories : [];

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Card sx={{ boxShadow: 4, mb: 3 }}>
        <CardMedia component="img" sx={{ height: 400, objectFit: "cover" }}
          image={product.image || "https://via.placeholder.com/400x400?text=No+Image"} alt={product.name} />
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>{product.name}</Typography>

          {!!categories.length && (
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
              {categories.map((c) => <Chip key={c} label={c} size="small" color="primary" variant="outlined" />)}
            </Stack>
          )}

          {/* 요약 평점 */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Rating readOnly precision={0.1} value={Number(product.ratingAvg) || 0} />
            <Typography variant="body2" color="text.secondary">
              {Number(product.ratingAvg || 0).toFixed(1)} ({product.ratingCount || 0}개)
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" color="primary" fontWeight={700} sx={{ mb: 2 }}>
            {product.price?.toLocaleString()}원
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">장바구니 담기</Button>
            <Button variant="outlined">계속 쇼핑하기</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* 리뷰 작성 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>리뷰 작성</Typography>
          <Box component="form" onSubmit={submitReview}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Rating value={myRating} onChange={(_e, v) => setMyRating(v || 5)} />
              <Typography variant="body2" color="text.secondary">{myRating} 점</Typography>
            </Stack>
            <TextField
              fullWidth multiline minRows={3}
              placeholder="상품 사용 후기를 남겨주세요."
              value={myContent}
              onChange={(e) => setMyContent(e.target.value)}
            />
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "작성 중..." : "등록"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 리뷰 목록 */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>리뷰 ({product.ratingCount || 0})</Typography>
          <Stack spacing={2}>
            {reviews.map((r) => (
              <Box key={r._id} sx={{ borderBottom: "1px solid rgba(0,0,0,0.06)", pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating readOnly size="small" value={r.rating} />
                    <Typography variant="body2" color="text.secondary">
                      {r.userId?.username || "익명"} · {new Date(r.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  {me?.id && String(me.id) === String(r.userId?._id) && (
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => removeReview(r)}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  )}
                </Stack>
                <Typography sx={{ mt: 0.5 }}>{r.content}</Typography>
              </Box>
            ))}
          </Stack>
          {/* 필요하면 Pagination 추가 */}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>리뷰 수정</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
            <Rating value={editRating} onChange={(_e, v) => setEditRating(v || 5)} />
            <Typography variant="body2">{editRating} 점</Typography>
          </Stack>
          <TextField
            fullWidth multiline minRows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>취소</Button>
          <Button onClick={submitEdit} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
