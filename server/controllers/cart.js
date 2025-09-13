import * as cartService from "../services/cart.js"

export async function getCart(req, res, next) {
    try {
        const cart = await cartService.getCart({
            userId: req.session.userId,
            cartId: req.cookies.cartId
        });
        res.status(200).json(cart);
    } catch (e) {
        next(e);
    }
}   

export async function addItem(req, res, next) {
    try {
        const { productId, qty = 1 } = req.body;
        if (!productId) return res.status(400).json({ message: "productId 필요"});

        await cartService.addItem({
            userId: req.session.userId,
            cartId: req.cookies.cartId,
            productId,
            qty: Number(qty) || 1
        });
        res.sendStatus(204);
    } catch(e) {
        next(e);
    }
}