import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // JSON 요청 받기

mongoose.connect("mongodb://localhost:27017/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
});

const Product = mongoose.model("Product", ProductSchema);

// 상품 조회
app.get("/api/products", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// 상품 추가
app.post("/api/products", async (req, res) => {
  const { name, description, price, image } = req.body;
  const newProduct = new Product({ name, description, price, image });
  await newProduct.save();
  res.json(newProduct);
});

// 상품 수정
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedProduct);
});

// 상품 삭제
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
