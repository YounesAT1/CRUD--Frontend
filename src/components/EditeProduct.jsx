import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SubbmitLoader from "./SubbmitLoader";
import axios from "axios";
import Loader from "./Loader";
import toast from "react-hot-toast";

const EditProduct = () => {
  const [productData, setProductData] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchErr, setFetchErr] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        setProductData(response.data.product);
        console.log(response.data.product);
      } catch (error) {
        setFetchErr("Error fetching Product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );

        setCategories(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/products/${id}/edit`,
        productData
      );

      if (res.status === 201) {
        setIsLoading(false);
        navigate("/products");
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else if (err.response.status === 404) {
          setFetchErr("Product not found");
        } else {
          toast.error("Unexpected error");
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {!isLoading && fetchErr && (
        <p className="text-slate-700 text-xl">Product not found.</p>
      )}

      {isLoading && <Loader />}

      {!isLoading && !fetchErr && (
        <form
          className="space-y-4"
          autoComplete="off"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="name"
              className="mt-1 py-2 px-3 border rounded-md w-full bg-gray-200 text-slate-800 text-l placeholder:text-gray-500 outline-none"
              placeholder="Enter product name"
              value={productData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-sm font-medium mt-1 text-red-500">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="price"
              className="mt-1 py-2 px-3 border rounded-md w-full bg-gray-200 text-slate-800 text-l placeholder:text-gray-500 outline-none"
              placeholder="Enter product price"
              value={productData.price}
              onChange={handleInputChange}
            />
            {errors.price && (
              <p className="text-sm font-medium mt-1 text-red-500">
                {errors.price}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="availableQuantity"
              className="mt-1 py-2 px-3 border rounded-md w-full bg-gray-200 text-slate-800 text-l placeholder:text-gray-500 outline-none"
              placeholder="Enter product available quantity"
              value={productData.availableQuantity}
              onChange={handleInputChange}
            />
            {errors.availableQuantity && (
              <p className="text-sm font-medium mt-1 text-red-500">
                {errors.availableQuantity}
              </p>
            )}
          </div>
          <div>
            <select
              name="category_id"
              className="mt-1 py-2 px-3 border rounded-md w-full bg-gray-200 text-slate-800 text-l placeholder:text-gray-500 outline-none"
              value={productData.category_id}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm font-medium mt-1 text-red-500">
                {errors.category_id}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <button
              type="submit"
              className={`bg-slate-700 text-white px-4 py-2 rounded-md w-full font-mediumn flex justify-center items-center${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <SubbmitLoader /> : "Edit Product"}
            </button>

            <Link
              to="/products"
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
