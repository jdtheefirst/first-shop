import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/format.ts (shared safe zone)
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const categories = [
  { id: "all", name: "All Categories" },
  { id: "uniforms", name: "Uniforms" },
  { id: "gear", name: "Protective Gear" },
  { id: "belts", name: "Belts" },
  { id: "equipment", name: "Training Equipment" },
  {
    id: "merch",
    name: "Merch & Apparel",
  },
  {
    id: "accessories",
    name: "Accessories",
  },
  {
    id: "lifestyle",
    name: "Home & Lifestyle",
  },
  {
    id: "books",
    name: "Books & Media",
  },
  {
    id: "kids",
    name: "Kids & Juniors",
  },
];

// Belt level options
export const beltLevels = [
  { id: "all", name: "All Levels" },
  { id: "white", name: "White Belt" },
  { id: "yellow", name: "Yellow Belt" },
  { id: "orange", name: "Orange Belt" },
  { id: "green", name: "Green Belt" },
  { id: "blue", name: "Blue Belt" },
  { id: "purple", name: "Purple Belt" },
  { id: "brown", name: "Brown Belt" },
  { id: "black", name: "Black Belt" },
];

export const getCurrencyOptions = () => {
  const formatter = new Intl.DisplayNames(["en"], { type: "currency" });

  const currencyCodes = Intl.supportedValuesOf
    ? Intl.supportedValuesOf("currency")
    : ["USD", "EUR", "GBP", "KES", "INR", "NGN", "AUD", "CAD", "JPY", "CNY"];

  return currencyCodes.map((code) => ({
    value: code,
    label: `${code} - ${formatter.of(code)}`,
  }));
};
