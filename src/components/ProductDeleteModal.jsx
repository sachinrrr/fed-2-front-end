import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useDeleteProductMutation } from "../lib/api";
import { useNavigate } from "react-router-dom";

const ProductDeleteModal = ({ product, isOpen, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteProduct(product._id).unwrap();
      onClose();
      // Navigate back to shop after successful deletion
      navigate("/shop");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Delete Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this product?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {product && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Product
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteModal;
