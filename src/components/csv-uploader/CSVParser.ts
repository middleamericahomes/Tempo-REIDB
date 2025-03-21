/**
 * CSV Parser utility
 *
 * This is a simple CSV parser that could be used in a real application.
 * For the demo, we're using mock data instead.
 */

export interface CSVParseResult {
  columns: string[];
  headers: string[];
  data: Record<string, string[]>;
  sampleData: Record<string, string[]>;
  totalRows: number;
}

export const parseCSV = async (file: File): Promise<CSVParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split("\n");

        // Extract headers
        const headers = lines[0]
          .split(",")
          .map((header) => header.trim().replace(/["']/g, ""));

        console.log("CSV Headers:", headers);

        // Parse data rows
        const dataRows: Record<string, string>[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines

          // Parse the line respecting quotes
          const parsedValues = parseCSVLineRespectingQuotes(lines[i]);
          const values = parsedValues.map((val) =>
            val.trim().replace(/^"(.*)"$/g, "$1"),
          );

          const row: Record<string, string> = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });

          dataRows.push(row);
        }

        // Helper function to parse CSV line respecting quotes
        function parseCSVLineRespectingQuotes(line: string): string[] {
          const result: string[] = [];
          let current = "";
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
              inQuotes = !inQuotes;
              current += char;
            } else if (char === "," && !inQuotes) {
              result.push(current);
              current = "";
            } else {
              current += char;
            }
          }

          result.push(current);
          return result;
        }

        // Create sample data (for column mapping preview)
        const sampleData: Record<string, string[]> = {};
        headers.forEach((header) => {
          sampleData[header] = dataRows
            .slice(0, 5)
            .map((row) => row[header])
            .filter(Boolean);
        });

        console.log(
          "Sample data created:",
          Object.keys(sampleData).length,
          "columns",
        );

        // Convert row-based data to column-based data for easier mapping
        const columnData: Record<string, string[]> = {};
        headers.forEach((header) => {
          columnData[header] = dataRows.map((row) => row[header] || "");
        });

        resolve({
          columns: headers,
          headers: headers,
          data: columnData, // This contains ALL rows
          sampleData, // This contains only 5 sample rows
          totalRows: dataRows.length,
        });
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};
