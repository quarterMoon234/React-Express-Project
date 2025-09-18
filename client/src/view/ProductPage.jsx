import SearchBarProducts from "./components/SearchBarGlobal";
import ProductGrid from "./ProductGrid";
import { Box } from "@mui/material";

export default function ProductPage() {
  return (
    <>
      <SearchBarProducts />
      {/* 헤더 64px + 검색바 대략 72px = 136px 정도 여백을 위에 확보 */}
      <Box sx={{ pt: "136px" }}>
        <ProductGrid />
      </Box>
    </>
  );
}
