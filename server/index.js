import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import session from "express-session"
import bcrypt from "bcryptjs"
import cors from "cors";
import cookieParser from "cookie-parser";
import {v4 as uuid} from "uuid"; 

import User from "./models/User.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js"

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // React 연결
app.use(express.json()); // JSON 요청 받기

app.use(cookieParser());

function ensureCartId(req, res, next) {
  if (!req.cookies.cartId) {
    const newId = uuid();
    res.cookie("cartId", newId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
      path: "/" 
    });
    req.cookies.cartId = newId;
  }
  next();
}

app.use(ensureCartId);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, 
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    }
  })
);  

async function getOrCreateCartByCartId(cartId) {
  let cart = await Cart.findOne({ cartId });
  if (cart) {
    return cart;
  }
  return await Cart.create({ cartId });
}

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
  
  const cartId = req.cookies.cartId;
  if (cartId) {
    const cart = await Cart.findOne({ cartId });
    if (cart) {
      cart.userId = user._id;
      await cart.save();
    }
  }

  res.sendStatus(200);
});

// 로그아웃 
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.sendStatus(204));
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

// 세션 확인 (로그인 유지 확인용)
app.get("/api/session", (req, res) => {
  if (!req.session.userId) return res.sendStatus(204); // 로그인 아님
  return res.sendStatus(200);                           // 로그인 상태
});

app.get("/api/cart", async (req, res) => {
  try {
    let cart;
    if (req.session.userId) {
      // 우선 userId로 카트 조회
      cart = await Cart.findOne({ userId: req.session.userId }).populate("items.productId");
    }
    if (!cart && req.cookies.cartId) {
      // 로그인 전의 cartId로 조회
      cart = await Cart.findOne({ cartId: req.cookies.cartId }).populate("items.productId");
    }
    if (!cart) {
      // 아예 없으면 새로 생성
      cart = await Cart.create({ cartId: req.cookies.cartId, userId: req.session.userId, items: [] });
    }

    res.json(cart);
  } catch (e) {
    console.error("GET /api/cart error", e);
    res.status(500).json({ message: "카트 조회 실패" });
  }
});


app.post("/api/cart/items", async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "productId 필요" });

    const cart = await getOrCreateCartByCartId(req.cookies.cartId);

    // 이미 담겨있으면 수량 증가, 없으면 추가
    const idx = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );
    if (idx >= 0) {
      cart.items[idx].qty += Number(qty) || 1;
    } else {
      cart.items.push({ productId, qty: Number(qty) || 1 });
    }

    await cart.save();

    res.sendStatus(204)
  } catch (e) {
    console.error("POST /api/cart/items error:", e);
    res.status(500).json({ message: "장바구니 담기 실패" });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
