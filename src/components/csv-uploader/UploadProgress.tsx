import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

interface UploadProgressProps {
  progress?: number;
  status?: "idle" | "processing" | "completed" | "error";
  totalRecords?: number;
  processedRecords?: number;
  errorCount?: number;
  statusMessage?: string;
  errors?: Array<{ message: string; row?: number }>;
}

const UploadProgress = ({
  progress = 0,
  status = "idle",
  totalRecords = 1000,
  processedRecords = 0,
  errorCount = 0,
  statusMessage = "Ready to process upload",
  errors = [],
}: UploadProgressProps) => {
  const [displayProgress, setDisplayProgress] = useState(progress);

  // Animate progress for smoother visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Upload Progress</CardTitle>
          <Badge variant="outline" className={`${getStatusColor()} text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(displayProgress)}%</span>
            </div>
            <Progress value={displayProgress} className="h-2" />
          </div>

          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className="font-medium">{statusMessage}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold">
                {totalRecords.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Records</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold">
                {processedRecords.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Processed</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-red-500">
                {errorCount}
              </div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>

          {errors && errors.length > 0 && (
            <div className="mt-4 max-h-32 overflow-y-auto rounded-md bg-red-500/10 p-3">
              <h4 className="mb-2 font-medium text-red-500">Error Details</h4>
              <ul className="space-y-1 text-sm">
                {errors.map((error, index) => (
                  <li key={index} className="text-muted-foreground">
                    {error.row ? `Row ${error.row}: ` : ""}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadProgress;
