import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Link } from "react-router-dom";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

function SimpleProductCard(props) {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    dispatch(
      addToCart({
        _id: props.product._id,
        name: props.product.name,
        price: props.product.price,
        image: props.product.image,
        quantity: 1,
      })
    );
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
      <Link to={`/shop/products/${props.product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={props.product.image}
            alt={props.product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors">
                <Eye className="w-5 h-5 text-gray-800" />
              </div>
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleLike}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {props.product.name}
          </h3>
          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">
              ${props.product.price}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        <Button
          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/25 group/btn"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
          Add to Cart
        </Button>
        <Link to={`/shop/products/${props.product._id}`} className="block">
          <Button 
            variant="outline" 
            className="w-full border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 rounded-xl py-3 font-medium transition-all duration-200 hover:bg-gray-50"
          >
            View Details
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default SimpleProductCard;