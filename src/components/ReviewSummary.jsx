import { Star } from "lucide-react";

function ReviewSummary({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="w-5 h-5 text-gray-300" />
          ))}
        </div>
        <p className="text-gray-500">No ratings yet</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const roundedRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const filled = index < Math.floor(rating);
      const partial = index === Math.floor(rating) && rating % 1 !== 0;
      
      return (
        <Star
          key={index}
          className={`w-5 h-5 ${
            filled
              ? "fill-yellow-400 text-yellow-400"
              : partial
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    });
  };

  // Count ratings by star
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Customer Reviews
      </h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {roundedRating}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {renderStars(averageRating)}
          </div>
          <p className="text-sm text-gray-500">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star - 1];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-600">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-600 text-xs">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReviewSummary;
