import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./lib/store";
import { Provider } from "react-redux";

import "./index.css";

import HomePage from "./pages/home.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";
import ShopPage from "./pages/shop.page.jsx";
import ProductPage from "./pages/product.page.jsx";
import MyOrdersPage from "./pages/my-orders.page.jsx";
import AdminOrdersPage from "./pages/admin-orders.page.jsx";
import SalesDashboard from "./pages/sales-dashboard.page.jsx";
import RootLayout from "./layouts/root.layout.jsx";
import CartPage from "./pages/cart.page";
import CheckoutPage from "./pages/checkout.page";
import ProtectedLayout from "./layouts/protected.layout";
import CreateProductPage from "./pages/create-product-page";
import AdminProtectedLayout from "./layouts/admin-protected.layout";

import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
              </Route>
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/shop/products/:productId" element={<ProductPage />} />
              <Route element={<ProtectedLayout />}>
                <Route element={<AdminProtectedLayout />}>
                  <Route
                    path="/admin/products/create"
                    element={<CreateProductPage />}
                  />
                  <Route
                    path="/admin/orders"
                    element={<AdminOrdersPage />}
                  />
                  <Route
                    path="/admin/dashboard"
                    element={<SalesDashboard />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);