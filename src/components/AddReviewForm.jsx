import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useCreateReviewMutation } from "../lib/api";
import { useUser } from "@clerk/clerk-react";

function AddReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isSignedIn } = useUser();
  const [createReview] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert("Please sign in to submit a review");
      return;
    }
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createReview({
        productId,
        review: reviewText.trim(),
        rating
      }).unwrap();
      
      // Reset form
      setRating(0);
      setReviewText("");
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded();
      }
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              starValue <= (hoveredRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>
      );
    });
  };

  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-2">Please sign in to leave a review</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label 
            htmlFor="reviewText" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="reviewText"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Share your thoughts about this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={isSubmitting}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reviewText.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || !reviewText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Submit Review
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}

export default AddReviewForm;
