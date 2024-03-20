import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CirclePlus, Pen, ReceiptText, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductsList = () => {
  const [products, setproducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/products");

        setproducts(response.data);
      } catch (error) {
        setError("Error fetching Products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/products/${productId}/delete`
      );

      if (response.status === 200) {
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        setproducts(updatedProducts);
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Product not found");
            break;
          default:
            toast.error("Error deleting Product");
        }
      } else {
        toast.error("Error deleting Product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-medium text-slate-600 ">Products</h1>
        <Link
          to="/products/add"
          className="bg-gray-200 text-slate-700 p-2 rounded-full"
        >
          <CirclePlus />
        </Link>
      </div>

      {isLoading && <Loader />}
      {error && (
        <p className="text-red-500 bg-red-100 border border-red-300 p-2 mb-4">
          {error}
        </p>
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-slate-700 text-xl">No products available.</p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr className="text-left text-slate-700">
              <th className=" p-2">ID</th>
              <th className=" p-2">Name</th>
              <th className=" p-2">Price</th>
              <th className=" p-2">Available Quantity</th>
              <th className=" p-2">Category</th>
              <th className=" p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className=" p-2">{product.id}</td>
                <td className=" p-2">{product.name}</td>
                <td className=" p-2">{product.price} $</td>
                <td className=" p-2">{product.availableQuantity}</td>
                <td className=" p-2">{product.category.name}</td>
                <td className="flex items-center justify-center my-1 gap-x-1">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    <Pen size={20} />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <Trash size={20} />
                  </button>
                  <Link
                    to={`/products/${product.id}/show`}
                    className="bg-green-500 text-white  p-2 rounded"
                  >
                    <ReceiptText size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsList;
