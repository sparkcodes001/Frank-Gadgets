// src/pages/Checkout.jsx
import { useState, useEffect, useRef, useCallback } from "react";
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
  AlertCircle,
  Loader2,
  Wifi,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import { useOrders } from "../hooks/useOrders";
import { formatPrice } from "../utils/formatPrice";
import usePaystack from "../hooks/usePaystack";
import {
  detectCardType,
  getCardLength,
  getCvvLength,
  luhnCheck,
  validateExpiry,
  getCardNumberStatus,
  getExpiryStatus,
  validateCard,
} from "../utils/cardValidation";

// ─── Format helpers ───────────────────────────────────────────────────────────
const formatCardNumber = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v) => {
  const c = v.replace(/\D/g, "").slice(0, 4);
  return c.length >= 3 ? `${c.slice(0, 2)}/${c.slice(2)}` : c;
};

// ─── Card Brand Icon ──────────────────────────────────────────────────────────
const CardBrandIcon = ({ type, active }) => {
  const op = active ? "opacity-100" : "opacity-30";
  if (type === "visa")
    return (
      <span
        className={`font-black text-blue-400 text-xs tracking-wider ${op} transition-opacity`}
      >
        VISA
      </span>
    );
  if (type === "mastercard")
    return (
      <span className={`${op} transition-opacity flex items-center`}>
        <span className="w-4 h-4 rounded-full bg-red-500 opacity-90 -mr-2 inline-block" />
        <span className="w-4 h-4 rounded-full bg-yellow-400 opacity-90 inline-block" />
      </span>
    );
  if (type === "verve")
    return (
      <span
        className={`font-black text-green-400 text-[10px] tracking-wider ${op} transition-opacity`}
      >
        VERVE
      </span>
    );
  return null;
};

// ─── Field Status Dot ─────────────────────────────────────────────────────────
const FieldStatus = ({ status, message }) => {
  if (!message || status === "empty" || status === "incomplete") return null;
  return (
    <p
      className={`text-[11px] flex items-center gap-1 font-medium
      ${status === "valid" ? "text-green-400" : "text-red-400"}`}
    >
      {status === "valid" ? (
        <CheckCircle size={11} />
      ) : (
        <AlertCircle size={11} />
      )}
      {message}
    </p>
  );
};

// ─── Premium Input ────────────────────────────────────────────────────────────
const PremiumInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required,
  suffix,
  maxLength,
  inputMode,
  borderOverride,
}) => (
  <div className="group flex flex-col gap-1.5">
    <label className="text-primary-400 text-[11px] font-semibold uppercase tracking-widest">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    <div
      className={`relative flex items-center bg-dark-300 rounded-xl border
      transition-all duration-300
      ${
        borderOverride
          ? borderOverride
          : error
            ? "border-red-500/60"
            : "border-dark-400 group-focus-within:border-accent"
      }`}
    >
      {Icon && (
        <Icon
          size={15}
          className="absolute left-4 text-primary-600 group-focus-within:text-accent transition-colors"
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`w-full bg-transparent text-light text-sm py-3.5
          ${Icon ? "pl-10" : "pl-4"}
          ${suffix ? "pr-16" : "pr-4"}
          rounded-xl focus:outline-none placeholder:text-primary-700`}
      />
      {suffix && (
        <div className="absolute right-3 flex items-center gap-1">{suffix}</div>
      )}
    </div>
    {error && (
      <p className="text-red-400 text-[11px] flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

// ─── Animated Card Preview ────────────────────────────────────────────────────
const CardPreview = ({ cardData, isFlipped }) => {
  const cardType = detectCardType(cardData.number);
  return (
    <div className="relative h-48 perspective-1000 mb-2">
      <div
        className={`relative w-full h-full transition-transform duration-700
        transform-style-3d ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden
          bg-gradient-to-br from-dark-200 via-[#1a1a2e] to-dark-300
          border border-white/10 p-6 flex flex-col justify-between shadow-2xl shadow-black/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-7 rounded-md border border-yellow-400/40
                bg-gradient-to-br from-yellow-300/20 to-yellow-600/20 flex items-center justify-center"
              >
                <div className="w-6 h-4 rounded-sm border border-yellow-400/30 grid grid-cols-2 gap-px p-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-yellow-400/30 rounded-[1px]" />
                  ))}
                </div>
              </div>
              <Wifi size={16} className="text-white/30 rotate-90" />
            </div>
            <div className="flex items-center">
              {cardType ? (
                <CardBrandIcon type={cardType} active />
              ) : (
                <CreditCard size={22} className="text-white/20" />
              )}
            </div>
          </div>

          <div>
            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">
              Card Number
            </p>
            <p className="text-white font-mono text-lg sm:text-xl tracking-[0.2em] font-light">
              {cardData.number
                ? cardData.number.padEnd(19, " ").replace(/ /g, "\u00A0")
                : "•••• •••• •••• ••••"}
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">
                Card Holder
              </p>
              <p className="text-white text-sm font-medium tracking-wide uppercase">
                {cardData.name || "YOUR NAME"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[9px] uppercase tracking-widest mb-0.5">
                Expires
              </p>
              <p className="text-white text-sm font-medium">
                {cardData.expiry || "MM/YY"}
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden
          bg-gradient-to-br from-dark-300 via-[#1a1a2e] to-dark-200
          border border-white/10 shadow-2xl shadow-black/50
          [transform:rotateY(180deg)] flex flex-col justify-center"
        >
          <div className="w-full h-10 bg-dark-400 mt-6 mb-4" />
          <div className="mx-6">
            <div className="w-full h-9 bg-white/10 rounded flex items-center justify-end px-4">
              <p className="text-white font-mono text-sm tracking-widest">
                {cardData.cvv ? "•".repeat(cardData.cvv.length) : "•••"}
              </p>
            </div>
            <p className="text-white/30 text-[9px] mt-1 text-right uppercase tracking-widest">
              CVV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Contact" },
  { id: 2, label: "Delivery" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Review" },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8 sm:mb-10">
    {STEPS.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center
            justify-center font-bold text-xs transition-all duration-500
            ${
              currentStep > step.id
                ? "bg-accent text-dark"
                : currentStep === step.id
                  ? "bg-accent text-dark ring-4 ring-accent/20"
                  : "bg-dark-300 border border-dark-400 text-primary-600"
            }`}
          >
            {currentStep > step.id ? <CheckCircle size={14} /> : step.id}
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase
            ${currentStep >= step.id ? "text-accent" : "text-primary-700"}`}
          >
            {step.label}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div
            className={`w-10 sm:w-16 h-[1px] mx-1 sm:mx-2 mb-4 transition-all duration-500
            ${currentStep > step.id ? "bg-accent" : "bg-dark-400"}`}
          />
        )}
      </div>
    ))}
  </div>
);

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
const OrderSummary = ({ cartItems, subtotal, savings, total }) => {
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
        <h3 className="font-display font-bold text-base text-light">
          Order Summary
        </h3>
        <span className="lg:hidden text-primary-400">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <div className={`space-y-3 ${!isExpanded ? "hidden lg:block" : ""}`}>
        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.color}`}
            className="flex items-center gap-3"
          >
            <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-dark-300 border border-dark-400">
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
                  className="w-2 h-2 rounded-full border border-dark-400"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-primary-600 text-[10px]">{item.brand}</p>
              </div>
            </div>
            <p className="text-light text-xs font-bold shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}

        <div className="border-t border-dark-400 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-primary-400">Subtotal</span>
            <span className="text-light font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-green-400">You Save</span>
              <span className="text-green-400 font-semibold">
                -{formatPrice(savings)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-primary-400">Delivery</span>
            <span className="text-primary-500 italic text-[11px]">
              Confirmed at delivery
            </span>
          </div>
        </div>

        <div className="border-t border-dark-400 pt-3 flex justify-between items-center">
          <span className="text-light font-display font-bold">Total</span>
          <span className="text-accent font-display font-bold text-xl">
            {formatPrice(total)}
          </span>
        </div>

        <div
          className="bg-dark-300 border border-dark-400 rounded-xl p-3
          flex items-center justify-center gap-2"
        >
          <Lock size={11} className="text-accent" />
          <span className="text-primary-500 text-[10px]">
            Secured by <span className="text-accent font-bold">Paystack</span>
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {[
            { icon: Shield, text: "Bank-grade encryption" },
            { icon: Package, text: "30-day free returns" },
            { icon: Star, text: "Verified Nigerian business" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={12} className="text-accent shrink-0" />
              <span className="text-primary-600 text-[10px]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 1: Contact ──────────────────────────────────────────────────────────
const ContactStep = ({ data, onChange, errors }) => (
  <div className="space-y-5">
    <div>
      <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-1">
        Step 1 of 4
      </p>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-light">
        Contact Info
      </h2>
      <p className="text-primary-500 text-sm mt-1">
        We'll use this to confirm your order.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PremiumInput
        label="First Name"
        placeholder="Emeka"
        value={data.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        error={errors.firstName}
        icon={User}
        required
      />
      <PremiumInput
        label="Last Name"
        placeholder="Okafor"
        value={data.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        error={errors.lastName}
        required
      />
    </div>

    <PremiumInput
      label="Email Address"
      type="email"
      placeholder="emeka@example.com"
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
      error={errors.email}
      icon={Mail}
      required
    />

    <PremiumInput
      label="Phone Number"
      type="tel"
      placeholder="08012345678"
      value={data.phone}
      onChange={(e) => onChange("phone", e.target.value)}
      error={errors.phone}
      icon={Phone}
      inputMode="tel"
      required
    />
  </div>
);

// ─── Step 2: Delivery ─────────────────────────────────────────────────────────
const DeliveryStep = ({ data, onChange, errors }) => {
  const methods = [
    {
      id: "pickup",
      label: "Store Pickup",
      sub: "Ready same day · Free",
      note: "📍 Frank Gadgets, Lagos",
      badge: "FREE",
      badgeColor: "text-accent",
    },
    {
      id: "lagos",
      label: "Lagos Delivery",
      sub: "1–2 business days",
      note: "Within Lagos State",
      badge: "₦2,000",
      badgeColor: "text-light",
    },
    {
      id: "interstate",
      label: "Interstate Delivery",
      sub: "3–5 business days",
      note: "All Nigerian states",
      badge: "₦4,500",
      badgeColor: "text-light",
    },
  ];

  const needsAddress = data.shippingMethod !== "pickup";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-1">
          Step 2 of 4
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-light">
          Delivery
        </h2>
        <p className="text-primary-500 text-sm mt-1">
          Choose how you want to receive your order.
        </p>
      </div>

      <div className="space-y-2">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange("shippingMethod", m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border
              text-left transition-all duration-300
              ${
                data.shippingMethod === m.id
                  ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                  : "border-dark-400 bg-dark-300 hover:border-accent/30"
              }`}
          >
            <div
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center
              justify-center transition-all
              ${data.shippingMethod === m.id ? "border-accent" : "border-primary-600"}`}
            >
              {data.shippingMethod === m.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-light text-sm font-semibold">{m.label}</p>
              <p className="text-primary-500 text-xs">{m.sub}</p>
              <p className="text-primary-700 text-[10px]">{m.note}</p>
            </div>
            <span className={`font-bold text-sm shrink-0 ${m.badgeColor}`}>
              {m.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Animated address fields */}
      <div
        className={`space-y-4 overflow-hidden transition-all duration-500
        ${needsAddress ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pt-2 border-t border-dark-400">
          <p className="text-primary-400 text-xs mb-3 font-medium">
            Delivery address
          </p>
          <PremiumInput
            label="Street Address"
            placeholder="12 Adeola Odeku Street"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            error={errors.address}
            icon={MapPin}
            required={needsAddress}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PremiumInput
            label="City / Area"
            placeholder="Lagos Island"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            error={errors.city}
            required={needsAddress}
          />
          <PremiumInput
            label="State"
            placeholder="Lagos"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
            error={errors.state}
            required={needsAddress}
          />
        </div>
        <PremiumInput
          label="Closest Landmark (optional)"
          placeholder="Near Shoprite, Lekki"
          value={data.landmark}
          onChange={(e) => onChange("landmark", e.target.value)}
        />
      </div>
    </div>
  );
};

// ─── Step 3: Payment ──────────────────────────────────────────────────────────
const PaymentStep = ({ cardData, onChange, errors }) => {
  const [cvvFocused, setCvvFocused] = useState(false);

  const cardType = detectCardType(cardData.number);
  const cvvLength = getCvvLength(cardType);
  const rawNumber = cardData.number.replace(/\s/g, "");
  const requiredLen = getCardLength(cardType);

  // Live completeness
  const numberValid = rawNumber.length === requiredLen && luhnCheck(rawNumber);
  const expiryValid = validateExpiry(cardData.expiry).valid;
  const cvvValid = cardData.cvv.length >= cvvLength;
  const nameValid = cardData.name.trim().split(" ").filter(Boolean).length >= 2;
  const completedFields = [
    numberValid,
    expiryValid,
    cvvValid,
    nameValid,
  ].filter(Boolean).length;
  const progressPct = (completedFields / 4) * 100;

  // Card number border color
  const numStatus = getCardNumberStatus(cardData.number);
  const numBorder =
    errors.number || numStatus.status === "invalid"
      ? "border-red-500/60"
      : numStatus.status === "valid"
        ? "border-green-500/60"
        : "border-dark-400 group-focus-within:border-accent";

  // Expiry border color
  const expStatus = getExpiryStatus(cardData.expiry);
  const expBorder =
    errors.expiry || expStatus.status === "invalid"
      ? "border-red-500/60"
      : expStatus.status === "valid"
        ? "border-green-500/60"
        : "border-dark-400 group-focus-within:border-accent";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-1">
          Step 3 of 4
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-light">
          Payment
        </h2>
        <p className="text-primary-500 text-sm mt-1">
          Your card details are encrypted end-to-end.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-primary-500 text-[10px] uppercase tracking-widest">
            Card Details
          </span>
          <span
            className={`text-[10px] font-semibold transition-colors
            ${completedFields === 4 ? "text-green-400" : "text-primary-500"}`}
          >
            {completedFields === 4
              ? "✓ Ready to pay"
              : `${completedFields}/4 complete`}
          </span>
        </div>
        <div className="h-1 bg-dark-400 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500
            ${completedFields === 4 ? "bg-green-400" : "bg-accent"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Card preview */}
      <CardPreview cardData={cardData} isFlipped={cvvFocused} />

      {/* Accepted cards */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-primary-600 text-[10px] uppercase tracking-widest shrink-0">
          Accepted:
        </span>
        {["visa", "mastercard", "verve"].map((t) => (
          <div
            key={t}
            className={`px-2.5 py-1.5 rounded-lg border transition-all duration-300
            ${
              cardType === t
                ? "border-accent/60 bg-accent/5"
                : "border-dark-400 bg-dark-300 opacity-50"
            }`}
          >
            <CardBrandIcon type={t} active={cardType === t || !cardType} />
          </div>
        ))}
        {rawNumber.length >= 6 && !cardType && (
          <span className="text-red-400 text-[10px] flex items-center gap-1">
            <AlertCircle size={10} /> Unsupported
          </span>
        )}
      </div>

      {/* Card Number with live Luhn */}
      <div className="group flex flex-col gap-1.5">
        <label className="text-primary-400 text-[11px] font-semibold uppercase tracking-widest">
          Card Number <span className="text-accent">*</span>
        </label>
        <div
          className={`relative flex items-center bg-dark-300 rounded-xl border
          transition-all duration-300 ${numBorder}`}
        >
          <CreditCard
            size={15}
            className="absolute left-4 text-primary-600 group-focus-within:text-accent transition-colors"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardData.number}
            maxLength={19}
            onChange={(e) =>
              onChange("number", formatCardNumber(e.target.value))
            }
            className="w-full bg-transparent text-light text-sm py-3.5 pl-10 pr-20
              rounded-xl focus:outline-none placeholder:text-primary-700 font-mono tracking-wider"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {cardType && <CardBrandIcon type={cardType} active />}
            {numStatus.status === "valid" && (
              <CheckCircle size={14} className="text-green-400" />
            )}
            {numStatus.status === "invalid" && (
              <AlertCircle size={14} className="text-red-400" />
            )}
          </div>
        </div>
        <FieldStatus status={numStatus.status} message={numStatus.message} />
        {errors.number && numStatus.status !== "valid" && (
          <p className="text-red-400 text-[11px] flex items-center gap-1">
            <AlertCircle size={10} /> {errors.number}
          </p>
        )}
      </div>

      {/* Name on card */}
      <div className="group flex flex-col gap-1.5">
        <label className="text-primary-400 text-[11px] font-semibold uppercase tracking-widest">
          Name on Card <span className="text-accent">*</span>
        </label>
        <div
          className={`relative flex items-center bg-dark-300 rounded-xl border
          transition-all duration-300
          ${
            errors.name
              ? "border-red-500/60"
              : nameValid
                ? "border-green-500/60"
                : "border-dark-400 group-focus-within:border-accent"
          }`}
        >
          <User
            size={15}
            className="absolute left-4 text-primary-600 group-focus-within:text-accent transition-colors"
          />
          <input
            type="text"
            placeholder="EMEKA OKAFOR"
            value={cardData.name}
            onChange={(e) => onChange("name", e.target.value.toUpperCase())}
            className="w-full bg-transparent text-light text-sm py-3.5 pl-10 pr-10
              rounded-xl focus:outline-none placeholder:text-primary-700 tracking-wider"
          />
          {nameValid && (
            <CheckCircle
              size={14}
              className="absolute right-3 text-green-400"
            />
          )}
        </div>
        {errors.name && (
          <p className="text-red-400 text-[11px] flex items-center gap-1">
            <AlertCircle size={10} /> {errors.name}
          </p>
        )}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        {/* Expiry */}
        <div className="group flex flex-col gap-1.5">
          <label className="text-primary-400 text-[11px] font-semibold uppercase tracking-widest">
            Expiry <span className="text-accent">*</span>
          </label>
          <div
            className={`relative flex items-center bg-dark-300 rounded-xl border
            transition-all duration-300 ${expBorder}`}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              value={cardData.expiry}
              maxLength={5}
              onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
              className="w-full bg-transparent text-light text-sm py-3.5 px-4
                rounded-xl focus:outline-none placeholder:text-primary-700"
            />
            {expStatus.status === "valid" && (
              <CheckCircle
                size={14}
                className="absolute right-3 text-green-400"
              />
            )}
            {expStatus.status === "invalid" && (
              <AlertCircle
                size={14}
                className="absolute right-3 text-red-400"
              />
            )}
          </div>
          <FieldStatus status={expStatus.status} message={expStatus.message} />
          {errors.expiry && expStatus.status !== "valid" && (
            <p className="text-red-400 text-[11px] flex items-center gap-1">
              <AlertCircle size={10} /> {errors.expiry}
            </p>
          )}
        </div>

        {/* CVV - flips card */}
        <div className="group flex flex-col gap-1.5">
          <label className="text-primary-400 text-[11px] font-semibold uppercase tracking-widest">
            CVV <span className="text-accent">*</span>
            <span className="text-primary-700 normal-case font-normal ml-1">
              ({cvvLength} digits)
            </span>
          </label>
          <div
            className={`relative flex items-center bg-dark-300 rounded-xl border
            transition-all duration-300
            ${
              errors.cvv
                ? "border-red-500/60"
                : cvvValid
                  ? "border-green-500/60"
                  : "border-dark-400 group-focus-within:border-accent"
            }`}
          >
            <input
              type="password"
              inputMode="numeric"
              placeholder={"•".repeat(cvvLength)}
              value={cardData.cvv}
              maxLength={cvvLength}
              onChange={(e) =>
                onChange(
                  "cvv",
                  e.target.value.replace(/\D/g, "").slice(0, cvvLength),
                )
              }
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              className="w-full bg-transparent text-light text-sm py-3.5 px-4
                rounded-xl focus:outline-none placeholder:text-primary-700"
            />
            {cvvValid && (
              <CheckCircle
                size={14}
                className="absolute right-3 text-green-400"
              />
            )}
          </div>
          {errors.cvv && (
            <p className="text-red-400 text-[11px] flex items-center gap-1">
              <AlertCircle size={10} /> {errors.cvv}
            </p>
          )}
          {cvvFocused && (
            <p className="text-primary-600 text-[10px]">
              {cvvLength}-digit code on the{" "}
              {cardType === "amex" ? "front" : "back"} of your card
            </p>
          )}
        </div>
      </div>

      {/* Save card */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          onClick={() => onChange("saveCard", !cardData.saveCard)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${cardData.saveCard ? "bg-accent border-accent" : "border-dark-400 group-hover:border-accent/50"}`}
        >
          {cardData.saveCard && <CheckCircle size={12} className="text-dark" />}
        </div>
        <span className="text-primary-400 text-sm">
          Save card for faster checkout
        </span>
      </label>

      {/* Security */}
      <div className="flex items-start gap-3 p-4 bg-dark-300 border border-dark-400 rounded-xl">
        <Lock size={14} className="text-accent shrink-0 mt-0.5" />
        <p className="text-primary-500 text-xs leading-relaxed">
          256-bit SSL encrypted. Validated with the{" "}
          <span className="text-accent">Luhn algorithm</span> before processing.
          Powered by <span className="text-accent font-semibold">Paystack</span>
          .
        </p>
      </div>
    </div>
  );
};

// ─── Step 4: Review ───────────────────────────────────────────────────────────
const ReviewStep = ({ shipping, cardData, cartItems, total }) => {
  const deliveryLabels = {
    pickup: "Store Pickup — Free",
    lagos: "Lagos Delivery — ₦2,000",
    interstate: "Interstate Delivery — ₦4,500",
  };
  const cardType = detectCardType(cardData.number);
  const maskedCard = cardData.number
    ? `•••• •••• •••• ${cardData.number.replace(/\s/g, "").slice(-4)}`
    : "";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-1">
          Step 4 of 4
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-light">
          Review & Pay
        </h2>
        <p className="text-primary-500 text-sm mt-1">
          Everything look good? Let's go.
        </p>
      </div>

      <div className="space-y-3">
        {/* Contact */}
        <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4 space-y-1">
          <p className="text-primary-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Contact
          </p>
          <p className="text-light text-sm font-semibold">
            {shipping.firstName} {shipping.lastName}
          </p>
          <p className="text-primary-400 text-xs">{shipping.email}</p>
          <p className="text-primary-400 text-xs">{shipping.phone}</p>
        </div>

        {/* Delivery */}
        <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4 space-y-1">
          <p className="text-primary-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Delivery
          </p>
          {shipping.address && (
            <p className="text-light text-sm">{shipping.address}</p>
          )}
          {shipping.landmark && (
            <p className="text-primary-500 text-xs">
              Near: {shipping.landmark}
            </p>
          )}
          {shipping.city && (
            <p className="text-primary-400 text-xs">
              {shipping.city}
              {shipping.state ? `, ${shipping.state}` : ""}
            </p>
          )}
          <p className="text-accent text-xs font-medium mt-1">
            {deliveryLabels[shipping.shippingMethod]}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4">
          <p className="text-primary-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Payment
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-7 bg-dark-200 border border-dark-400 rounded-lg
              flex items-center justify-center"
            >
              {cardType ? (
                <CardBrandIcon type={cardType} active />
              ) : (
                <CreditCard size={12} className="text-primary-500" />
              )}
            </div>
            <div>
              <p className="text-light text-xs font-semibold">{maskedCard}</p>
              <p className="text-primary-500 text-[10px]">{cardData.name}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-dark-300 border border-dark-400 rounded-2xl p-4">
          <p className="text-primary-500 text-[10px] uppercase tracking-widest font-semibold mb-3">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </p>
          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.color}`}
                className="flex items-center gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover border border-dark-400 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-light text-xs font-semibold line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-primary-600 text-[10px]">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-light text-xs font-bold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 mt-3 border-t border-dark-400">
            <span className="text-light font-bold text-sm">Total</span>
            <span className="text-accent font-display font-bold text-xl">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ orderNumber, paymentRef, total }) => {
  const ref = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" },
    );
    gsap.fromTo(
      checkRef.current,
      { scale: 0, rotate: -180 },
      { scale: 1, rotate: 0, duration: 0.6, delay: 0.3, ease: "back.out(2)" },
    );
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-12 text-center max-w-sm mx-auto"
    >
      <div className="relative mb-8">
        <div
          className="w-28 h-28 rounded-full bg-accent/10 border-2 border-accent
          flex items-center justify-center"
        >
          <div ref={checkRef}>
            <CheckCircle size={56} className="text-accent" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-accent" />
        <h2 className="font-display font-bold text-3xl text-light">
          Payment Confirmed
        </h2>
      </div>
      <p className="text-primary-400 text-sm mb-6">
        Your order is being processed 🇳🇬
      </p>

      <div
        className="w-full bg-dark-200 border border-dark-400 rounded-2xl p-5
        space-y-3 text-left mb-6"
      >
        <div className="flex justify-between items-center pb-3 border-b border-dark-400">
          <span className="text-primary-500 text-xs uppercase tracking-widest">
            Order
          </span>
          <span className="text-accent font-bold text-sm">#{orderNumber}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-primary-500">Payment Ref</span>
          <span className="text-light font-mono text-[10px] max-w-[160px] truncate">
            {paymentRef}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-primary-500">Amount Paid</span>
          <span className="text-accent font-bold">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-primary-500">Status</span>
          <span className="text-green-400 font-semibold flex items-center gap-1">
            <CheckCircle size={10} /> Paid
          </span>
        </div>
      </div>

      <p className="text-primary-600 text-xs mb-8 leading-relaxed">
        Confirmation email sent. Our team will reach out within 24 hours.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          to="/products"
          className="btn-primary flex items-center gap-2 justify-center flex-1 text-sm"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="border border-dark-400 text-primary-400 font-semibold text-sm
            px-5 py-3 rounded-2xl hover:border-accent hover:text-accent
            transition-all duration-300 flex items-center gap-2 justify-center"
        >
          Home
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
  const { addOrder } = useOrders();
  const { initializePayment } = usePaystack();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [errors, setErrors] = useState({});

  const [orderNumber] = useState(
    () => `FG${Date.now().toString(36).toUpperCase()}`,
  );

  const formRef = useRef(null);
  const pageRef = useRef(null);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    shippingMethod: "pickup",
  });

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const savings = cartItems.reduce(
    (sum, item) =>
      sum + ((item.oldPrice || item.price) - item.price) * item.quantity,
    0,
  );
  const total = subtotal;

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) navigate("/cart");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [currentStep]);

  const validateContact = useCallback(() => {
    const e = {};
    if (!shippingData.firstName.trim()) e.firstName = "Required";
    if (!shippingData.lastName.trim()) e.lastName = "Required";
    if (!shippingData.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(shippingData.email))
      e.email = "Invalid email";
    if (!shippingData.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [shippingData]);

  const validateDelivery = useCallback(() => {
    const e = {};
    if (shippingData.shippingMethod !== "pickup") {
      if (!shippingData.address.trim()) e.address = "Required";
      if (!shippingData.city.trim()) e.city = "Required";
      if (!shippingData.state.trim()) e.state = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [shippingData]);

  // ✅ Uses validateCard from cardValidation.js (Luhn + expiry + CVV length)
  const validatePayment = useCallback(() => {
    const { errors: e, isValid } = validateCard(cardData);
    setErrors(e);
    return isValid;
  }, [cardData]);

  const handleNext = () => {
    setErrors({});
    setPaymentCancelled(false);
    if (currentStep === 1 && !validateContact()) return;
    if (currentStep === 2 && !validateDelivery()) return;
    if (currentStep === 3 && !validatePayment()) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setPaymentCancelled(false);
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayNow = () => {
    setIsProcessing(true);
    setPaymentCancelled(false);

    initializePayment({
      email: shippingData.email,
      amount: total,
      name: `${shippingData.firstName} ${shippingData.lastName}`,
      phone: shippingData.phone,
      metadata: {
        "Order Number": orderNumber,
        "Delivery Method": shippingData.shippingMethod,
        Address: shippingData.address || "Store Pickup",
        City: shippingData.city || "Lagos",
      },

      // ✅ Payment confirmed by Paystack - now save to orders
      onSuccess: (response) => {
        const cardLast4 = cardData.number.replace(/\s/g, "").slice(-4);

        // This addOrder now correctly maps everything to flat fields
        addOrder({
          shippingData,
          cartItems,
          total,
          orderNumber,
          paymentRef: response.reference,
          paymentStatus: "paid",
          cardLast4,
        });

        setPaymentRef(response.reference);
        clearCart();
        setIsSuccess(true);
        setIsProcessing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },

      onClose: () => {
        setIsProcessing(false);
        setPaymentCancelled(true);
      },
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSuccess ? (
          <SuccessScreen
            orderNumber={orderNumber}
            paymentRef={paymentRef}
            total={total}
          />
        ) : (
          <>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-primary-500
                hover:text-accent transition-colors text-sm mb-8 group"
            >
              <ArrowLeft
                size={15}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Cart
            </Link>

            <StepIndicator currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
              <div className="lg:col-span-3">
                <div
                  ref={formRef}
                  className="bg-dark-200 border border-dark-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8"
                >
                  {currentStep === 1 && (
                    <ContactStep
                      data={shippingData}
                      onChange={(f, v) =>
                        setShippingData((p) => ({ ...p, [f]: v }))
                      }
                      errors={errors}
                    />
                  )}
                  {currentStep === 2 && (
                    <DeliveryStep
                      data={shippingData}
                      onChange={(f, v) =>
                        setShippingData((p) => ({ ...p, [f]: v }))
                      }
                      errors={errors}
                    />
                  )}
                  {currentStep === 3 && (
                    <PaymentStep
                      cardData={cardData}
                      onChange={(f, v) =>
                        setCardData((p) => ({ ...p, [f]: v }))
                      }
                      errors={errors}
                    />
                  )}
                  {currentStep === 4 && (
                    <ReviewStep
                      shipping={shippingData}
                      cardData={cardData}
                      cartItems={cartItems}
                      total={total}
                    />
                  )}

                  {/* Payment cancelled banner */}
                  {paymentCancelled && (
                    <div
                      className="mt-5 flex items-start gap-3 p-4
                      bg-red-500/10 border border-red-500/25 rounded-xl"
                    >
                      <AlertCircle
                        size={15}
                        className="text-red-400 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-red-400 text-sm font-semibold">
                          Payment window closed
                        </p>
                        <p className="text-primary-500 text-xs mt-0.5">
                          No charge was made. Click Pay to try again.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-400">
                    {currentStep > 1 ? (
                      <button
                        onClick={handleBack}
                        disabled={isProcessing}
                        className="flex items-center gap-2 text-primary-400 hover:text-light
                          transition-colors text-sm font-medium disabled:opacity-40 group"
                      >
                        <ArrowLeft
                          size={15}
                          className="group-hover:-translate-x-1 transition-transform"
                        />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-accent text-dark font-bold
                          text-sm uppercase tracking-widest px-7 py-3.5 rounded-2xl
                          hover:bg-light transition-all duration-300 hover:shadow-xl
                          hover:shadow-accent/25 hover:scale-[1.02] active:scale-95"
                      >
                        Continue
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="flex items-center gap-2.5 bg-accent text-dark font-bold
                          text-sm uppercase tracking-widest px-7 py-3.5 rounded-2xl
                          hover:bg-light transition-all duration-300 hover:shadow-xl
                          hover:shadow-accent/25 hover:scale-[1.02] active:scale-95
                          disabled:opacity-60 disabled:cursor-not-allowed
                          disabled:hover:scale-100"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock size={15} />
                            Pay {formatPrice(total)}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  savings={savings}
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
