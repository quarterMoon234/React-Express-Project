import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, TextField, Button, Typography, InputAdornment, IconButton, Alert } from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";

import AuthLayout from "./layout/AuthLayout";
import AuthCard from "./layout/AuthCard";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrMsg("아이디를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      setErrMsg("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onLogin(true);
        navigate("/", {
          state: {
            flash: { type: "success", message: "로그인이 완료되었습니다. 환영합니다!" }
          }
        });
      }
      else {
        const data = await res.json().catch(() => ({}));
        setErrMsg(data?.message || "로그인 실패");
      }
    } catch {
      setErrMsg("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Typography variant="h5" fontWeight={700} mb={1}>
          로그인
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
            startIcon={<LoginIcon />}
            fullWidth
            disabled={loading}
            sx={{
              mt: 3, py: 1.2, borderRadius: 2, textTransform: "none", fontWeight: 700,
              backgroundColor: "#00a5cf",
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </Box>

        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "space-between", fontSize: 14, color: "text.secondary" }}>
          <span>아이디/비밀번호를 잊으셨나요?</span>
          <a href="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
            회원가입
          </a>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
