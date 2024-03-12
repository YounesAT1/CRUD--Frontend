import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-slate-700 p-4 mt-3 rounded">
      <nav className="container mx-auto">
        <ul className="flex items-center gap-x-4">
          <li>
            <Link to="/products" className="text-white font-semibold">
              Products
            </Link>
          </li>
          <li>
            <Link to="/categories" className="text-white font-semibold">
              Categories
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
