import { useParams } from "react-router-dom";
import ProductsAdmin from "./ProductsAdmin";

const ProductsAdminWrapper = () => {
  const { category } = useParams();
  return <ProductsAdmin category={category || "all"} />;
};

export default ProductsAdminWrapper;
