import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCreateOrderMutation } from "../lib/api";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  const handleProceedToPayment = async () => {
    try {
      setError("");
      setIsProcessing(true);

      // Validate required fields
      if (!addressLine1.trim() || !city.trim() || !phone.trim()) {
        setError("Please fill in all required fields");
        return;
      }

      // Prepare order data
      const orderData = {
        orderItems: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          line_1: addressLine1.trim(),
          line_2: addressLine2.trim() || null,
          city: city.trim(),
          phone: phone.trim()
        }
      };

      console.log("Creating order with data:", orderData);

      // Create the order
      const response = await createOrder(orderData).unwrap();
      console.log("Order created:", response);

      // Navigate to payment page with order ID
      navigate(`/payment?orderId=${response._id}`);

    } catch (err) {
      console.error("Error creating order:", err);
      setError(err?.data?.message || err?.message || "Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold mb-8">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${item.product.price} each</p>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                ${cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Form */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Shipping Address</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <form className="space-y-4">
            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                id="address1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="123 Main Street"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="address2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Apt 4B"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Payment</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={isProcessing || isCreatingOrder}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing || isCreatingOrder ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;