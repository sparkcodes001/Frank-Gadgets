import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Package,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import { useOrders } from "../hooks/useOrders";
// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Shipping" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Review" },
  ];

  return (
    <div className="flex items-center justify-center mb-8 sm:mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                font-bold text-xs sm:text-sm transition-all duration-500
                ${
                  currentStep > step.id
                    ? "bg-accent text-dark"
                    : currentStep === step.id
                      ? "bg-accent text-dark ring-4 ring-accent/30"
                      : "bg-dark-300 border border-dark-400 text-primary-500"
                }`}
            >
              {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium tracking-wide
                ${currentStep >= step.id ? "text-accent" : "text-primary-600"}`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-[2px] mx-2 mb-4 rounded-full
                transition-all duration-500
                ${currentStep > step.id ? "bg-accent" : "bg-dark-400"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-primary-400 text-xs font-semibold uppercase tracking-widest">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-dark-300 text-light text-sm px-4 py-3
          ${Icon ? "pl-10" : ""}
          rounded-xl border transition-all duration-300
          placeholder:text-primary-600 focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500"
              : "border-dark-400 focus:ring-accent/30 focus:border-accent"
          }`}
      />
    </div>
    {error && <p className="text-red-400 text-[11px]">{error}</p>}
  </div>
);

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
const OrderSummary = ({ cartItems, subtotal, shipping, tax, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-dark-200 border border-dark-400 rounded-2xl sm:rounded-3xl
      p-5 sm:p-6 space-y-4 lg:sticky lg:top-24"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between lg:cursor-default"
      >
        <h3 className="font-display font-bold text-lg text-light">
          Order Summary
        </h3>
        <span className="lg:hidden text-primary-400">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      <div className={`space-y-3 ${!isExpanded ? "hidden lg:block" : ""}`}>
        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.color}`}
            className="flex items-center gap-3"
          >
            <div
              className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden
              bg-dark-300 border border-dark-400"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-dark
                text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light text-xs font-semibold line-clamp-1">
                {item.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="w-2.5 h-2.5 rounded-full border border-dark-400"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-primary-500 text-[10px]">{item.brand}</p>
              </div>
            </div>
            <p className="text-light text-xs font-bold shrink-0">
              ${(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}

        <div className="border-t border-dark-400 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-primary-400">Subtotal</span>
            <span className="text-light font-semibold">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-primary-400">Shipping</span>
            <span className="text-light font-semibold">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-primary-400">Tax (8%)</span>
            <span className="text-light font-semibold">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dark-400 pt-3 flex justify-between">
          <span className="text-light font-display font-bold">Total</span>
          <span className="text-accent font-display font-bold text-xl">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-dark-400 pt-3 space-y-2">
          {[
            { icon: Shield, text: "256-bit SSL Encryption" },
            { icon: Package, text: "Free returns within 30 days" },
            { icon: Truck, text: "Tracked shipping on all orders" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={13} className="text-accent shrink-0" />
              <span className="text-primary-500 text-[11px]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────
const ShippingStep = ({ data, onChange, errors }) => (
  <div className="space-y-5">
    <div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-light mb-1">
        Shipping Information
      </h2>
      <p className="text-primary-500 text-sm">
        Where should we deliver your order?
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField
        label="First Name"
        placeholder="John"
        value={data.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        error={errors.firstName}
        required
      />
      <InputField
        label="Last Name"
        placeholder="Doe"
        value={data.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        error={errors.lastName}
        required
      />
    </div>

    <InputField
      label="Email Address"
      type="email"
      placeholder="john@example.com"
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
      error={errors.email}
      required
    />

    <InputField
      label="Phone Number"
      type="tel"
      placeholder="+1 (555) 000-0000"
      value={data.phone}
      onChange={(e) => onChange("phone", e.target.value)}
      error={errors.phone}
      required
    />

    <InputField
      label="Street Address"
      placeholder="123 Main Street, Apt 4B"
      value={data.address}
      onChange={(e) => onChange("address", e.target.value)}
      error={errors.address}
      required
    />

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InputField
        label="City"
        placeholder="New York"
        value={data.city}
        onChange={(e) => onChange("city", e.target.value)}
        error={errors.city}
        required
      />
      <InputField
        label="State"
        placeholder="NY"
        value={data.state}
        onChange={(e) => onChange("state", e.target.value)}
        error={errors.state}
        required
      />
      <InputField
        label="ZIP Code"
        placeholder="10001"
        value={data.zip}
        onChange={(e) => onChange("zip", e.target.value)}
        error={errors.zip}
        required
      />
    </div>

    <div className="space-y-3">
      <label className="text-primary-400 text-xs font-semibold uppercase tracking-widest">
        Shipping Method <span className="text-accent">*</span>
      </label>
      {[
        {
          id: "standard",
          label: "Standard Shipping",
          duration: "5–7 business days",
          price: "Free",
        },
        {
          id: "express",
          label: "Express Shipping",
          duration: "2–3 business days",
          price: "$9.99",
        },
        {
          id: "overnight",
          label: "Overnight Shipping",
          duration: "Next business day",
          price: "$19.99",
        },
      ].map((method) => (
        <label
          key={method.id}
          className={`flex items-center justify-between p-4 rounded-xl border
            cursor-pointer transition-all duration-300
            ${
              data.shippingMethod === method.id
                ? "border-accent bg-accent/5"
                : "border-dark-400 bg-dark-300 hover:border-accent/40"
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                transition-all duration-300
                ${data.shippingMethod === method.id ? "border-accent" : "border-primary-500"}`}
            >
              {data.shippingMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-accent" />
              )}
            </div>
            <div>
              <p className="text-light text-sm font-semibold">{method.label}</p>
              <p className="text-primary-500 text-xs">{method.duration}</p>
            </div>
          </div>
          <span className="text-accent font-bold text-sm">{method.price}</span>
          <input
            type="radio"
            name="shippingMethod"
            value={method.id}
            checked={data.shippingMethod === method.id}
            onChange={() => onChange("shippingMethod", method.id)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  </div>
);

// ─── Step 2: Payment ──────────────────────────────────────────────────────────
const PaymentStep = ({ data, onChange, errors }) => {
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-light mb-1">
          Payment Details
        </h2>
        <p className="text-primary-500 text-sm">
          Your payment info is encrypted and secure.
        </p>
      </div>

      <div
        className="relative h-44 sm:h-48 rounded-2xl overflow-hidden
        bg-gradient-to-br from-dark-300 via-dark-200 to-dark-300
        border border-dark-400 p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            ))}
          </div>
          <CreditCard size={28} className="text-accent/70" />
        </div>

        <div>
          <p className="text-light/40 text-xs uppercase tracking-widest mb-1">
            Card Number
          </p>
          <p className="text-light font-mono text-base sm:text-lg tracking-widest">
            {data.cardNumber || "•••• •••• •••• ••••"}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-light/40 text-[10px] uppercase tracking-widest">
              Card Holder
            </p>
            <p className="text-light font-semibold text-sm">
              {data.cardName || "FULL NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-light/40 text-[10px] uppercase tracking-widest">
              Expires
            </p>
            <p className="text-light font-semibold text-sm">
              {data.expiry || "MM/YY"}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent
          via-white/5 to-transparent -skew-x-12 pointer-events-none"
        />
      </div>

      <InputField
        label="Name on Card"
        placeholder="John Doe"
        value={data.cardName}
        onChange={(e) => onChange("cardName", e.target.value.toUpperCase())}
        error={errors.cardName}
        required
      />

      <InputField
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        value={data.cardNumber}
        onChange={(e) =>
          onChange("cardNumber", formatCardNumber(e.target.value))
        }
        error={errors.cardNumber}
        icon={CreditCard}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Expiry Date"
          placeholder="MM/YY"
          value={data.expiry}
          onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
          error={errors.expiry}
          required
        />
        <InputField
          label="CVV"
          placeholder="•••"
          type="password"
          value={data.cvv}
          onChange={(e) =>
            onChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          error={errors.cvv}
          required
        />
      </div>

      <label
        className="flex items-center gap-3 p-4 bg-dark-300 border
        border-dark-400 rounded-xl cursor-pointer hover:border-accent/40
        transition-all duration-300"
      >
        <input
          type="checkbox"
          checked={data.saveCard}
          onChange={(e) => onChange("saveCard", e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <span className="text-primary-400 text-sm">
          Save card for future purchases
        </span>
      </label>

      <div
        className="flex items-center gap-3 p-4 bg-dark-300 border
        border-dark-400 rounded-xl"
      >
        <Lock size={16} className="text-accent shrink-0" />
        <p className="text-primary-400 text-xs leading-relaxed">
          Your payment information is encrypted with 256-bit SSL. We never store
          your full card details.
        </p>
      </div>
    </div>
  );
};

// ─── Step 3: Review ───────────────────────────────────────────────────────────
const ReviewStep = ({ shipping, payment, cartItems, subtotal, total }) => (
  <div className="space-y-5">
    <div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-light mb-1">
        Review Your Order
      </h2>
      <p className="text-primary-500 text-sm">
        Double-check everything before placing your order.
      </p>
    </div>

    <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-light font-semibold text-sm flex items-center gap-2">
          <Truck size={15} className="text-accent" />
          Shipping To
        </h4>
      </div>
      <div className="text-primary-400 text-sm space-y-1">
        <p className="text-light font-medium">
          {shipping.firstName} {shipping.lastName}
        </p>
        <p>{shipping.address}</p>
        <p>
          {shipping.city}, {shipping.state} {shipping.zip}
        </p>
        <p>{shipping.email}</p>
        <p>{shipping.phone}</p>
        <p className="text-accent capitalize mt-1">
          {shipping.shippingMethod} shipping
        </p>
      </div>
    </div>

    <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4 space-y-3">
      <h4 className="text-light font-semibold text-sm flex items-center gap-2">
        <CreditCard size={15} className="text-accent" />
        Payment Method
      </h4>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-7 bg-dark-200 border border-dark-400
          rounded-md flex items-center justify-center"
        >
          <CreditCard size={14} className="text-accent" />
        </div>
        <div>
          <p className="text-light text-sm font-medium">
            •••• •••• •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}
          </p>
          <p className="text-primary-500 text-xs">{payment.cardName}</p>
        </div>
      </div>
    </div>

    <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4 space-y-3">
      <h4 className="text-light font-semibold text-sm flex items-center gap-2">
        <Package size={15} className="text-accent" />
        {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
      </h4>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.color}`}
            className="flex items-center gap-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover border border-dark-400 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-light text-xs font-semibold line-clamp-1">
                {item.name}
              </p>
              <p className="text-primary-500 text-[10px]">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="text-light text-xs font-bold">
              ${(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-dark-400 pt-3 flex justify-between">
        <span className="text-light font-bold">Total</span>
        <span className="text-accent font-display font-bold text-lg">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ orderNumber }) => {
  const successRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      successRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
    );
  }, []);

  return (
    <div
      ref={successRef}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent
        flex items-center justify-center mb-6 animate-pulse"
      >
        <CheckCircle size={48} className="text-accent" />
      </div>
      <h2 className="font-display font-bold text-3xl sm:text-4xl text-light mb-2">
        Order Placed!
      </h2>
      <p className="text-primary-400 text-sm sm:text-base mb-2">
        Thank you for your purchase 🎉
      </p>
      <p className="text-primary-600 text-xs mb-2">
        Order <span className="text-accent font-bold">#{orderNumber}</span>
      </p>
      <p className="text-primary-600 text-xs mb-8">
        Confirmation sent to your email
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/products"
          className="btn-primary flex items-center gap-2 justify-center"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="border border-dark-400 text-primary-400 font-semibold
            text-sm px-6 py-3 rounded-2xl hover:border-accent hover:text-accent
            transition-all duration-300 flex items-center gap-2 justify-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

// ─── Main Checkout ────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ Get addOrder from admin store
  const { addOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber] = useState(
    () => `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const formRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) navigate("/cart");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    }
  }, [currentStep]);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    shippingMethod: "standard",
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateShipping = () => {
    const e = {};
    if (!shippingData.firstName.trim()) e.firstName = "First name is required";
    if (!shippingData.lastName.trim()) e.lastName = "Last name is required";
    if (!shippingData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingData.email))
      e.email = "Invalid email address";
    if (!shippingData.phone.trim()) e.phone = "Phone number is required";
    if (!shippingData.address.trim()) e.address = "Address is required";
    if (!shippingData.city.trim()) e.city = "City is required";
    if (!shippingData.state.trim()) e.state = "State is required";
    if (!shippingData.zip.trim()) e.zip = "ZIP code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!paymentData.cardName.trim()) e.cardName = "Name on card is required";
    if (!paymentData.cardNumber.trim())
      e.cardNumber = "Card number is required";
    else if (paymentData.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Invalid card number";
    if (!paymentData.expiry.trim()) e.expiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry))
      e.expiry = "Use MM/YY format";
    if (!paymentData.cvv.trim()) e.cvv = "CVV is required";
    else if (paymentData.cvv.length < 3) e.cvv = "Invalid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (currentStep === 1 && !validateShipping()) return;
    if (currentStep === 2 && !validatePayment()) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Updated handlePlaceOrder
  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2000));

    // ✅ Send order to admin store
    addOrder({
      shippingData,
      paymentData,
      cartItems,
      total,
      orderNumber,
    });

    // Clear cart
    clearCart();
    setIsSuccess(true);
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSuccess ? (
          <SuccessScreen orderNumber={orderNumber} />
        ) : (
          <>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-primary-400
                hover:text-accent transition-colors duration-300 text-sm mb-6"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>

            <StepIndicator currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2">
                <div
                  ref={formRef}
                  className="bg-dark-200 border border-dark-400
                  rounded-2xl sm:rounded-3xl p-5 sm:p-8"
                >
                  {currentStep === 1 && (
                    <ShippingStep
                      data={shippingData}
                      onChange={(field, value) =>
                        setShippingData((p) => ({ ...p, [field]: value }))
                      }
                      errors={errors}
                    />
                  )}
                  {currentStep === 2 && (
                    <PaymentStep
                      data={paymentData}
                      onChange={(field, value) =>
                        setPaymentData((p) => ({ ...p, [field]: value }))
                      }
                      errors={errors}
                    />
                  )}
                  {currentStep === 3 && (
                    <ReviewStep
                      shipping={shippingData}
                      payment={paymentData}
                      cartItems={cartItems}
                      subtotal={subtotal}
                      total={total}
                    />
                  )}

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-400">
                    {currentStep > 1 ? (
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-primary-400
                          hover:text-accent transition-colors duration-300
                          text-sm font-semibold"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        onClick={handleNext}
                        className="bg-accent text-dark font-bold text-sm
                          uppercase tracking-widest px-8 py-3.5 rounded-2xl
                          hover:bg-light transition-all duration-300
                          hover:shadow-xl hover:shadow-accent/30
                          flex items-center gap-2
                          hover:scale-[1.02] active:scale-95"
                      >
                        Continue
                        <ArrowLeft size={16} className="rotate-180" />
                      </button>
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="bg-accent text-dark font-bold text-sm
                          uppercase tracking-widest px-8 py-3.5 rounded-2xl
                          hover:bg-light transition-all duration-300
                          hover:shadow-xl hover:shadow-accent/30
                          flex items-center gap-2
                          hover:scale-[1.02] active:scale-95
                          disabled:opacity-70 disabled:cursor-not-allowed
                          disabled:hover:scale-100"
                      >
                        {isProcessing ? (
                          <>
                            <div
                              className="w-4 h-4 border-2 border-dark/30
                              border-t-dark rounded-full animate-spin"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            Place Order · ${total.toFixed(2)}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
