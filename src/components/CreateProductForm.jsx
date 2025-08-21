import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateProductMutation, useGetAllColorsQuery } from "../lib/api";

import ImageInput from "./ImageInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const createProductFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  colorId: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  image: z.string().min(1, "Product image is required"),
  stock: z.number().min(0, "Stock must be 0 or greater"),
  price: z.number().nonnegative("Price must be 0 or greater"),
});

function CreateProductForm({ categories }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      categoryId: "",
      colorId: "none",
      name: "",
      image: "",
      stock: 0,
      price: 0,
    },
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: colors, isLoading: colorsLoading } = useGetAllColorsQuery();

  const onSubmit = async (values) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      
      // Clean the values before sending
      const productData = {
        categoryId: values.categoryId,
        name: values.name,
        image: values.image,
        stock: values.stock,
        price: values.price,
        // Only include colorId if it's not "none" and not empty
        ...(values.colorId && values.colorId !== "none" && values.colorId !== "" ? { colorId: values.colorId } : {}),
      };
      
      console.log("Sending product data:", productData);
      
      await createProduct(productData).unwrap();
      
      setSuccessMessage("Product created successfully!");
      form.reset();
      
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMessage(
        error?.data?.message || 
        error?.message || 
        "Failed to create product. Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-4 w-1/2 max-w-md"
      >
        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No color</SelectItem>
                  {colorsLoading ? (
                    <SelectItem value="loading" disabled>Loading colors...</SelectItem>
                  ) : (
                    colors?.map((color) => (
                      <SelectItem key={color._id} value={color._id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: color.hexCode }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Classic Denim Jacket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image *</FormLabel>
              <FormControl>
                <ImageInput onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter stock quantity"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value) || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 29.99"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value) || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating Product..." : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProductForm;