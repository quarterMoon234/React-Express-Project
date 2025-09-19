import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import connectDB from "../config/db.js"

// ----- 옵션 파싱: --count=100 --drop 등 -----
const argv = process.argv.slice(2);
const getArg = (key, defVal) => {
    const hit = argv.find(a => a.startsWith(`--${key}=`));
    if (!hit) return defVal;
    const v = hit.split("=")[1];
    return v ?? defVal;
};
const COUNT = Number(getArg("count", 100)); // argv로 입력받은 값 혹은 기본값 100으로 개수 세팅
const DROP = argv.includes("--drop"); // true면 기존 데이터 삭제

// ---- 유틸 ----
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

// 더미 카테고리
const CATEGORY_POOL = [
    "electronics", "laptop", "phone", "tablet", "home",
    "kitchen", "fashion", "men", "women", "sports",
    "beauty", "outdoor", "toy", "book", "accessory",
];

function makeProduct(i) {
    // 카테고리 1~3개 랜덤 선택
    const cats = shuffle([...CATEGORY_POOL]).slice(0, randInt(1, 3));
    return {
        name: `테스트 상품 #${i}`,
        description: `테스트 상품 #${i}의 설명입니다.`,
        price: randInt(5000, 30000),
        image: `https://picsum.photos/seed/product-${i}/600/400`,
        categories: cats
    }
}

async function run() {
    await connectDB(); // 기존 연결 함수 사용 (env의 MONGO_URL 등)

    if (DROP) {
        console.log("🔄 Dropping Product collection...");
        await Product.deleteMany({});
    }

    console.log(`🌱 Seeding ${COUNT} products...`);
    const docs = Array.from({ length: COUNT }, (_, i) => makeProduct(i + 1));
    await Product.insertMany(docs, { ordered: false });

    // 텍스트 인덱스/카테고리/가격 인덱스가 있다면 모델에 선언된 인덱스 보장
    await Product.init();

    console.log("✅ Seeding done!");
    await mongoose.disconnect();
}

run().catch((e) => {   
  console.error("❌ Seed error:", e);
  mongoose.disconnect();
  process.exit(1);
});