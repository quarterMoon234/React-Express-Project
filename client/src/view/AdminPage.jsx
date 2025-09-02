import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "" });

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
    await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setForm({ name: "", description: "", price: "", image: "" });
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
        <button type="submit">추가</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} - {p.price}원
            <button onClick={() => handleDelete(p._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
