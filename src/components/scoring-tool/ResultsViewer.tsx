import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ScoredResult {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  score: number;
  tags: string[];
  lastUpdated: string;
}

interface ResultsViewerProps {
  results?: ScoredResult[];
  onExport?: (format: string) => void;
  onFilter?: (filters: any) => void;
  configurationId?: string;
}

const ResultsViewer = ({
  results = [
    {
      id: "1",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      score: 87,
      tags: ["High Value", "Commercial"],
      lastUpdated: "2023-06-15",
    },
    {
      id: "2",
      address: "456 Oak Ave",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      score: 92,
      tags: ["Residential", "New Construction"],
      lastUpdated: "2023-06-14",
    },
    {
      id: "3",
      address: "789 Pine Blvd",
      city: "Houston",
      state: "TX",
      zipCode: "77002",
      score: 65,
      tags: ["Commercial", "Renovation Needed"],
      lastUpdated: "2023-06-13",
    },
    {
      id: "4",
      address: "101 Cedar Ln",
      city: "San Antonio",
      state: "TX",
      zipCode: "78205",
      score: 78,
      tags: ["Residential", "Investment"],
      lastUpdated: "2023-06-12",
    },
    {
      id: "5",
      address: "202 Maple Dr",
      city: "Austin",
      state: "TX",
      zipCode: "78704",
      score: 95,
      tags: ["High Value", "Residential", "Prime Location"],
      lastUpdated: "2023-06-11",
    },
  ],
  onExport = (format) => console.log(`Exporting in ${format} format`),
  onFilter = (filters) => console.log("Filtering with:", filters),
  configurationId,
}: ResultsViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ScoredResult>("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [scoredResults, setScoredResults] = useState<ScoredResult[]>(results);
  const [isLoading, setIsLoading] = useState(false);

  // Load real results from the database if configurationId is provided
  useEffect(() => {
    if (configurationId) {
      const loadScoredResults = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("property_scores")
            .select(
              `
              property_id,
              score,
              details,
              properties!inner(id, address, city, state, zip_code, updated_at)
            `,
            )
            .eq("configuration_id", configurationId)
            .order("score", { ascending: false });

          if (error) {
            console.error("Error loading scored results:", error);
            return;
          }

          if (data) {
            // Get tags for each property
            const propertiesWithTags = await Promise.all(
              data.map(async (item) => {
                const { data: tagData } = await supabase
                  .from("property_tags")
                  .select("tag_id(name)")
                  .eq("property_id", item.property_id);

                const tags = tagData ? tagData.map((t) => t.tag_id.name) : [];

                return {
                  id: item.property_id,
                  address: item.properties.address || "",
                  city: item.properties.city || "",
                  state: item.properties.state || "",
                  zipCode: item.properties.zip_code || "",
                  score: item.score,
                  tags,
                  lastUpdated: new Date(
                    item.properties.updated_at,
                  ).toLocaleDateString(),
                };
              }),
            );

            setScoredResults(propertiesWithTags);
          }
        } catch (error) {
          console.error("Error in loadScoredResults:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadScoredResults();
    } else {
      setScoredResults(results);
    }
  }, [configurationId]);

  // Filter results based on search term
  const filteredResults = scoredResults.filter(
    (result) =>
      (result.address &&
        result.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.city &&
        result.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.state &&
        result.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.zipCode && result.zipCode.includes(searchTerm)) ||
      (Array.isArray(result.tags) &&
        result.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        )),
  );

  // Sort results based on sort field and direction
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortField === "score") {
      return sortDirection === "asc" ? a.score - b.score : b.score - a.score;
    } else {
      const aValue = String(a[sortField] || "").toLowerCase();
      const bValue = String(b[sortField] || "").toLowerCase();
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  // Handle sort toggle
  const handleSort = (field: keyof ScoredResult) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render score with color based on value
  const renderScore = (score: number) => {
    let colorClass = "";
    if (score >= 90) colorClass = "text-green-500";
    else if (score >= 70) colorClass = "text-yellow-500";
    else colorClass = "text-red-500";

    return <span className={colorClass}>{score}</span>;
  };

  return (
    <div className="w-full p-4 bg-background rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Scored Results</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => onFilter({ type: "highScore" })}>
                High Scores (90+)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilter({ type: "mediumScore" })}
              >
                Medium Scores (70-89)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter({ type: "lowScore" })}>
                Low Scores (&lt;70)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onFilter({ type: "residential" })}
              >
                Residential Properties
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilter({ type: "commercial" })}
              >
                Commercial Properties
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilter({ type: "reset" })}>
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFilter({ advanced: true })}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableCaption>
              Total: {sortedResults.length} properties
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  Address
                  {sortField === "address" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("city")}
                >
                  City
                  {sortField === "city" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("state")}
                >
                  State
                  {sortField === "state" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("zipCode")}
                >
                  Zip Code
                  {sortField === "zipCode" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("score")}
                >
                  Score
                  {sortField === "score" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead>Tags</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("lastUpdated")}
                >
                  Last Updated
                  {sortField === "lastUpdated" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.length > 0 ? (
                sortedResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.address}
                    </TableCell>
                    <TableCell>{result.city}</TableCell>
                    <TableCell>{result.state}</TableCell>
                    <TableCell>{result.zipCode}</TableCell>
                    <TableCell className="text-right">
                      {renderScore(result.score)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {result.tags &&
                          result.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>{result.lastUpdated}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No results found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ResultsViewer;
