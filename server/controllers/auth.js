import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.js";
import * as cartService from "../services/cart.js";

export const register = asyncHandler(async (req, res) => {
    const { username, password } = req.validated?.body || req.body;

    const user = await authService.registerUser({ username, password }) // 회원가입 검증 비즈니스 로직
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

export const logout = asyncHandler(async (req, res, _next) => {
    req.session.destroy(() => res.sendStatus(204));
})

export const me = asyncHandler(async (req, res) => {
    if (!req.session.userId) return res.sendStatus(204);
    res.json({ id: req.session.userId }); // 필요하면 username도 포함
})
