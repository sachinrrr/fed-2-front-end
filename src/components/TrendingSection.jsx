import SimpleProductCard from "./SimpleProductCard";
import CategoryButton from "./CategoryButton";
import { useState } from "react";
import { useGetTrendingProductsQuery, useGetAllCategoriesQuery } from "@/lib/api";
import { Loader2 } from "lucide-react";

function TrendingSection() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");

  // Fetch categories from database
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  // Fetch trending products based on order count (most ordered first)
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetTrendingProductsQuery({
    categoryId: selectedCategoryId === "ALL" ? "" : selectedCategoryId,
    limit: 8
  });

  // Debug logging
  console.log("TrendingSection debug:", {
    selectedCategoryId,
    productsCount: products?.length,
    productsLoading,
    productsError,
    categoriesCount: categories?.length,
    categoriesLoading,
    categoriesError
  });

  // Add "ALL" category for filtering
  const categoriesWithAll = categories ? [
    { _id: "ALL", name: "All" },
    ...categories
  ] : [];

  // Loading state
  if (categoriesLoading || productsLoading) {
    return (
      <section className="px-4 lg:px-16 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-lg">Loading trending products...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (categoriesError || productsError) {
    console.error("Trending section errors:", { categoriesError, productsError });
    return (
      <section className="px-4 lg:px-16 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-red-500 mb-2">
              Error loading trending products
            </p>
            <p className="text-gray-500 text-sm">
              {productsError?.message || categoriesError?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-16 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl">Trending</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 max-w-full overflow-x-auto pb-2">
          {categoriesWithAll?.map((category) => (
            <CategoryButton
              key={category._id}
              category={category}
              onClick={() => setSelectedCategoryId(category._id)}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4 md:gap-x-4 md:gap-y-8">
        {products && products.length > 0 ? (
          // Products are already limited by the API call
          products.map((product) => (
            <SimpleProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No products found</p>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendingSection;