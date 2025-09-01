import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

function SimpleProductCard(props) {
  const dispatch = useDispatch();

  // DEBUG: Log the product data
  console.log(`SimpleProductCard - Product: ${props.product.name}`);
  console.log(`Image field:`, props.product.image);
  console.log(`Image type:`, typeof props.product.image);

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

  return (
    <div key={props.product._id} className="group">
      <Link to={`/shop/products/${props.product._id}`} className="block">
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
          {/* DEBUG: Show what we're trying to render */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-1 z-10">
            Image: {String(props.product.image).substring(0, 20)}...
          </div>
          
          <img
            src={props.product.image}
            alt={props.product.name}
            className="rounded-2xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => {
              console.log(`✅ Image loaded successfully for ${props.product.name}:`, props.product.image);
            }}
            onError={(e) => {
              console.log(`❌ Image failed to load for ${props.product.name}:`, props.product.image);
              console.log('Error event:', e);
              // Don't set a fallback yet, let's see what happens
            }}
            style={{ border: '2px solid red' }} // Temporary red border to see if img tag is there
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-black group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center">
            <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-lg sm:text-xl md:text-2xl block group-hover:text-blue-600 transition-colors">
            {props.product.name}
          </span>
          <span className="text-base sm:text-lg md:text-xl block text-green-600 font-semibold">
            ${props.product.price}
          </span>
        </div>
      </Link>
      <div className="mt-2 space-y-2">
        <Button
          className="w-full"
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
        <Link to={`/shop/products/${props.product._id}`}>
          <Button variant="outline" className="w-full">
            View Product
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SimpleProductCard;