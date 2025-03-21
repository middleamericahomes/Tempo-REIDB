import React, { useState } from "react";
import { Download, FileType, FileText } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface ExportOptionsProps {
  onExport?: (format: string, options: ExportOptions) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ExportOptions {
  includeHeaders: boolean;
  includeScores: boolean;
  includeMetadata: boolean;
  selectedFields: string[];
}

const ExportOptions = ({
  onExport = () => {},
  isOpen = true,
  onOpenChange = () => {},
}: ExportOptionsProps) => {
  const [format, setFormat] = useState<string>("csv");
  const [options, setOptions] = useState<ExportOptions>({
    includeHeaders: true,
    includeScores: true,
    includeMetadata: false,
    selectedFields: ["address", "city", "state", "zip", "score"],
  });

  const handleExport = () => {
    onExport(format, options);
    onOpenChange(false);
  };

  const toggleOption = (option: keyof ExportOptions, value: boolean) => {
    setOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const availableFields = [
    "address",
    "city",
    "state",
    "zip",
    "score",
    "latitude",
    "longitude",
    "property_type",
    "bedrooms",
    "bathrooms",
    "square_feet",
    "year_built",
    "last_sale_date",
    "last_sale_price",
  ];

  const toggleField = (field: string) => {
    setOptions((prev) => {
      const isSelected = prev.selectedFields.includes(field);
      return {
        ...prev,
        selectedFields: isSelected
          ? prev.selectedFields.filter((f) => f !== field)
          : [...prev.selectedFields, field],
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-background">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
          <DialogDescription>
            Configure how you want to export your scored results
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="format" className="text-sm font-medium col-span-1">
              Format
            </label>
            <Select value={format} onValueChange={(value) => setFormat(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    CSV (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="xlsx">
                  <div className="flex items-center">
                    <FileType className="mr-2 h-4 w-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    JSON (.json)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Include Options</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHeaders"
                checked={options.includeHeaders}
                onCheckedChange={(checked) =>
                  toggleOption("includeHeaders", checked === true)
                }
              />
              <label
                htmlFor="includeHeaders"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Headers
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeScores"
                checked={options.includeScores}
                onCheckedChange={(checked) =>
                  toggleOption("includeScores", checked === true)
                }
              />
              <label
                htmlFor="includeScores"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Scores
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetadata"
                checked={options.includeMetadata}
                onCheckedChange={(checked) =>
                  toggleOption("includeMetadata", checked === true)
                }
              />
              <label
                htmlFor="includeMetadata"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Metadata
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Select Fields</h3>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={options.selectedFields.includes(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <label
                    htmlFor={`field-${field}`}
                    className={cn(
                      "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      options.selectedFields.includes(field)
                        ? "font-medium"
                        : "font-normal",
                    )}
                  >
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportOptions;
