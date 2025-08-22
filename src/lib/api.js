/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

   // Define a service using a base URL and expected endpoints
   export const Api = createApi({
     reducerPath: "Api",
     baseQuery: fetchBaseQuery({
       // Use proxy configuration from vite.config.js
       baseUrl: `/api`,
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
       getOrderById: build.query({
         query: (id) => `/orders/${id}`,
         providesTags: (result, error, id) => [{ type: 'Order', id }],
       }),
     }),
   });
   
   // Export hooks for usage in functional components, which are
   // auto-generated based on the defined endpoints
   export const { useGetAllProductsQuery, useGetProductsBySearchQuery, useGetProductByIdQuery, useCreateOrderMutation, useCreateProductMutation, useGetAllCategoriesQuery, useGetAllColorsQuery, useGetUserOrdersQuery, useGetAllOrdersQuery, useGetOrderByIdQuery } = Api;