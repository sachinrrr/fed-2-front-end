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
  const fetchClientSecret = useCallback(() => {
    console.log("Fetching client secret for order:", orderId);
    // Create a Checkout Session
    return fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (!data.clientSecret) {
          throw new Error("No client secret returned from server");
        }
        return data.clientSecret;
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
        throw error;
      });
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