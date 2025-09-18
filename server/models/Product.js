import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  categories: { type: [String], default: [] }
}); 

// 텍스트 인덱스 (가벼운 검색용)
ProductSchema.index({ name: "text", description: "text"});  
// 자주 쓸 필드 인덱스
ProductSchema.index({ price: 1 });
ProductSchema.index({ categories: 1 });

const Product = mongoose.model("Product", ProductSchema);

export default Product;