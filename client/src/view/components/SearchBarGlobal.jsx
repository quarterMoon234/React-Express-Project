import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppBar, Toolbar, Paper, TextField, Button } from "@mui/material";

export default function SearchBarProducts() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    params.set("page", "1");
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        // ⚠️ 헤더(AppBar)가 64px이면 그 바로 아래에 고정
        top: "64px",
        left: 0,
        right: 0,
        backdropFilter: "saturate(180%) blur(4px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        zIndex: (theme) => theme.zIndex.appBar, // 컨텐츠보다 위
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 1.5 }}>
        <Paper
          component="form"
          onSubmit={onSubmit}
          elevation={3}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            py: 0.5,
            width: "min(760px, 92vw)", // 화면 전체 폭 기준 중앙 고정
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="상품 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button variant="contained" type="submit">검색</Button>
        </Paper>
      </Toolbar>
    </AppBar>
  );
}
