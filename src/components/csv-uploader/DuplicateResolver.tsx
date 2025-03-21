import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface DuplicateRecord {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lastUpdated: string;
  conflictFields: string[];
}

interface DuplicateResolverProps {
  duplicates?: DuplicateRecord[];
  onResolve?: (strategy: string, duplicateIds: string[]) => void;
  onCancel?: () => void;
  isOpen?: boolean;
  mappedData?: Record<string, any[]>;
  mappedColumns?: Record<string, string>;
}

const DuplicateResolver = ({
  duplicates: propDuplicates,
  onResolve = () => {},
  onCancel = () => {},
  isOpen = true,
  mappedData = {},
  mappedColumns = {},
}: DuplicateResolverProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState("skip");
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([]);

  // Generate duplicates from the mapped data if not provided directly
  useEffect(() => {
    if (propDuplicates && propDuplicates.length > 0) {
      setDuplicates(propDuplicates);
      return;
    }

    // Generate duplicates from the mapped data
    if (
      Object.keys(mappedData).length > 0 &&
      Object.keys(mappedColumns).length > 0
    ) {
      const generatedDuplicates: DuplicateRecord[] = [];

      // Find address, city, state, and zip columns from mappings
      const addressKey = Object.entries(mappedColumns).find(
        ([_, value]) => value.includes("address") || value.includes("street"),
      )?.[0];

      const cityKey = Object.entries(mappedColumns).find(([_, value]) =>
        value.includes("city"),
      )?.[0];

      const stateKey = Object.entries(mappedColumns).find(([_, value]) =>
        value.includes("state"),
      )?.[0];

      const zipKey = Object.entries(mappedColumns).find(([_, value]) =>
        value.includes("zip"),
      )?.[0];

      // Generate sample duplicates (in a real app, these would come from DB comparison)
      // For demo, we'll create duplicates for ~10% of the first 30 records
      const sampleSize = Math.min(
        30,
        mappedData[Object.keys(mappedData)[0]]?.length || 0,
      );

      for (let i = 0; i < sampleSize; i++) {
        // Only make ~10% of records duplicates
        if (i % 10 === 0) {
          const conflictFields = [];

          // Randomly select 1-3 fields that have conflicts
          const possibleConflicts = [
            "price",
            "bedrooms",
            "bathrooms",
            "sqft",
            "status",
          ];
          const numConflicts = Math.floor(Math.random() * 3) + 1;

          for (let j = 0; j < numConflicts; j++) {
            const randomIndex = Math.floor(
              Math.random() * possibleConflicts.length,
            );
            conflictFields.push(possibleConflicts[randomIndex]);
            possibleConflicts.splice(randomIndex, 1);
            if (possibleConflicts.length === 0) break;
          }

          generatedDuplicates.push({
            id: `dup-${i}`,
            address: addressKey
              ? mappedData[addressKey][i] || `${123 + i} Main St`
              : `${123 + i} Main St`,
            city: cityKey ? mappedData[cityKey][i] || "New York" : "New York",
            state: stateKey ? mappedData[stateKey][i] || "NY" : "NY",
            zipCode: zipKey ? mappedData[zipKey][i] || "10001" : "10001",
            lastUpdated: new Date(Date.now() - Math.random() * 10000000000)
              .toISOString()
              .split("T")[0],
            conflictFields: conflictFields,
          });
        }
      }

      // If we didn't generate any duplicates, add at least one for demo purposes
      if (generatedDuplicates.length === 0) {
        generatedDuplicates.push({
          id: "demo-1",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          lastUpdated: "2023-05-15",
          conflictFields: ["price", "status"],
        });
      }

      setDuplicates(generatedDuplicates);
    } else {
      // Fallback to demo data if no mapped data is available
      setDuplicates([
        {
          id: "1",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          lastUpdated: "2023-05-15",
          conflictFields: ["price", "status"],
        },
        {
          id: "2",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
          lastUpdated: "2023-06-20",
          conflictFields: ["bedrooms", "bathrooms"],
        },
        {
          id: "3",
          address: "789 Pine Rd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          lastUpdated: "2023-07-10",
          conflictFields: ["price", "squareFeet"],
        },
      ]);
    }
  }, [propDuplicates, mappedData, mappedColumns]);

  const handleStrategyChange = (value: string) => {
    setSelectedStrategy(value);
  };

  const handleDuplicateToggle = (id: string) => {
    setSelectedDuplicates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedDuplicates.length === duplicates.length) {
      setSelectedDuplicates([]);
    } else {
      setSelectedDuplicates(duplicates.map((d) => d.id));
    }
  };

  const handleResolve = () => {
    onResolve(
      selectedStrategy,
      selectedDuplicates.length > 0
        ? selectedDuplicates
        : duplicates.map((d) => d.id),
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Duplicate Records Detected
          </DialogTitle>
          <DialogDescription>
            {duplicates.length} potential duplicate records were found. Please
            select how you want to handle these records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium mb-3">Resolution Strategy</h3>
            <RadioGroup
              value={selectedStrategy}
              onValueChange={handleStrategyChange}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="skip" id="skip" className="mt-1" />
                <div className="space-y-1">
                  <label
                    htmlFor="skip"
                    className="font-medium flex items-center cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Skip Duplicates
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Don't import records that match existing database entries.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="update" id="update" className="mt-1" />
                <div className="space-y-1">
                  <label
                    htmlFor="update"
                    className="font-medium flex items-center cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                    Update Existing Records
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Replace existing database entries with the new data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="create" id="create" className="mt-1" />
                <div className="space-y-1">
                  <label
                    htmlFor="create"
                    className="font-medium flex items-center cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Create New Records
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Import as new records, even if they appear to be duplicates.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Duplicate Records</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedDuplicates.length === duplicates.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Zip Code</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Conflicts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duplicates.map((duplicate) => (
                    <TableRow key={duplicate.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedDuplicates.includes(duplicate.id)}
                          onChange={() => handleDuplicateToggle(duplicate.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </TableCell>
                      <TableCell>{duplicate.address}</TableCell>
                      <TableCell>{duplicate.city}</TableCell>
                      <TableCell>{duplicate.state}</TableCell>
                      <TableCell>{duplicate.zipCode}</TableCell>
                      <TableCell>{duplicate.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {duplicate.conflictFields.map((field) => (
                            <span
                              key={field}
                              className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleResolve}>Apply Resolution</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateResolver;
