// src/components/AuthCard.jsx
import React from "react";
import { Card, CardContent } from "@mui/material";

export default function AuthCard({ children, width = 380 }) {
  return (
    <Card sx={{ width, borderRadius: 3, boxShadow: 6 }}>
      <CardContent sx={{ p: 4 }}>{children}</CardContent>
    </Card>
  );
}
