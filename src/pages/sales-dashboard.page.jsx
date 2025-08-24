import React, { useState } from 'react';
import { useGetSalesDataQuery } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from '../components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';

const SalesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  
  const { data: salesData7Days, isLoading: isLoading7Days, error: error7Days } = useGetSalesDataQuery(7);
  const { data: salesData30Days, isLoading: isLoading30Days, error: error30Days } = useGetSalesDataQuery(30);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalSales = (data) => {
    if (!data) return 0;
    return data.reduce((total, day) => total + day.totalSales, 0);
  };

  const getTotalOrders = (data) => {
    if (!data) return 0;
    return data.reduce((total, day) => total + day.orderCount, 0);
  };

  const getAverageOrderValue = (data) => {
    if (!data || data.length === 0) return 0;
    const totalSales = getTotalSales(data);
    const totalOrders = getTotalOrders(data);
    return totalOrders > 0 ? totalSales / totalOrders : 0;
  };

  const chartConfig = {
    totalSales: {
      label: "Daily Sales",
      color: "#2563eb" // Solid blue color
    }
  };

  if (isLoading7Days || isLoading30Days) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sales data...</div>
      </div>
    );
  }

  if (error7Days || error30Days) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Error loading sales data</div>
          <p className="text-gray-500">Please try refreshing the page or contact support</p>
        </div>
      </div>
    );
  }

  const currentData = selectedPeriod === 7 ? salesData7Days : salesData30Days;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
        <p className="text-gray-600">Monitor your business performance and sales trends</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedPeriod === 7 ? "default" : "outline"}
          onClick={() => setSelectedPeriod(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant={selectedPeriod === 30 ? "default" : "outline"}
          onClick={() => setSelectedPeriod(30)}
        >
          Last 30 Days
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalSales(currentData))}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 7 ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalOrders(currentData)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 7 ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getAverageOrderValue(currentData))}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 7 ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Daily Sales Trend</CardTitle>
          <CardDescription>
            {selectedPeriod === 7 ? 'Sales performance over the last 7 days' : 'Sales performance over the last 30 days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={currentData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="totalSales"
                type="monotone"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  fill: "#2563eb",
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  stroke: "#2563eb",
                  strokeWidth: 2,
                  fill: "#ffffff"
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <CardDescription>
            Detailed view of sales and orders for each day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-right py-2 font-medium">Sales</th>
                  <th className="text-right py-2 font-medium">Orders</th>
                  <th className="text-right py-2 font-medium">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((day, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">{formatDate(day.date)}</td>
                    <td className="text-right py-2 font-medium">
                      {formatCurrency(day.totalSales)}
                    </td>
                    <td className="text-right py-2">{day.orderCount}</td>
                    <td className="text-right py-2">
                      {day.orderCount > 0 
                        ? formatCurrency(day.totalSales / day.orderCount)
                        : formatCurrency(0)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
