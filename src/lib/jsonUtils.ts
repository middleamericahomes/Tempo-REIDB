/**
 * Utility functions for handling JSON data in the application
 */

/**
 * Safely converts a value to a proper JSON string for database storage
 * This is especially important for arrays that need to be stored as JSONB
 */
export const toJsonString = (value: any): string => {
  // If it's already a string that looks like JSON, return it
  if (
    typeof value === "string" &&
    ((value.startsWith("[") && value.endsWith("]")) ||
      (value.startsWith("{") && value.endsWith("}")))
  ) {
    try {
      // Validate it's proper JSON by parsing and re-stringifying
      return JSON.stringify(JSON.parse(value));
    } catch (e) {
      // If it fails to parse, it wasn't valid JSON
      // Fall through to the normal handling
    }
  }

  // For arrays, stringify them properly
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  // For null or undefined, return an empty array
  if (value === null || value === undefined) {
    return "[]";
  }

  // For empty strings, return an empty array
  if (typeof value === "string" && value.trim() === "") {
    return "[]";
  }

  // For other values, wrap in an array and stringify
  return JSON.stringify([value]);
};

/**
 * Safely parses a JSON string from the database
 * Returns an empty array if the input is invalid
 */
export const fromJsonString = (jsonString: string | null): any[] => {
  if (!jsonString) return [];

  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [];
  }
};
