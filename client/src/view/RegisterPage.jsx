import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, TextField, Button, Typography, InputAdornment, IconButton, Alert } from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAddAlt1 as RegisterIcon } from "@mui/icons-material";

import AuthLayout from "./layout/AuthLayout";
import AuthCard from "./layout/AuthCard";

export default function RegisterPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrMsg("아이디는 공백일 수 없습니다.")
      return;
    }
    if (!password.trim() || password.length < 10) {
      setErrMsg("비밀번호는 10자 이상으로 작성해주세요.")
      return;
    }
    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      onLogin(true);
      navigate("/", {
        state: {
          flash: { type: "success", message: "회원가입이 완료되었습니다. 환영합니다!" }
        }
      });

    } else {
      const data = await res.json();
      setErrMsg(data.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Typography variant="h5" fontWeight={700} mb={1}>
          회원가입
        </Typography>

        {errMsg && <Alert severity="error" sx={{ mb: 2 }}>{errMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="medium"
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            label="비밀번호"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(v => !v)} edge="end">
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<RegisterIcon />}
            fullWidth
            disabled={loading}
            sx={{
              mt: 3, py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: 700,
              backgroundColor: "#00a5cf",
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            {loading ? "회원가입 중..." : "등록"}
          </Button>
        </Box>

        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary" }}>
          <span>아이디가 없으신가요?</span>
          <a href="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
            회원가입
          </a>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
