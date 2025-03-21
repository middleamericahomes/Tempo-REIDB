import { toJsonString } from "./jsonUtils";
import { processTags, processLists } from "./tagUtils";

/**
 * Transforms CSV data based on column mappings to prepare for database insertion
 */
export const transformData = (
  data: Record<string, string[]>,
  mappings: Record<string, string>,
  batchId: string,
): any[] => {
  // Validate inputs to prevent null/undefined errors
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data: data must be a non-null object");
  }
  if (!mappings || typeof mappings !== "object") {
    throw new Error("Invalid mappings: mappings must be a non-null object");
  }
  if (!batchId || typeof batchId !== "string") {
    throw new Error("Invalid batchId: batchId must be a non-empty string");
  }
  // Filter out mappings to fields that don't exist in the database
  const filteredMappings: Record<string, string> = {};
  for (const [csvCol, dbField] of Object.entries(mappings)) {
    // Skip phone fields beyond what's in the database schema
    if (
      dbField.startsWith("phone_") &&
      parseInt(dbField.replace("phone_", "")) > 5
    )
      continue;
    if (
      dbField.startsWith("phone_type_") &&
      parseInt(dbField.replace("phone_type_", "")) > 5
    )
      continue;
    if (
      dbField.startsWith("phone_status_") &&
      parseInt(dbField.replace("phone_status_", "")) > 5
    )
      continue;
    if (
      dbField.startsWith("phone_tags_") &&
      parseInt(dbField.replace("phone_tags_", "")) > 5
    )
      continue;

    // Skip email fields beyond what's in the database schema
    if (
      dbField.startsWith("email_") &&
      parseInt(dbField.replace("email_", "")) > 10
    )
      continue;

    filteredMappings[csvCol] = dbField;
  }

  // Get all CSV column names
  const csvColumns = Object.keys(data || {});

  // Determine how many rows we have by checking the length of the first column's data
  const rowCount =
    csvColumns.length > 0 && Array.isArray(data[csvColumns[0]])
      ? data[csvColumns[0]].length
      : 0;

  // Create an array to hold our transformed records
  const transformedRecords = [];

  // Process each row
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const record: Record<string, any> = {
      import_batch_id: batchId,
      source: "csv_import",
    };

    // For each CSV column, map it to the corresponding database field
    for (const csvColumn of csvColumns) {
      const dbField = filteredMappings[csvColumn];

      // Skip if there's no mapping for this column
      if (!dbField) continue;

      // Get the value for this cell
      const value = data[csvColumn][rowIndex];

      // Handle special field types
      if (
        dbField.endsWith("_tags") ||
        dbField === "tags" ||
        dbField === "lists" ||
        dbField === "list_stack" ||
        dbField.toLowerCase().includes("tag") ||
        dbField.toLowerCase().includes("list")
      ) {
        // Always store as a JSON array for array-type fields
        if (!value || value.trim() === "") {
          // Empty value becomes empty array
          record[dbField] = [];
        } else if (value.includes(",")) {
          // Handle quoted comma-separated values
          if (value.startsWith('"') && value.endsWith('"')) {
            // Remove the surrounding quotes and split
            const unquoted = value.substring(1, value.length - 1);
            record[dbField] = unquoted
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
          } else {
            // Regular comma-separated values
            record[dbField] = value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
          }
        } else {
          // Single value becomes a single-element array
          record[dbField] = [value.trim()];
        }

        // Ensure we're storing a valid JSON array for Supabase
        // Use our utility function to guarantee proper JSON formatting
        record[dbField] = toJsonString(record[dbField]);
      } else {
        // Store everything else as plain text
        record[dbField] = value || null;
      }
    }

    // Generate a UUID for the property ID if not provided
    if (!record.id) {
      record.id = crypto.randomUUID();
    }

    transformedRecords.push(record);
  }

  return transformedRecords;
};

/**
 * Processes data in chunks to avoid memory issues with large datasets
 */
export const processInChunks = <T>(
  items: T[],
  chunkSize: number,
  processor: (chunk: T[]) => Promise<any>,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    let currentIndex = 0;

    const processNextChunk = async () => {
      if (currentIndex >= items.length) {
        resolve(results);
        return;
      }

      const chunk = items.slice(currentIndex, currentIndex + chunkSize);
      currentIndex += chunkSize;

      try {
        const chunkResults = await processor(chunk);
        results.push(...chunkResults);

        // Continue with next chunk
        setTimeout(processNextChunk, 0);
      } catch (error) {
        reject(error);
      }
    };

    processNextChunk();
  });
};
