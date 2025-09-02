import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Item from "./Product";
import Product from "./Product";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ p: 3 }}>
      {products.map((p) => (
        <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
          <Product product={p} />
        </Grid>
      ))}
    </Grid>
  );
}
