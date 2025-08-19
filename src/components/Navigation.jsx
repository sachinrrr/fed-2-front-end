import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/clerk-react";
import ProductSearchForm from "./ProductSearchForm";

export default function Navigation() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user, isLoaded } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Function to close mobile menu
  const closeMobileMenu = () => setIsMenuOpen(false);

  const navigationLinks = [
    {
      path: "/shop",
      label: "Shop All",
    },
    {
      path: "/shop/shoes",
      label: "Shoes",
    },
    {
      path: "/shop/tshirts",
      label: "T-Shirt",
    },
    {
      path: "/shop/shorts",
      label: "Shorts",
    },
    {
      path: "/shop/pants",
      label: "Pants",
    },
    {
      path: "/shop/socks",
      label: "Socks",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-16">
      <div>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl">
            Mebius
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="font-medium hover:text-gray-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Show Create Product button only for Clerk admin */}
            {isLoaded && user?.publicMetadata?.role === "admin" && (
              <Link
                to="/admin/products/create"
                className="font-medium hover:text-gray-600 border px-2 py-1 rounded"
              >
                Create Product
              </Link>
            )}
            <ProductSearchForm />
            <Link
              to="/cart"
              aria-label="Shopping Bag"
              className="p-1 relative"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <div className="hidden md:block">
              <SignedOut>
                <div className="flex items-center gap-4">
                  <Link to="/sign-in">Sign In</Link>
                  <Link to="/sign-up">Sign Up</Link>
                </div>
              </SignedOut>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-4 right-4 bg-white z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {navigationLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="block md:hidden px-4">
            <SignedOut>
              <div className="flex items-center gap-4">
                <Link to="/sign-in">Sign In</Link>
                <Link to="/sign-up">Sign Up</Link>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}