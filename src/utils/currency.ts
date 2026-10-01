/**
 * Formats a number to Indian Rupees (INR) with standard Indian numbering grouping.
 * Example: 18499 -> "₹18,499", 125000 -> "₹1,25,000"
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const formatINRRaw = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return Math.round(amount).toLocaleString('en-IN');
};
