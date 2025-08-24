import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../lib/api";
import { Package, Truck, CheckCircle, XCircle, Calendar, CreditCard, MapPin, User, Filter, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const {
    data: orders,
    isLoading,
    error,
  } = useGetAllOrdersQuery();

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "FULFILLED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "SHIPPED":
        return "text-blue-600 bg-blue-100";
      case "FULFILLED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "REFUNDED":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  const filteredOrders = orders?.filter((order) => {
    const statusMatch = statusFilter === "all" || order.orderStatus === statusFilter;
    const paymentMatch = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return statusMatch && paymentMatch;
  });

  const getOrderStats = () => {
    if (!orders) return { total: 0, pending: 0, fulfilled: 0, revenue: 0 };
    
    const stats = orders.reduce((acc, order) => {
      acc.total += 1;
      if (order.orderStatus === "PENDING") acc.pending += 1;
      if (order.orderStatus === "FULFILLED") acc.fulfilled += 1;
      if (order.paymentStatus === "PAID") {
        acc.revenue += parseFloat(calculateOrderTotal(order.items));
      }
      return acc;
    }, { total: 0, pending: 0, fulfilled: 0, revenue: 0 });

    return stats;
  };

  const stats = getOrderStats();

  const handleStatusUpdate = async (orderId, newStatus, isPaymentStatus = false) => {
    try {
      const updateData = {
        id: orderId,
        ...(isPaymentStatus ? { paymentStatus: newStatus } : { orderStatus: newStatus })
      };
      await updateOrderStatus(updateData).unwrap();
      
      // Show success feedback (in a real app, you'd use a toast library)
      console.log(`✅ Successfully updated ${isPaymentStatus ? 'payment' : 'order'} status to ${newStatus}`);
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      // In a real app, you'd show an error toast here
      alert(`Failed to update ${isPaymentStatus ? 'payment' : 'order'} status. Please try again.`);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Orders
          </h1>
          <p className="text-gray-600 mb-4">
            {error?.message || "There was an error loading the orders. Please try again later."}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fulfilled}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Order Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Payment Status:</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h2>
            <p className="text-gray-600">
              {orders?.length === 0 
                ? "No orders have been placed yet." 
                : "No orders match the current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(parseInt(order._id.toString().substring(0, 8), 16) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>
                              Customer: {order.customerName || order.customerEmail?.split('@')[0] || order.userId?.slice(0, 8) + '...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-2">{order.orderStatus}</span>
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Items Ordered ({order.items.length} items)
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.productId?.image || "https://via.placeholder.com/64x64?text=No+Image"}
                              alt={item.productId?.name || "Product"}
                              className="w-16 h-16 object-cover rounded-md border border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                              }}
                            />
                            <div className="flex-1">
                              <h5 className={`font-medium ${item.productId?.name ? 'text-gray-900' : 'text-red-600'}`}>
                                {item.productId?.name || "⚠️ Product Deleted/Unavailable"}
                              </h5>
                              {!item.productId?.name && (
                                <p className="text-xs text-red-500">
                                  Product ID: {typeof item.productId === 'string' ? item.productId : item.productId?._id || 'Unknown'}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                ${(item.productId?.price || 0).toFixed(2)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Address */}
                    <div className="space-y-4">
                      {/* Order Total */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Order Summary
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-medium">
                              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Credit Card"}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-semibold border-t pt-2">
                            <span>Total:</span>
                            <span>${calculateOrderTotal(order.items)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.addressId && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.addressId.street}</p>
                            <p>
                              {order.addressId.city}, {order.addressId.state} {order.addressId.zipCode}
                            </p>
                            <p>{order.addressId.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Admin Actions */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Admin Actions
                        </h4>
                        <div className="space-y-3">
                          {/* Order Status Update */}
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">Order Status</label>
                            <Select 
                              value={order.orderStatus} 
                              onValueChange={(value) => handleStatusUpdate(order._id, value)}
                            >
                              <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          


                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => toggleOrderExpansion(order._id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {expandedOrders.has(order._id) ? 'Hide' : 'Show'} Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer & Order Details */}
                {expandedOrders.has(order._id) && (
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer & Order Details
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Information */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Order Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Order ID:</strong> {order._id}
                          </div>
                          <div>
                            <strong>Customer:</strong> {order.customerName || order.customerEmail || order.userId}
                          </div>
                          <div>
                            <strong>Order Date:</strong> {new Date(parseInt(order._id.toString().substring(0, 8), 16) * 1000).toLocaleString()}
                          </div>
                          <div>
                            <strong>Total Items:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </div>
                          <div>
                            <strong>Payment Method:</strong> {order.paymentMethod === "COD" ? "Cash on Delivery" : "Credit Card"}
                          </div>
                          <div>
                            <strong>Order Total:</strong> ${calculateOrderTotal(order.items)}
                          </div>
                        </div>
                      </div>

                      {/* Customer & Shipping Details */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Customer & Shipping Details
                        </h5>
                        
                        {/* Customer Contact Information */}
                        <div className="space-y-3 text-sm">
                          <div className="pb-3 border-b">
                            <h6 className="font-medium text-gray-700 mb-2">Customer Contact</h6>
                            <div className="space-y-1">
                              {order.customerName && (
                                <div>
                                  <strong>Name:</strong> {order.customerName}
                                </div>
                              )}
                              {order.customerEmail && (
                                <div>
                                  <strong>Email:</strong> 
                                  <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:underline ml-1">
                                    {order.customerEmail}
                                  </a>
                                </div>
                              )}
                              {order.customerPhone && (
                                <div>
                                  <strong>Mobile:</strong> 
                                  <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline ml-1">
                                    {order.customerPhone}
                                  </a>
                                </div>
                              )}
                              {!order.customerEmail && !order.customerPhone && (
                                <div className="text-gray-500 text-xs">
                                  Customer ID: {order.userId}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          {order.addressId ? (
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Shipping Address</h6>
                              <div className="space-y-1">
                                {order.addressId.line_1 && (
                                  <div>
                                    <strong>Address:</strong> {order.addressId.line_1}
                                  </div>
                                )}
                                {order.addressId.line_2 && (
                                  <div>
                                    <strong>Line 2:</strong> {order.addressId.line_2}
                                  </div>
                                )}
                                <div>
                                  <strong>City:</strong> {order.addressId.city}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Shipping Address</h6>
                              <div className="text-red-500 text-xs">⚠️ Shipping address not available</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
