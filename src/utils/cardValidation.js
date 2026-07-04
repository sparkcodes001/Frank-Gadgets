// src/utils/cardValidation.js

export const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const detectCardType = (number) => {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(n))
    return "mastercard";
  if (/^6(50[0-9]|5[0-9]{2})/.test(n)) return "verve";
  if (/^3[47]/.test(n)) return "amex";
  return null;
};

export const getCardLength = (type) => (type === "amex" ? 15 : 16);
export const getCvvLength = (type) => (type === "amex" ? 4 : 3);

export const validateExpiry = (expiry) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry))
    return { valid: false, error: "Use MM/YY format" };
  const [month, year] = expiry.split("/").map(Number);
  if (month < 1 || month > 12) return { valid: false, error: "Invalid month" };
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return { valid: false, error: "Card has expired" };
  if (year === currentYear && month < currentMonth)
    return { valid: false, error: "Card has expired" };
  if (year > currentYear + 20) return { valid: false, error: "Invalid year" };
  return { valid: true, error: null };
};

export const validateCard = (cardData) => {
  const errors = {};
  const cardType = detectCardType(cardData.number);
  const requiredLength = getCardLength(cardType);
  const requiredCvv = getCvvLength(cardType);
  const rawNumber = cardData.number.replace(/\s/g, "");

  if (!rawNumber) {
    errors.number = "Card number is required";
  } else if (rawNumber.length < requiredLength) {
    errors.number = `Must be ${requiredLength} digits`;
  } else if (!luhnCheck(rawNumber)) {
    errors.number = "Invalid card number";
  }

  if (!cardData.name.trim()) {
    errors.name = "Name on card is required";
  } else if (cardData.name.trim().split(" ").filter(Boolean).length < 2) {
    errors.name = "Enter full name (first & last)";
  }

  const expiryResult = validateExpiry(cardData.expiry);
  if (!cardData.expiry) {
    errors.expiry = "Expiry date is required";
  } else if (!expiryResult.valid) {
    errors.expiry = expiryResult.error;
  }

  if (!cardData.cvv) {
    errors.cvv = "CVV is required";
  } else if (cardData.cvv.length < requiredCvv) {
    errors.cvv = `Must be ${requiredCvv} digits`;
  }

  return { errors, isValid: Object.keys(errors).length === 0, cardType };
};

export const getCardNumberStatus = (number) => {
  const raw = number.replace(/\s/g, "");
  const cardType = detectCardType(number);
  const requiredLength = getCardLength(cardType);
  if (!raw) return { status: "empty", message: "" };
  if (raw.length < requiredLength)
    return {
      status: "incomplete",
      message: `${requiredLength - raw.length} more digits`,
    };
  if (!luhnCheck(raw))
    return { status: "invalid", message: "Invalid card number" };
  return { status: "valid", message: "Card number looks good ✓" };
};

export const getExpiryStatus = (expiry) => {
  if (!expiry) return { status: "empty", message: "" };
  if (expiry.length < 5) return { status: "incomplete", message: "" };
  const result = validateExpiry(expiry);
  if (!result.valid) return { status: "invalid", message: result.error };
  return { status: "valid", message: "Valid ✓" };
};
