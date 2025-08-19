import { useGetAllProductsQuery } from "@/lib/api";
import { useParams } from "react-router";
import SimpleProductCard from "@/components/SimpleProductCard";

function ShopPage() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery();

  const { category } = useParams();
  console.log(category);

  if (isLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <p className="text-center text-xl">Loading products...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <p className="text-center text-xl text-red-500">Error loading products: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold mb-8">Shop All</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <SimpleProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}

export default ShopPage;