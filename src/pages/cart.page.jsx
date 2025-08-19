import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CartPage() {
  const cart = useSelector((state) => state.cart.cartItems);

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold mb-8">My Cart</h2>

      {cart.length > 0 ? (
        <>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-lg font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                ${cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </main>
  );
}

export default CartPage;