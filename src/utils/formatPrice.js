export const formatPrice = (price) => {
  if (price === undefined || price === null) return "₦0";

  return `₦${Number(price).toLocaleString("en-NG")}`;
};

export const formatPriceCompact = (price) => {
  if (price >= 1000000) {
    return `₦${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `₦${(price / 1000).toFixed(0)}K`;
  }
  return `₦${price}`;
};
