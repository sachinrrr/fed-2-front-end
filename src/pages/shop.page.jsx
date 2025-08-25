import { useGetAllProductsQuery, useGetAllCategoriesQuery, useGetAllColorsQuery } from "@/lib/api";
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SimpleProductCard from "@/components/SimpleProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, SortAsc, SortDesc } from "lucide-react";

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: categoryName } = useParams();
  
  // State for filters and sorting
  const [filters, setFilters] = useState({
    categoryId: '',
    colorId: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Fetch data
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorData,
  } = useGetAllCategoriesQuery();

  const {
    data: colors,
    isLoading: colorsLoading,
    isError: colorsError,
    error: colorsErrorData,
  } = useGetAllColorsQuery();

  // Find the category ID based on the category name from the URL
  const categoryId = categories?.find((cat) => {
    const catName = cat.name.toLowerCase();
    const urlName = categoryName?.toLowerCase();
    
    // Direct match first
    if (catName === urlName) return true;
    
    // Handle special cases like "t-shirts" matching "tshirts"
    if (catName.replace(/[-\s]/g, '') === urlName?.replace(/[-\s]/g, '')) return true;
    
    return false;
  })?._id;

  // Update filters when URL category changes
  useEffect(() => {
    if (categoryId) {
      setFilters(prev => ({ ...prev, categoryId }));
    } else if (categoryName === undefined) {
      setFilters(prev => ({ ...prev, categoryId: '' }));
    }
  }, [categoryId, categoryName]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const colorId = searchParams.get('colorId') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    setFilters(prev => ({
      ...prev,
      colorId,
      sortBy,
      sortOrder
    }));
  }, [searchParams]);

  // Fetch products with current filters
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorData,
    refetch: refetchProducts
  } = useGetAllProductsQuery(filters);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL search params
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    const baseFilters = {
      categoryId: categoryId || '',
      colorId: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(baseFilters);
    setSearchParams({});
  };

  // Check if any filters are active (excluding URL category)
  const hasActiveFilters = filters.colorId || filters.sortBy !== 'name' || filters.sortOrder !== 'asc';

  if (productsLoading || categoriesLoading || colorsLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    );
  }

  if (productsError || categoriesError || colorsError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <p className="text-center text-xl text-red-500">
          {productsError ? `Error loading products: ${productsErrorData?.message || 'Unknown error'}` : 
           categoriesError ? `Error loading categories: ${categoriesErrorData?.message || 'Unknown error'}` :
           colorsError ? `Error loading colors: ${colorsErrorData?.message || 'Unknown error'}` :
           'An error occurred'}
        </p>
      </main>
    );
  }

  // Show message for invalid category
  if (categoryName && !categoryId) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <p className="text-center text-xl text-red-500">Category not found: {categoryName}</p>
      </main>
    );
  }

  // Get the actual category name from the database
  const actualCategoryName = categories?.find((cat) => cat._id === categoryId)?.name;

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4">
          {actualCategoryName || 'Shop All'}
        </h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          {/* Color Filter */}
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Filter by Color</label>
            <Select 
              value={filters.colorId || 'all'} 
              onValueChange={(value) => handleFilterChange('colorId', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="All Colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {colors?.map((color) => (
                  <SelectItem key={color._id} value={color._id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" 
                        style={{ backgroundColor: color.hexCode }}
                      ></div>
                      <span className="truncate">{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort By Price */}
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort by Price</label>
            <Select 
              value={filters.sortBy === 'price' ? filters.sortOrder : ''} 
              onValueChange={(value) => {
                if (value) {
                  const newFilters = { ...filters, sortBy: 'price', sortOrder: value };
                  setFilters(newFilters);
                  
                  const params = new URLSearchParams(searchParams);
                  params.set('sortBy', 'price');
                  params.set('sortOrder', value);
                  setSearchParams(params);
                }
              }}
            >
              <SelectTrigger className="w-full h-9 text-sm border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select price order" />
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                <SelectItem value="asc" className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2 py-1">
                    <SortAsc className="h-4 w-4 text-green-600" />
                    <span>Price: Low to High</span>
                  </div>
                </SelectItem>
                <SelectItem value="desc" className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2 py-1">
                    <SortDesc className="h-4 w-4 text-red-600" />
                    <span>Price: High to Low</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {filters.sortBy === 'price' && (
              <button
                onClick={() => {
                  const newFilters = { ...filters, sortBy: 'name', sortOrder: 'asc' };
                  setFilters(newFilters);
                  
                  const params = new URLSearchParams(searchParams);
                  params.delete('sortBy');
                  params.delete('sortOrder');
                  setSearchParams(params);
                }}
                className="mt-1 text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear price sorting
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="mb-4">
        <p className="text-gray-600">
          {products?.length || 0} product{products?.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No products found</p>
            <p className="text-gray-400">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          products?.map((product) => (
            <SimpleProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </main>
  );
}

export default ShopPage;