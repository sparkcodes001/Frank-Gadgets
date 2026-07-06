const usePaystack = () => {
  const initializePayment = useCallback(
    ({ email, amount, name, phone, onSuccess, onClose, metadata = {} }) => {
      const loadAndPay = () => {
        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email,
          amount: Math.round(amount * 100),
          currency: "NGN",
          ref: `FG-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`,
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: name,
              },
              {
                display_name: "Phone",
                variable_name: "phone",
                value: phone,
              },
              ...Object.entries(metadata).map(([key, val]) => ({
                display_name: key,
                variable_name: key.toLowerCase().replace(/\s/g, "_"),
                value: String(val),
              })),
            ],
          },
          callback: onSuccess,
          onClose: onClose ?? (() => {}),
        });
        handler.openIframe();
      };

      if (window.PaystackPop) {
        loadAndPay();
        return;
      }

      const existing = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]',
      );
      if (existing) {
        existing.addEventListener("load", loadAndPay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = loadAndPay;
      script.onerror = () => console.error("Paystack failed to load");
      document.body.appendChild(script);
    },
    [],
  );

  return { initializePayment };
};

export default usePaystack;
