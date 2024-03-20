import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        if (response.status === 200) {
          setProduct(response.data.product);
        } else {
          setError("Failed to fetch product");
        }
      } catch (error) {
        setError("Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 bg-red-100 border border-red-300 p-2 mb-4">
          {error}
        </p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr className="text-left text-slate-700">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Available Quantity</th>
              <th className="p-2">Category</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">{product.id}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.availableQuantity}</td>
              <td className="p-2">{product.category_id}</td>
              <td className="p-2">{formatDate(product.created_at)}</td>
              <td className="p-2">{formatDate(product.updated_at)}</td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="mt-4">
        <Link
          to="/products"
          className="text-sm font-medium bg-slate-700 text-white p-2 rounded-md mt-3"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
