import { v4 as uuid } from "uuid";

export default function ensureCartId(req, res, next) {
  if (!req.cookies.cartId) {
    const newId = uuid();
    res.cookie("cartId", newId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
    req.cookies.cartId = newId;
  }
  next();
} 