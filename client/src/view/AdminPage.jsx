import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", categoriesText: "" });

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categories = form.categoriesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      image: form.image,
      categories // ✅ 배열로 전송
    }

    await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm({ name: "", description: "", price: "", image: "", categoriesText: "" });
    fetchProducts();
  };

  return (
    <div>
      <h2>상품 관리</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="상품명" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="설명" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="가격" type="number" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="이미지 URL" value={form.image} onChange={handleChange} />
        <input name="categoriesText" placeholder="카테고리 (쉼표로 구분, 예: Shoes,Outer,Sale)" value={form.categoriesText} onChange={handleChange} />
        <button type="submit">추가</button>
        {/* ✅ 간단 프리뷰 */}
        {form.categoriesText.trim() && (
          <div style={{ fontSize: 12, color: "#555" }}>
            미리보기:&nbsp;
            {form.categoriesText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((c, i) => (
                <span
                  key={c + i}
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    marginRight: 6,
                    marginTop: 4,
                    background: "#eef",
                    borderRadius: 12,
                  }}
                >
                  {c}
                </span>
              ))}
          </div>
        )}
      </form>

      <ul style={{ marginTop: 16 }}>
        {products.map((p) => (
          <li key={p._id} style={{ marginBottom: 8 }}>
            <div>
              <strong>{p.name}</strong> - {p.price?.toLocaleString?.() || 0}원
            </div>

            {/* ✅ 저장된 카테고리 표시 */}
            {!!(p.categories && p.categories.length) && (
              <div style={{ marginTop: 4, fontSize: 12, color: "#333" }}>
                카테고리:&nbsp;
                {p.categories.map((c, i) => (
                  <span
                    key={c + i}
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      marginRight: 6,
                      marginTop: 4,
                      background: "#f0f0f0",
                      borderRadius: 12,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <button
              style={{ marginTop: 6 }}
              onClick={() => handleDelete(p._id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
