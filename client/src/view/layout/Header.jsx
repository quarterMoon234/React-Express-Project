import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CustomButton from "../components/CustomButton";

export default function Header({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("로그아웃 요청 실패:", err);
        } finally {
            onLogout();
            navigate("/", { state: { flash: { type: "info", message: "로그아웃 되었습니다." } } })
        }
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#a2d6f9" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* 왼쪽 영역 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                        쇼핑몰
                    </Typography>
                    <CustomButton
                        to="/"
                        variant="outlined"
                        sx={{
                            backgroundColor: "black", // 배경색
                            color: "white",           // 텍스트 색상
                            borderColor: "white",   // ✅ 테두리 색상 변경
                            "&:hover": {
                                backgroundColor: "#222",   // hover 시 배경
                                borderColor: "white",        // hover 시 테두리
                                color: "white",           // hover 시 텍스트
                            },
                        }}
                    >
                        상품 목록
                    </CustomButton>
                    <CustomButton
                        to="/cart"
                        variant="outlined"
                        sx={{
                            backgroundColor: "black", // 배경색
                            color: "white",           // 텍스트 색상
                            borderColor: "white",   // ✅ 테두리 색상 변경
                            "&:hover": {
                                backgroundColor: "#222",   // hover 시 배경
                                borderColor: "white",        // hover 시 테두리
                                color: "white",           // hover 시 텍스트
                            },
                        }}
                    >
                        장바구니
                    </CustomButton>
                </Box>

                {/* 오른쪽 영역 */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <CustomButton
                        to="/admin"
                        variant="outlined"
                        sx={{
                            backgroundColor: "black", // 배경색
                            color: "white",           // 텍스트 색상
                            borderColor: "white",   // ✅ 테두리 색상 변경
                            "&:hover": {
                                backgroundColor: "#222",   // hover 시 배경
                                borderColor: "white",        // hover 시 테두리
                                color: "white",           // hover 시 텍스트
                            },
                        }}
                    >
                        관리자 페이지
                    </CustomButton>
                    {!isLoggedIn ? (
                        <>
                            <CustomButton
                                to="/login"
                                variant="outlined"
                                sx={{
                                    backgroundColor: "black", // 배경색
                                    color: "white",           // 텍스트 색상
                                    borderColor: "white",   // ✅ 테두리 색상 변경
                                    "&:hover": {
                                        backgroundColor: "#222",   // hover 시 배경
                                        borderColor: "white",        // hover 시 테두리
                                        color: "white",           // hover 시 텍스트
                                    },
                                }}
                            >
                                로그인
                            </CustomButton>
                            <CustomButton
                                to="/register"
                                variant="outlined"
                                sx={{
                                    backgroundColor: "black", // 배경색
                                    color: "white",           // 텍스트 색상
                                    borderColor: "white",   // ✅ 테두리 색상 변경
                                    "&:hover": {
                                        backgroundColor: "#222",   // hover 시 배경
                                        borderColor: "white",        // hover 시 테두리
                                        color: "white",           // hover 시 텍스트
                                    },
                                }}
                            >
                                회원가입
                            </CustomButton>
                        </>
                    ) : (
                        <CustomButton
                            onClick={handleLogout}
                            variant="outlined"
                            sx={{
                                backgroundColor: "black", // 배경색
                                color: "white",           // 텍스트 색상
                                borderColor: "white",   // ✅ 테두리 색상 변경
                                "&:hover": {
                                    backgroundColor: "#222",   // hover 시 배경
                                    borderColor: "white",        // hover 시 테두리
                                    color: "white",           // hover 시 텍스트
                                },
                            }}
                        >
                            로그아웃
                        </CustomButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar >
    );
}