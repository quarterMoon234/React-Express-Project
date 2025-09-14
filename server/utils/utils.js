import Cart from "../models/Cart.js";

const DURATION = 1000 * 60; // 60초

export function touchGuestExpiry(cart) {
    // 비로그인일 때만 연장
    if (!cart.userId) {
        cart.expiresAt = new Date(Date.now() + DURATION);
    }
}
