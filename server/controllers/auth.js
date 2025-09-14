import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.js";
import * as cartService from "../services/cart.js";

export const register = asyncHandler(async (req, res) => {
    const { username, password } = req.validated?.body || req.body;

    const user = await authService.registerUser({username, password}) // 회원가입 검증 비즈니스 로직
    req.session.userId = user._id;  

    return res.sendStatus(201);
});

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await authService.loginUser({ username, password }); // 로그인 검증 비즈니스 로직
    req.session.userId = user._id;

    const { cartId } = req.cookies;
    await cartService.promoteGuestCartToUser({ cartId, userId: user._id }); // 게스트 장바구니 회원 장바구니로 승격 비즈니스 로직

    return res.sendStatus(200);
})

export function logout(req, res, _next) {
    req.session.destroy(() => res.sendStatus(204));
}

// 세션 확인 (로그인 유지 확인용)
export function session(req, res, _next) {
    if (!req.session.userId) return res.sendStatus(204); // 로그인 아님
    return res.sendStatus(200); // 로그인 상태
}