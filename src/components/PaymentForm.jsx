import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaymentForm = ({ orderId }) => {
  const fetchClientSecret = useCallback(async () => {
    try {
      console.log("Creating checkout session for order:", orderId);
      
      // Get auth token
      const token = await window.Clerk.session?.getToken();
      
      // Create a Checkout Session
      const response = await fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Checkout session created:", data);
      
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }, [orderId]);

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