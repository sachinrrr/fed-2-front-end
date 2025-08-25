import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../lib/features/cartSlice";
import { useGetCheckoutSessionStatusQuery } from "../lib/api";
import CasualInspirations from "../components/CasualInspirations";
import HeroGrid from "../components/HeroGrid";
import TrendingSection from "../components/TrendingSection";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const paymentSuccess = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  // Check payment status with Stripe (only when we have a session ID)
  const { data: sessionStatus, error: sessionError } = useGetCheckoutSessionStatusQuery(sessionId, {
    skip: !sessionId || paymentSuccess !== "success"
  });

  // Handle payment success
  useEffect(() => {
    if (paymentSuccess === "success" && sessionId) {
      console.log("Payment completed successfully!", { sessionId, orderId });
      
      // Log session status response for debugging
      if (sessionStatus) {
        console.log("Session status response:", sessionStatus);
      }
      if (sessionError) {
        console.error("Session status error:", sessionError);
      }
      
      // Clear cart
      dispatch(clearCart());
      
      // Show success notification for 5 seconds, then remove URL params
      setTimeout(() => {
        setSearchParams({});
      }, 5000);
    }
  }, [paymentSuccess, sessionId, orderId, sessionStatus, sessionError, dispatch, setSearchParams]);

  return (
    <>
      {paymentSuccess === "success" && sessionId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 mx-4 lg:mx-16">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🎉 Payment Successful!</h3>
              <p className="text-sm">
                Your order has been placed successfully. Order ID: {orderId?.slice(-8)}
              </p>
              <p className="text-sm mt-1">
                <a href="/my-orders" className="underline hover:no-underline">
                  View your orders
                </a>
              </p>
            </div>
            <button 
              onClick={() => setSearchParams({})}
              className="text-green-500 hover:text-green-700 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <main className="flex flex-col gap-8 md:gap-12 pb-8">
        <HeroGrid />
        <CasualInspirations />
        <TrendingSection />
      </main>
    </>
  );
}

export default HomePage;