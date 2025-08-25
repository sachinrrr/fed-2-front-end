import CartItem from "@/components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import PaymentForm from "@/components/PaymentForm";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  // For now, we'll allow payment page even if cart is empty since order is already created
  // if (cart.length === 0) {
  //   return <Navigate to="/" />;
  // }

  if (!orderId) {
    return <Navigate to="/checkout" />;
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold mb-8">Complete Your Payment</h2>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-6">Order ID: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>
        
        {cart.length > 0 && (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
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
          </>
        )}

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Payment</h3>
          <PaymentForm orderId={orderId} />
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;