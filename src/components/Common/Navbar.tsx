import React, { useState } from "react";
import {
  HiBars3BottomRight,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

/* ================= TYPES ================= */

interface CartProduct {
  quantity: number;
}

interface AuthUser {
  role: string;
}

/* ================= COMPONENT ================= */

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);

  // ✅ cart state typed correctly
  const cart = useSelector((state: RootState) => state.cart.cart);

  // ✅ auth state typed correctly
  const user = useSelector(
    (state: RootState) => state.auth.user as AuthUser | null
  );

  const cartItemCount: number =
    cart?.products?.reduce(
      (total: number, product: CartProduct) => total + product.quantity,
      0
    ) ?? 0;

  const toggleNavDrawer = (): void => {
    setNavDrawerOpen((prev) => !prev);
  };

  const toggleCartDrawer = (): void => {
    setDrawerOpen((prev) => !prev);
  };

  const closeNavOnLinkClick = (): void => {
    setNavDrawerOpen(false);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">
            The Wind
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Shoes"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Shoes
          </Link>
          <Link
            to="/collections/all?category=Sandals"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Sandals
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button onClick={toggleCartDrawer} className="relative">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <SearchBar />

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer
        drawerOpen={drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={closeNavOnLinkClick}
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={closeNavOnLinkClick}
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Shoes"
              onClick={closeNavOnLinkClick}
            >
              Shoes
            </Link>
            <Link
              to="/collections/all?category=Sandals"
              onClick={closeNavOnLinkClick}
            >
              Sandals
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
