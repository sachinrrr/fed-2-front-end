import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaymentForm = ({ orderId }) => {
  const { getToken } = useAuth();
  
  const fetchClientSecret = useCallback(async () => {
    try {
      console.log("Creating checkout session for order:", orderId);
      
      // Get auth token
      const token = await getToken();
      console.log("Auth token retrieved:", token ? "✅ Token exists" : "❌ No token");
      
      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }
      
      // Create a Checkout Session
      const response = await fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Checkout session created:", data);
      
      // For Embedded Checkout, we use the session ID as the client secret
      if (!data.sessionId) {
        throw new Error("No session ID received from server");
      }
      
      console.log("Using session ID as client secret:", data.sessionId);
      return data.sessionId;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }, [orderId, getToken]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default PaymentForm;