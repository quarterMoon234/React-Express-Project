import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session"
import bcrypt from "bcryptjs"
import cors from "cors";

import User from "./models/User.js";
import Product from "./models/Product.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // React 연결
app.use(express.json()); // JSON 요청 받기

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1시간
    sameSite: "lax",
    secure: false
  })
);

// DB연결
mongoose.connect("mongodb://localhost:27017/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 회원가입
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // 아이디 유효성검사
  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "아이디는 공백일 수 없습니다." });
  }

  // 비밀번호 유효성검사
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "비밀번호는 10자 이상으로 작성해주세요. (백엔드)" });
  }

  // 이미 존재하는 아이디 체크
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "이미 존재하는 아이디입니다." });

  // 비밀번호 해싱 후 저장
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });

  req.session.userId = newUser._id; // 회원가입 후 바로 로그인 처리 <- TODO: 회원가입 후 다시 로그인하도록 수정
  // 회원가입 성공 시
  res.sendStatus(201); // 201 Created
});

// 로그인 
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "아이디를 입력해주세요." });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "비밀번호를 입력해주세요." });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "계정을 찾을 수 없습니다." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  req.session.userId = user._id;
  
  res.sendStatus(200);
});

// 로그아웃 
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "로그아웃 완료" });
  });
});

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

// 로그인 여부 체크 미들웨어
function authMiddleware(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: "로그인 필요" });
  next();
}

// 관리자 전용 API 예시
app.get("/api/admin/products", authMiddleware, async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.listen(3000, () => console.log("Server running on port 3001"));
