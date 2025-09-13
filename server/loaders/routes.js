import { Router } from "express";
import authRoutes from "../routes/auth.js";
import productRoutes from "../routes/product.js";
import cartRoutes from "../routes/cart.js";

export default function routesLoader(app) {
    const api = Router();

    api.use("/auth", authRoutes);
    api.use("/products", productRoutes);
    api.use("/cart", cartRoutes);
    app.use("/api", api);
}