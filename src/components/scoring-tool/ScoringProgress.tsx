import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ScoringProgressProps {
  totalRecords?: number;
  processedRecords?: number;
  status?: "idle" | "processing" | "completed" | "error";
  errorCount?: number;
  statusMessage?: string;
  onComplete?: () => void;
}

const ScoringProgress = ({
  totalRecords = 1000,
  processedRecords = 0,
  status = "idle",
  errorCount = 0,
  statusMessage = "Ready to start scoring process",
  onComplete,
}: ScoringProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (totalRecords > 0) {
      const calculatedProgress = Math.min(
        Math.round((processedRecords / totalRecords) * 100),
        100,
      );
      setProgress(calculatedProgress);

      if (calculatedProgress === 100 && status === "completed" && onComplete) {
        onComplete();
      }
    }
  }, [processedRecords, totalRecords, status, onComplete]);

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "processing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertCircle className="mr-1 h-3 w-3" /> Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <Clock className="mr-1 h-3 w-3" /> Idle
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full bg-card border-border shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Scoring Progress
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-primary/10 rounded-md p-2">
              <div className="text-2xl font-bold">{totalRecords}</div>
              <div className="text-xs text-muted-foreground">Total Records</div>
            </div>
            <div className="bg-primary/10 rounded-md p-2">
              <div className="text-2xl font-bold">{processedRecords}</div>
              <div className="text-xs text-muted-foreground">Processed</div>
            </div>
            <div className="bg-primary/10 rounded-md p-2">
              <div className="text-2xl font-bold">{errorCount}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground border-t pt-2">
            <p className="italic">{statusMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoringProgress;
