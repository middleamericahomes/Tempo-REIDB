/**
 * CSV Preprocessor utility
 *
 * Handles special processing for CSV files before parsing, such as
 * properly quoting comma-separated values in tag fields
 */

export const preprocessCsvText = (csvText: string): string => {
  const lines = csvText.split("\n");
  if (lines.length <= 1) return csvText; // Return original if no data

  // Extract headers
  const headers = lines[0].split(",").map((h) => h.trim());

  // Identify potential tag columns (those with 'tag' in the name)
  const tagColumnIndexes = headers
    .map((header, index) => {
      return header.toLowerCase().includes("tag") ? index : -1;
    })
    .filter((index) => index !== -1);

  // Also identify lists columns which should be treated as arrays
  const listColumnIndexes = headers
    .map((header, index) => {
      return header.toLowerCase().includes("list") ? index : -1;
    })
    .filter((index) => index !== -1);

  // Combine all array-type column indexes
  const arrayColumnIndexes = [
    ...new Set([...tagColumnIndexes, ...listColumnIndexes]),
  ];

  // If no array columns found, return original
  if (arrayColumnIndexes.length === 0) return csvText;

  // Process each data row
  const processedLines = [lines[0]]; // Start with headers

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) {
      // Skip empty lines
      processedLines.push("");
      continue;
    }

    // Split the line into fields, respecting existing quotes
    const fields = parseCSVLine(lines[i]);

    // Process array fields - add quotes if they contain commas but aren't already quoted
    arrayColumnIndexes.forEach((colIndex) => {
      if (colIndex < fields.length) {
        const value = fields[colIndex];
        if (value && value.includes(",") && !value.startsWith('"')) {
          // Quote the field if it contains commas and isn't already quoted
          fields[colIndex] = `"${value}"`;
        }
      }
    });

    // Rejoin the line
    processedLines.push(fields.join(","));
  }

  return processedLines.join("\n");
};

/**
 * Parse a CSV line respecting quotes
 * This handles the case where fields might already contain quotes
 */
const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
      currentField += char;
    } else if (char === "," && !inQuotes) {
      // End of field
      fields.push(currentField);
      currentField = "";
    } else {
      // Add character to current field
      currentField += char;
    }
  }

  // Add the last field
  fields.push(currentField);

  return fields;
};

/**
 * Process a CSV file to properly handle tag fields
 */
export const preprocessCsvFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const processedText = preprocessCsvText(csvText);

        // Create a new file with the processed content
        const processedFile = new File([processedText], file.name, {
          type: file.type,
        });

        resolve(processedFile);
      } catch (error) {
        reject(new Error(`Failed to preprocess CSV: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};
