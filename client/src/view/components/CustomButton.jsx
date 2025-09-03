// components/CustomButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function CustomButton({
  children,
  to,
  variant = "contained",
  sx = {},
  ...props
}) {    
  return (
    <Button
      variant={variant}
      component={to ? Link : "button"}
      to={to}
      sx={{
        borderRadius: "20px",        // 둥근 버튼
        textTransform: "none",       // 자동 대문자 방지
        px: 3, py: 1,                 // 패딩
        fontWeight: "bold",          // 글씨 두껍게
        boxShadow: variant === "contained" ? 3 : "none",
        "&:hover": {
          boxShadow: variant === "contained" ? 6 : "none",
        },
        ...sx, // 외부에서 추가 스타일 덮어쓰기 가능
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
