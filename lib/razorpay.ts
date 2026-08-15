// lib/razorpay.ts — Client-side Razorpay SDK Loader & Trigger

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutOptions {
  key?: string;
  amount: number; // in INR (will be converted to paise)
  plan: string;
  planName: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => void;
  onFailure: (error: any) => void;
}

export async function initializeRazorpayPayment(options: RazorpayCheckoutOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
  }

  // NOTE: Razorpay is disabled until KYC is complete. Key must be set via env.
  const razorpayKey = options.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

  const rzpOptions = {
    key: razorpayKey,
    amount: Math.round(options.amount * 100), // convert rupees to paise
    currency: "INR",
    name: "Vaylo AI",
    description: `${options.planName} Upgrade`,
    image: "https://www.vayloai.online/logo.png",
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone || "",
    },
    notes: {
      plan: options.plan,
      app: "Vaylo AI",
    },
    theme: {
      color: "#6366f1", // Indigo primary
    },
    handler: function (response: any) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        console.log("Razorpay checkout modal closed by candidate.");
      },
    },
  };

  const rzp = new (window as any).Razorpay(rzpOptions);
  rzp.on("payment.failed", function (response: any) {
    options.onFailure(response.error);
  });
  rzp.open();
}
