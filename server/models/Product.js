import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  categories: { type: [String], default: [], index: true}
}); 

const Product = mongoose.model("Product", ProductSchema);

export default Product;