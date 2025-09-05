import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../lib/features/cartSlice";
import { Trash2, Plus, Minus } from "lucide-react";

function CartPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  //remove item from cart
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  //update quantity of item in cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  //clear all items from cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  //return cart page
  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">My Cart</h2>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>
      {cart.length > 0 ? (
        <>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          ${item.product.price.toFixed(2)} each
                        </span>
                        <p className="text-lg font-semibold text-green-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
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