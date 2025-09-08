import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Package, ChevronDown, Settings, Plus, FileText, BarChart3 } from "lucide-react";
import { useSelector } from "react-redux";
import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/clerk-react";
import ProductSearchForm from "./ProductSearchForm";

export default function Navigation() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user, isLoaded } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Function to close mobile menu
  const closeMobileMenu = () => setIsMenuOpen(false);
  
  // Function to close admin dropdown
  const closeAdminDropdown = () => setIsAdminDropdownOpen(false);

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

  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  const adminMenuItems = [
    {
      path: "/admin/dashboard",
      label: "Sales Dashboard",
      icon: BarChart3,
    },
    {
      path: "/admin/products/create",
      label: "Create Product",
      icon: Plus,
    },
    {
      path: "/admin/orders",
      label: "Manage Orders",
      icon: FileText,
    },
    {
      path: "/my-orders",
      label: "My Orders",
      icon: Package,
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

          {/* Desktop Navigation - Shopping Links */}
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

          {/* Right Side Icons & Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 font-medium text-sm"
                  aria-label="Admin Menu"
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown size={14} />
                </button>
                
                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {adminMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                          onClick={closeAdminDropdown}
                        >
                          <IconComponent size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* My Orders - Show only for non-admin users */}
            <SignedIn>
              {!isAdmin && (
                <Link
                  to="/my-orders"
                  aria-label="My Orders"
                  className="p-1 flex items-center space-x-1 hover:text-gray-600"
                >
                  <Package size={20} />
                  <span className="hidden sm:inline text-sm">My Orders</span>
                </Link>
              )}
            </SignedIn>

            {/* Search */}
            <ProductSearchForm />
            
            {/* Shopping Cart */}
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

            {/* User Authentication */}
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
        <div className="md:hidden fixed top-16 left-4 right-4 bg-white z-10 border border-gray-200 rounded-md shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Shopping Navigation */}
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
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Mobile: My Orders - Show only for non-admin users */}
            <SignedIn>
              {!isAdmin && (
                <Link
                  to="/my-orders"
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md"
                  onClick={closeMobileMenu}
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </Link>
              )}
            </SignedIn>
            
            {/* Mobile: Admin Menu */}
            {isAdmin && (
              <>
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Admin
                </div>
                {adminMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium hover:bg-gray-100 rounded-md text-blue-600"
                      onClick={closeMobileMenu}
                    >
                      <IconComponent size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
            
            {/* Mobile: Sign In/Up */}
            <SignedOut>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-3 py-2 space-y-2">
                <Link 
                  to="/sign-in" 
                  className="block text-base font-medium hover:text-gray-600"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="block text-base font-medium hover:text-gray-600"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      )}

      {/* Click outside to close admin dropdown */}
      {isAdminDropdownOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={closeAdminDropdown}
        ></div>
      )}
    </header>
  );
}