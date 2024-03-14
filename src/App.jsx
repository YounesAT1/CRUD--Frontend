import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AddCategory,
  AddProduct,
  CategoriesList,
  CategoryDetails,
  EditeCategory,
  EditeProduct,
  Navbar,
  ProductDetails,
  ProductsList,
} from "./components";

function App() {
  return (
    <div className="max-w-7xl mx-auto">
      <BrowserRouter>
        <Navbar />
        <div className="p-4">
          <Routes>
            {/* Product Routs */}

            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/:id/edit" element={<EditeProduct />} />
            <Route path="/products/:id/show" element={<ProductDetails />} />

            {/* Categories Routs */}
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/:id/edit" element={<EditeCategory />} />
            <Route path="/categories/:id/show" element={<CategoryDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
