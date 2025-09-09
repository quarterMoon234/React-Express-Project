import Cart from "../models/Cart.js";

const DURATION = 1000 * 60; // 60초

export function touchGuestExpiry(cart) {
    // 비로그인일 때만 연장
    if (!cart.userId) {
        cart.expiresAt = new Date(Date.now() + DURATION);
    }
}

export function promoteToUserCart(cart, userId) {
    cart.userId = userId;
    // 회원으로 승격되면 TTL 대상 제외
    cart.expiresAt = null;
}

export async function getOrCreateCartByCartId(cartId) {
    let cart = Cart.findOne({ cartId });

    if (!cart) {
        cart = await Cart.create({
            cartId,
            items: [],
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });
        if (populate) cart = await Cart.findById(cart._id).populate("items.productId");
        return cart;
    }

    // 읽을 때도 게스트라면 만료 연장(선택)
    touchGuestExpiry(cart);
    await cart.save();
    return populate ? Cart.findById(cart._id).populate("items.productId") : cart;
}