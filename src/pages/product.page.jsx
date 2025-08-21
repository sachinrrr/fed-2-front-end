import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../lib/features/cartSlice";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Star, ShoppingCart, Package } from "lucide-react";

function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        })
      );
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Shop</span> <span className="mx-2">/</span>
              {product.categoryId && (
                <>
                  <span>{product.categoryId.name}</span>
                  <span className="mx-2">/</span>
                </>
              )}
              <span className="text-gray-900">{product.name}</span>
            </nav>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </div>

            {/* Color */}
            {product.colorId && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Color:</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.colorId.hexCode }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {product.colorId.name}
                  </span>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </span>
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>




          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
