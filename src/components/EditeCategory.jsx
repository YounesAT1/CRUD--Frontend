import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SubbmitLoader from "./SubbmitLoader";
import Loader from "./Loader";

const EditeCategory = () => {
  const [categoryData, setCategoryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchErr, setFetchErr] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/categories/${id}`
        );
        setCategoryData(response.data.category);
      } catch (error) {
        setFetchErr("Error fetching category");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/categories/${id}/edit`,
        categoryData
      );

      if (res.status === 201) {
        setIsLoading(false);
        navigate("/categories");
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
          setFetchErr("Category not found");
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
        <p className="text-slate-700 text-xl">Category not found.</p>
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
              placeholder="Enter category name"
              value={categoryData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-sm mt-1 text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <textarea
              name="description"
              rows="3"
              className="mt-1 py-2 px-3 border rounded-md w-full bg-gray-200 text-slate-800 text-l placeholder:text-gray-500 outline-none"
              placeholder="Enter category description"
              value={categoryData.description}
              onChange={handleInputChange}
            ></textarea>
            {errors.description && (
              <p className="text-sm mt-1 text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <button
              type="submit"
              className={`bg-slate-700 text-white px-4 py-2 rounded-md w-full font-mediumn flex justify-center items-center${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <SubbmitLoader /> : "Edit Category"}
            </button>

            <Link
              to="/categories"
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

export default EditeCategory;
