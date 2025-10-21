import { Router } from "express";
import authRoutes from "../routes/auth.js";
import productRoutes from "../routes/product.js";
import cartRoutes from "../routes/cart.js";
import reviewRoutes from "../routes/review.js";
import orderRoutes from "../routes/order.js";
import paymentsRoutes from "../routes/payments.js";

export default function routesLoader(app) {
    const api = Router();

    api.use("/auth", authRoutes);
    api.use("/products", productRoutes);
    api.use("/products", reviewRoutes);
    api.use("/cart", cartRoutes);
    api.use("/orders", orderRoutes);
    api.use("/payments", paymentsRoutes);
    app.use("/api", api);
}