import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    qty: { type: Number, default: 1, min: 1 },
}, { _id: false });

const CartSchema = new mongoose.Schema({
    cartId: { type: String, index: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    items: { type: [CartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null}
});

CartSchema.pre("save", function(next) {
    this.updatedAt = new Date();
    next(); 
})

CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;