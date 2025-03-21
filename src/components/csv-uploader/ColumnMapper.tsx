import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Search,
  ArrowRight,
  Check,
  AlertCircle,
  Info,
  ArrowLeftRight,
} from "lucide-react";

interface ColumnMapperProps {
  csvColumns?: string[];
  databaseFields?: string[];
  mappings?: Record<string, string>;
  onMappingComplete?: (mappings: Record<string, string>) => void;
  onBack?: () => void;
  sampleData?: Record<string, string[]>;
  fileName?: string;
  totalRows?: number;
}

const ColumnMapper = ({
  csvColumns = [
    "address",
    "city",
    "state",
    "zip",
    "price",
    "bedrooms",
    "bathrooms",
    "sqft",
    "year_built",
    "property_type",
    "mailing_address",
    "mailing_city",
    "mailing_state",
    "mailing_zip",
    "owner_name",
    "owner_phone",
    "owner_email",
  ],
  databaseFields = [
    "property_address",
    "property_city",
    "property_state",
    "property_zip",
    "listing_price",
    "bedrooms",
    "bathrooms",
    "square_footage",
    "year_built",
    "property_type",
    "lot_size",
    "status",
    "owner_first_name",
    "owner_last_name",
    "owner_street",
    "owner_city",
    "owner_state",
    "owner_zip",
    "owner_phone",
    "owner_email",
    "property_county",
  ],
  mappings = {},
  onMappingComplete = () => {},
  onBack = () => {},
  sampleData = {
    address: ["123 Main St", "456 Oak Ave", "789 Pine Blvd"],
    city: ["New York", "Los Angeles", "Chicago"],
    state: ["NY", "CA", "IL"],
    zip: ["10001", "90210", "60601"],
    price: ["500000", "750000", "425000"],
    bedrooms: ["2", "3", "2"],
    bathrooms: ["2", "2.5", "1"],
    sqft: ["1200", "2000", "950"],
    year_built: ["1985", "2005", "1972"],
    property_type: ["Condo", "Single Family", "Townhouse"],
    mailing_address: ["123 Main St", "456 Oak Ave", "789 Pine Blvd"],
    mailing_city: ["New York", "Los Angeles", "Chicago"],
    mailing_state: ["NY", "CA", "IL"],
    mailing_zip: ["10001", "90210", "60601"],
    owner_name: ["John Smith", "Jane Doe", "Robert Johnson"],
    owner_phone: ["555-123-4567", "555-987-6543", "555-456-7890"],
    owner_email: ["john@example.com", "jane@example.com", "robert@example.com"],
  },
  fileName = "property_data.csv",
  totalRows = 1250,
}: ColumnMapperProps) => {
  const [columnMappings, setColumnMappings] =
    useState<Record<string, string>>(mappings);
  const [searchTerm, setSearchTerm] = useState("");
  const [autoMapComplete, setAutoMapComplete] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [requiredFields] = useState<string[]>([
    "property_address",
    "property_city",
    "property_state",
    "property_zip",
    "first_name",
    "last_name",
    "status",
  ]);
  const [mappingProgress, setMappingProgress] = useState(0);

  // Calculate mapping progress
  useEffect(() => {
    const mappedCount = Object.keys(columnMappings).length;
    const requiredMappedCount = requiredFields.filter((field) =>
      Object.values(columnMappings).includes(field),
    ).length;

    // Weight required fields more heavily
    const progress = Math.min(
      100,
      Math.round((mappedCount / csvColumns.length) * 70) +
        Math.round((requiredMappedCount / requiredFields.length) * 30),
    );

    setMappingProgress(progress);
  }, [columnMappings, csvColumns.length, requiredFields]);

  // Filter database fields based on search term
  const filteredDatabaseFields = databaseFields.filter((field) =>
    field.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Auto-map columns based on name similarity
  const handleAutoMap = () => {
    const newMappings = { ...columnMappings };

    csvColumns.forEach((csvCol) => {
      // If not already mapped, try to find a match
      if (!newMappings[csvCol]) {
        // First try exact match (ignoring case and spaces)
        const normalizedCsvCol = csvCol.toLowerCase().replace(/\s+/g, "_");

        const exactMatch = databaseFields.find(
          (dbField) => dbField.toLowerCase() === normalizedCsvCol,
        );

        if (exactMatch) {
          newMappings[csvCol] = exactMatch;
        } else {
          // Try partial match with more intelligent matching
          // For example, "First Name" should match "first_name"
          const partialMatches = databaseFields.filter((dbField) => {
            const dbFieldNormalized = dbField.toLowerCase();
            const csvColNormalized = normalizedCsvCol;

            // Handle special cases
            if (
              csvColNormalized === "first" &&
              dbFieldNormalized === "first_name"
            )
              return true;
            if (
              csvColNormalized === "last" &&
              dbFieldNormalized === "last_name"
            )
              return true;

            // Check if database field contains the CSV column name
            if (dbFieldNormalized.includes(csvColNormalized)) return true;

            // Check if CSV column contains the database field
            if (csvColNormalized.includes(dbFieldNormalized)) return true;

            // Check for phone fields with numbers
            if (
              /phone\s*\d+/.test(csvColNormalized) &&
              /phone_\d+/.test(dbFieldNormalized)
            ) {
              const csvPhoneNum = csvColNormalized.match(/\d+/)?.[0];
              const dbPhoneNum = dbFieldNormalized.match(/\d+/)?.[0];
              if (csvPhoneNum === dbPhoneNum) return true;
            }

            return false;
          });

          if (partialMatches.length > 0) {
            // Choose the best match (shortest one is usually more specific)
            const bestMatch = partialMatches.sort(
              (a, b) => a.length - b.length,
            )[0];
            newMappings[csvCol] = bestMatch;
          }
        }
      }
    });

    setColumnMappings(newMappings);
    setAutoMapComplete(true);
  };

  // Update a single mapping
  const updateMapping = (csvColumn: string, dbField: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [csvColumn]: dbField,
    }));
  };

  // Check if all required fields are mapped
  const allRequiredFieldsMapped = requiredFields.every((field) =>
    Object.values(columnMappings).includes(field),
  );

  // Handle completion of mapping
  const handleComplete = () => {
    if (allRequiredFieldsMapped) {
      onMappingComplete(columnMappings);
    }
  };

  // Check if a field is required
  const isRequiredField = (field: string) => requiredFields.includes(field);

  // Check if a field is mapped
  const isFieldMapped = (field: string) =>
    Object.values(columnMappings).includes(field);

  return (
    <div className="w-full bg-background p-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Map the columns</CardTitle>
              <CardDescription className="mt-1">
                Drag the corresponding column uploaded in your CSV file
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{fileName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalRows.toLocaleString()} rows
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${mappingProgress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${mappingProgress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{mappingProgress}%</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-1/2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search database fields..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAutoMap}
              variant="secondary"
              className="flex items-center gap-2"
              disabled={autoMapComplete}
            >
              {autoMapComplete ? <Check className="h-4 w-4" /> : null}
              Auto-Map Columns
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-background rounded-full p-2 border shadow-md">
              <ArrowLeftRight className="h-6 w-6 text-blue-500" />
            </div>
            {/* Left side - CSV columns */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h3 className="font-medium">CSV Columns</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a column to map
                </p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {csvColumns.map((column) => {
                  const isMapped = !!columnMappings[column];
                  return (
                    <div
                      key={column}
                      className={`flex items-center justify-between p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${selectedColumn === column ? "bg-muted/50" : ""}`}
                      onClick={() => setSelectedColumn(column)}
                    >
                      <div>
                        <div className="font-medium">{column}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {sampleData[column] && sampleData[column].length > 0
                            ? sampleData[column].slice(0, 1).join(", ")
                            : "No sample data"}
                        </div>
                      </div>
                      {isMapped && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          Mapped
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side - Database fields */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h3 className="font-medium">Database Fields</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a field to map to the selected column (
                  {filteredDatabaseFields.length} fields)
                </p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filteredDatabaseFields.map((field) => {
                  const isRequired = isRequiredField(field);
                  const isMapped = isFieldMapped(field);
                  const isSelectedMapping =
                    selectedColumn && columnMappings[selectedColumn] === field;

                  // Find which CSV column is mapped to this field
                  const mappedFromColumn = Object.entries(columnMappings).find(
                    ([csvCol, dbField]) => dbField === field,
                  )?.[0];

                  return (
                    <div
                      key={field}
                      className={`flex items-center justify-between p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${isSelectedMapping ? "bg-blue-500/10" : ""}`}
                      onClick={() =>
                        selectedColumn && updateMapping(selectedColumn, field)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{field}</div>
                          {isRequired && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Info className="h-3 w-3" /> Required field
                            </div>
                          )}
                          {mappedFromColumn && (
                            <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> Mapped from{" "}
                              <span className="font-medium">
                                {mappedFromColumn}
                              </span>
                              {sampleData[mappedFromColumn] &&
                                sampleData[mappedFromColumn].length > 0 && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    ({sampleData[mappedFromColumn][0]})
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRequired && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-200"
                          >
                            Required
                          </Badge>
                        )}
                        {isMapped && !isSelectedMapping && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 border-amber-200"
                          >
                            Already Mapped
                          </Badge>
                        )}
                        {isSelectedMapping && (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-200"
                          >
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {!allRequiredFieldsMapped && (
            <div className="flex items-center gap-2 mt-6 p-3 bg-amber-500/10 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">
                  Required fields not mapped
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please map all required fields before continuing:
                  {requiredFields
                    .filter((field) => !isFieldMapped(field))
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!allRequiredFieldsMapped}
            className="flex items-center gap-2"
          >
            Continue to Preview
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ColumnMapper;
