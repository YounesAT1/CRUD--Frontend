import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SubbmitLoader from "./SubbmitLoader";

const AddCategory = () => {
  const initialCategoryData = {
    name: "",
    description: "",
  };

  const [categoryData, setCategoryData] = useState(initialCategoryData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/categories",
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
        } else {
          toast.error("Unexpected error");
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
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
            {isLoading ? <SubbmitLoader /> : "Add Category"}
          </button>

          <Link
            to="/categories"
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full text-center font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
