import ProductsPages from "@/components/user/products/ProductPage";
import { ListCategory } from "./ListCategory/ListCategory";


export default function ProductsPage() {
  return (
    <div className="s">
      <ProductsPages />
      <ListCategory />
    </div>
  );
}
