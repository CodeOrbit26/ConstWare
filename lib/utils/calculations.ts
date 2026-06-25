/**
 * Area conversion and calculation utilities for Indian context
 */

export const convertSqft = (sqft: number) => {
  if (!sqft || isNaN(sqft)) return { sqm: 0, marla: 0, bigha: 0 };
  
  return {
    sqm: (sqft / 10.764).toFixed(1),
    marla: (sqft / 272.25).toFixed(2), // Standard Punjabi Marla, varies by region
    bigha: (sqft / 27000).toFixed(3)   // Standard UP Bigha, highly variable
  };
};

export const calculateFAR = (builtUpArea: number, plotArea: number) => {
  if (!builtUpArea || !plotArea) return 0;
  return (builtUpArea / plotArea).toFixed(2);
};

export const formatINR = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPricePerSqft = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};
