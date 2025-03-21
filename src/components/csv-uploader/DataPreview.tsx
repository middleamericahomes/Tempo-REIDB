import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DataPreviewProps {
  data?: Record<string, string[]>;
  mappedColumns?: Record<string, string>;
  validationErrors?: Record<string, Array<{ row: number; message: string }>>;
  onContinue?: () => void;
  onBack?: () => void;
  fileName?: string;
  totalRows?: number;
}

const DataPreview = ({
  data = {},
  mappedColumns = {},
  validationErrors = {},
  onContinue = () => console.log("Continue to next step"),
  onBack = () => console.log("Go back to previous step"),
  fileName = "property_data.csv",
  totalRows = 0,
}: DataPreviewProps) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const [processedData, setProcessedData] = useState<
    Array<Record<string, any>>
  >([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [maxPreviewRows, setMaxPreviewRows] = useState(10);
  const totalErrors = Object.values(validationErrors).flat().length;

  // Process the data from CSV format to row-based format for display
  useEffect(() => {
    if (
      Object.keys(data).length === 0 ||
      Object.keys(mappedColumns).length === 0
    ) {
      return;
    }

    // Get all CSV columns that have been mapped
    const mappedCsvColumns = Object.keys(mappedColumns);
    setColumns(mappedCsvColumns);

    // Determine how many rows we have data for
    const maxRows = Math.max(...Object.values(data).map((arr) => arr.length));

    // Create row-based data structure
    const rows: Array<Record<string, any>> = [];
    for (let i = 0; i < maxRows; i++) {
      const row: Record<string, any> = {};
      mappedCsvColumns.forEach((csvCol) => {
        row[csvCol] =
          data[csvCol] && i < data[csvCol].length ? data[csvCol][i] : "";
      });
      rows.push(row);
    }

    setProcessedData(rows);
    setMaxPreviewRows(Math.min(10, rows.length));
  }, [data, mappedColumns]);

  // Count errors by row
  const errorsByRow: Record<number, number> = {};
  Object.values(validationErrors).forEach((errors) => {
    errors.forEach((error) => {
      errorsByRow[error.row] = (errorsByRow[error.row] || 0) + 1;
    });
  });

  // Determine which rows to display
  const displayData = showAllRows
    ? processedData
    : processedData.slice(0, maxPreviewRows);

  // Validate data (simple validation for demo)
  const validateData = () => {
    // In a real app, you would perform actual validation here
    // For now, we'll just simulate that the data is valid
    return true;
  };

  return (
    <div className="w-full bg-background rounded-lg">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Data Preview</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Preview how your data will be imported
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{fileName}</span>
            </div>
            <Badge variant="outline">{totalRows.toLocaleString()} rows</Badge>
            {totalErrors > 0 ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {totalErrors} {totalErrors === 1 ? "Error" : "Errors"}
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Validation Passed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {processedData.length > 0 ? (
            <>
              <div className="border rounded-md overflow-hidden mb-4">
                <Table>
                  <TableCaption>
                    Preview of {displayData.length} out of{" "}
                    {totalRows.toLocaleString()} rows
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {columns.map((col) => (
                        <TableHead key={col} className="min-w-[120px]">
                          <div className="flex flex-col">
                            <span className="font-medium">{col}</span>
                            <span className="text-xs text-muted-foreground">
                              {mappedColumns[col]}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-24">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row, rowIndex) => (
                      <TableRow
                        key={rowIndex}
                        className={
                          errorsByRow[rowIndex + 1] ? "bg-destructive/10" : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {rowIndex + 1}
                        </TableCell>
                        {columns.map((col) => {
                          const hasError = validationErrors[
                            mappedColumns[col]
                          ]?.some((err) => err.row === rowIndex + 1);
                          return (
                            <TableCell
                              key={col}
                              className={
                                hasError ? "text-destructive font-medium" : ""
                              }
                            >
                              {row[col]?.toString() || ""}
                              {hasError && (
                                <div className="text-xs text-destructive mt-1">
                                  {validationErrors[mappedColumns[col]]
                                    .filter((err) => err.row === rowIndex + 1)
                                    .map((err, i) => (
                                      <div key={i}>{err.message}</div>
                                    ))}
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          {errorsByRow[rowIndex + 1] ? (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errorsByRow[rowIndex + 1]}{" "}
                              {errorsByRow[rowIndex + 1] === 1
                                ? "Error"
                                : "Errors"}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Valid
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {processedData.length > maxPreviewRows && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllRows(!showAllRows)}
                  >
                    {showAllRows
                      ? "Show Less"
                      : `Show All (${processedData.length} Rows)`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No preview available</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                There is no data to preview or no columns have been mapped yet.
                Please go back to the mapping step and ensure your columns are
                properly mapped.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onBack}>
              Back to Mapping
            </Button>
            <Button
              onClick={onContinue}
              disabled={totalErrors > 0 || processedData.length === 0}
            >
              {totalErrors > 0
                ? "Fix Errors to Continue"
                : "Continue to Upload"}
            </Button>
          </div>

          {totalErrors > 0 && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
              <h3 className="text-sm font-medium flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Validation Issues
              </h3>
              <ul className="mt-2 text-sm space-y-1">
                {Object.entries(validationErrors).map(([field, errors]) => (
                  <li key={field}>
                    <span className="font-medium">{field}:</span>{" "}
                    {errors.length} {errors.length === 1 ? "issue" : "issues"}{" "}
                    found
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">
                Please fix these errors before continuing with the upload
                process.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPreview;
