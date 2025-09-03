// src/layouts/AuthLayout.jsx
import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

/**
 * 헤더(AppBar) 높이만큼 top offset을 주고,
 * 그 아래 영역 전체를 중앙 정렬하는 레이아웃.
 * - topOffset: AppBar 높이(기본 데스크톱 64, 모바일 56)
 */
export default function AuthLayout({ children, topOffset }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const offset = topOffset ?? (isMobile ? 56 : 64); // 기본 AppBar 높이

  return (
    <Box
      sx={{
        position: "fixed",
        top: offset,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "linear-gradient(180deg, rgba(8,189,189,0.12), rgba(0,0,0,0.02))",
        // 필요 시 아래처럼 스크롤 허용
        // overflowY: "auto",
      }}
    >
      {children}
    </Box>
  );
}
