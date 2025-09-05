import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../lib/features/cartSlice";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { ShoppingCart, Package, Edit, Trash2, Settings } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import ProductEdit from "../components/ProductEdit";
import ProductDelete from "../components/ProductDelete";
import ReviewList from "../components/ReviewList";
import AddReviewForm from "../components/AddReviewForm";
import ReviewSummary from "../components/ReviewSummary";

function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  //check if user is admin
  const { user, isLoaded } = useUser();
  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  //fetch product by id
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  //add to cart
  const handleAddToCart = () => {
    if (product && product.stock > 0) {
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
            {/* Breadcrumb navigation*/}
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
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              {/* Admin Controls */}
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <Button
                    onClick={() => setShowEditModal(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    title="Edit Product"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Admin Banner for Mobile */}
            {isAdmin && (
              <div className="sm:hidden bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2">
                  <Settings size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Admin Mode Active</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Use the edit and delete buttons above to manage this product.
                </p>
              </div>
            )}

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

        {/* Reviews Section */}
        <div className="mt-16 max-w-6xl mx-auto space-y-8">
          {/* Review Summary */}
          <ReviewSummary reviews={product.reviews} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Review Form */}
            <div>
              <AddReviewForm 
                productId={productId}
                onReviewAdded={() => {
                }}
              />
            </div>
            
            {/* Reviews List */}
            <div>
              <ReviewList reviews={product.reviews} />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modals */}
      {isAdmin && (
        <>
          <ProductEdit
            product={product}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
            }}
          />
          <ProductDelete
            product={product}
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          />
        </>
      )}
    </div>
  );
}

export default ProductPage;
