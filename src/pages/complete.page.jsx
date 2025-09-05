import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../lib/features/cartSlice";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const dispatch = useDispatch();

  //clear cart when payment is complete
  useEffect(() => {
    if (sessionId) {
      dispatch(clearCart());
    }
  }, [sessionId, dispatch]);

  //return complete page
  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-lg">{orderId}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You will receive a confirmation email shortly with your order details.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link
                to="/my-orders"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                View My Orders
              </Link>
              <Link
                to="/"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CompletePage;