import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,  
    image: String,
    qty: Number,
  }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "PAID", "CANCELED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 1000 * 60 * 60 * 6 }, // 6시간 뒤 자동삭제
  paidAt: Date,
  pg: String,
  pgPayload: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// 로그인 결제만 허용하므로 userId는 항상 존재.
// 한 사용자당 PENDING 주문은 딱 1개만.
OrderSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } }
);

// TTL 인덱스 설정
OrderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Order", OrderSchema);
      