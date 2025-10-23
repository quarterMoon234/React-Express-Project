import Product from "../models/Product.js";
import AppError from "../errors/AppError.js";

/** 상품 목록 조회 (검색/필터/정렬/페이징) */
export async function listProducts({
  q = "",
  category,
  minPrice,
  maxPrice,
  sort = "recent",
  page = 1,
  limit = 20,
}) {
  const filter = {};

  if (q.trim()) filter.$text = { $search: q.trim() };
  if (category) filter.categories = category;

  const price = {};
  if (minPrice) price.$gte = Number(minPrice);
  if (maxPrice) price.$lte = Number(maxPrice);
  if (Object.keys(price).length) filter.price = price;

  let sortSpec = { _id: -1 }; // recent
  if (sort === "price_asc") sortSpec = { price: 1, _id: -1 };
  if (sort === "price_desc") sortSpec = { price: -1, _id: -1 };

  const p = Math.max(1, Number(page));
  const cap = 100;
  const l = Math.min(cap, Math.max(1, Number(limit) || 20));

  let query = Product.find(filter).sort(sortSpec).skip((p - 1) * l).limit(l).lean();

  // text search일 때 점수 선택 + 점수로 정렬 (원 코드 동일 동작)
  if (filter.$text) {
    query = query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
  }

  const [items, total] = await Promise.all([query, Product.countDocuments(filter)]);
  const pageCount = Math.max(1, Math.ceil(total / l));

  return {
    items,
    total,
    page: p,
    limit: l,
    pageCount,
    hasMore: p < pageCount,
  };
}

/** 상품 생성 */
export async function createProduct({ name, description, price, image, categories = [] }) {
  const product = await Product.create({ name, description, price, image, categories });
  return product;
}

/** 단일 상품 조회 (원 코드처럼 없으면 null 반환, 404 처리 안 함) */
export async function findProductById(id) {
  const product = await Product.findById(id);
  return product; // null 일 수 있음 (컨트롤러에서 그대로 200으로 보냄)
}

/** 상품 수정 (없으면 404) */
export async function updateProductById(id, payload) {
  const updated = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(404, "상품을 찾을 수 없습니다.");
  }
  return updated;
}

/** 상품 삭제 (없으면 404) */
export async function removeProductById(id) {
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(404, "상품을 찾을 수 없습니다.");
  }
  return; // 204 No Content
}
