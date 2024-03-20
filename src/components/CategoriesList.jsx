import { useEffect, useState } from "react";
import { CirclePlus, Pen, ReceiptText, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import toast from "react-hot-toast";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );

        setCategories(response.data);
      } catch (error) {
        setError("Error fetching categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/categories/${categoryId}/delete`
      );

      if (response.status === 200) {
        console.log("OK");
        const updatedCategories = categories.filter(
          (category) => category.id !== categoryId
        );
        setCategories(updatedCategories);
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Category not found");
            break;
          default:
            toast.error("Error deleting category");
        }
      } else {
        toast.error("Error deleting category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-medium text-slate-600 ">Categories</h1>
        <Link
          to="/categories/add"
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

      {!isLoading && !error && categories.length === 0 && (
        <p className="text-slate-700 text-xl">No categories available.</p>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr className="text-left text-slate-700">
              <th className=" p-2">ID</th>
              <th className=" p-2">Name</th>
              <th className=" p-2">Description</th>
              <th className=" p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className=" p-2">{category.id}</td>
                <td className=" p-2 w-[200px]">{category.name}</td>
                <td className=" p-2">{category.description}</td>
                <td className="flex items-center justify-center my-1 gap-x-1 mx-1">
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="bg-blue-500 text-white  p-2 rounded"
                  >
                    <Pen size={20} />
                  </Link>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <Trash size={20} />
                  </button>
                  <Link
                    to={`/categories/${category.id}/show`}
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
}

export default CategoriesList;
