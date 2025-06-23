import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to generate a consistent countryId from a feature or name
export function getCountryIdFromFeature(featureOrName: any): string {
  if (typeof featureOrName === "string") {
    return featureOrName.toLowerCase().replace(/\s+/g, "-");
  }
  const props = featureOrName.properties || {};
  return (
    props.name?.toLowerCase().replace(/\s+/g, "-") ||
    props.NAME?.toLowerCase().replace(/\s+/g, "-") ||
    props.id ||
    "unknown"
  );
}
