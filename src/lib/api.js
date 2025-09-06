/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

   // Define a service using a base URL and expected endpoints
   export const Api = createApi({
     reducerPath: "Api",
     baseQuery: fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
       prepareHeaders: async (headers) => {
         return new Promise((resolve) => {
           async function checkToken() {
             const clerk = window.Clerk;
             if (clerk) {
               const token = await clerk.session?.getToken();
               headers.set("Authorization", `Bearer ${token}`);
               resolve(headers);
             } else {
               setTimeout(checkToken, 500);
             }
           }
           checkToken();
         });
       },
     }),
     tagTypes: ['Product', 'Category', 'Color', 'Order'],
     endpoints: (build) => ({
       getAllProducts: build.query({
         query: ({ categoryId, colorId, sortBy, sortOrder } = {}) => {
           const params = new URLSearchParams();
           if (categoryId) params.append('categoryId', categoryId);
           if (colorId) params.append('colorId', colorId);
           if (sortBy) params.append('sortBy', sortBy);
           if (sortOrder) params.append('sortOrder', sortOrder);
           return `/products?${params.toString()}`;
         },
         providesTags: ['Product'],
       }),
             getProductsBySearch: build.query({
        query: (query) => `/products/search?search=${query}`,
        providesTags: ['Product'],
      }),
      getTrendingProducts: build.query({
        query: ({ categoryId, limit = 8 } = {}) => {
          const params = new URLSearchParams();
          if (categoryId) params.append('categoryId', categoryId);
          if (limit) params.append('limit', limit.toString());
          return `/products/trending?${params.toString()}`;
        },
        providesTags: ['Product'],
      }),
       getProductById: build.query({
         query: (id) => `/products/${id}`,
         providesTags: (result, error, id) => [{ type: 'Product', id }],
       }),
       getAllCategories: build.query({
         query: () => `/categories`,
         providesTags: ['Category'],
       }),
       getAllColors: build.query({
         query: () => `/colors`,
         providesTags: ['Color'],
       }),
      createProduct: build.mutation({
        query: (product) => ({
          url: "/products",
          method: "POST",
          body: product,
        }),
        invalidatesTags: ['Product'],
      }),
      updateProduct: build.mutation({
        query: ({ id, ...product }) => ({
          url: `/products/${id}`,
          method: "PUT",
          body: product,
        }),
        invalidatesTags: (result, error, { id }) => [
          'Product',
          { type: 'Product', id }
        ],
      }),
      deleteProduct: build.mutation({
        query: (id) => ({
          url: `/products/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ['Product'],
      }),
       createOrder: build.mutation({
         query: (order) => ({
           url: "/orders",
           method: "POST",
           body: order,
         }),
       }),
             getUserOrders: build.query({
        query: () => "/orders/user",
        providesTags: ['Order'],
      }),
      getAllOrders: build.query({
        query: () => "/orders/admin/all",
        providesTags: ['Order'],
      }),
      getSalesData: build.query({
        query: (days = 7) => `/orders/admin/sales?days=${days}`,
        providesTags: ['Order'],
      }),
      updateOrderStatus: build.mutation({
        query: ({ id, orderStatus, paymentStatus }) => ({
          url: `/orders/admin/${id}`,
          method: "PUT",
          body: { orderStatus, paymentStatus },
        }),
        invalidatesTags: ['Order'],
      }),
             getOrderById: build.query({
        query: (id) => `/orders/${id}`,
        providesTags: (result, error, id) => [{ type: 'Order', id }],
      }),
      getCheckoutSessionStatus: build.query({
        query: (sessionId) => `/payments/checkout-session-status?session_id=${sessionId}`,
        providesTags: ['Order'],
      }),
      createReview: build.mutation({
        query: ({ productId, review, rating }) => ({
          url: "/reviews",
          method: "POST",
          body: { productId, review, rating },
        }),
        invalidatesTags: (result, error, { productId }) => [
          'Product',
          { type: 'Product', id: productId }
        ],
      }),
    }),
  });
   
   
   export const { useGetAllProductsQuery, useGetProductsBySearchQuery, useGetTrendingProductsQuery, useGetProductByIdQuery, useCreateOrderMutation, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetAllCategoriesQuery, useGetAllColorsQuery, useGetUserOrdersQuery, useGetAllOrdersQuery, useGetSalesDataQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation, useGetCheckoutSessionStatusQuery, useCreateReviewMutation } = Api;