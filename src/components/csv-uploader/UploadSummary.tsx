import React from "react";
import { CheckCircle, AlertCircle, RefreshCw, Download } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

interface UploadSummaryProps {
  totalRecords?: number;
  successCount?: number;
  errorCount?: number;
  batchId?: string;
  onRetry?: () => void;
  onFinish?: () => void;
}

const UploadSummary = ({
  totalRecords = 1250,
  successCount = 1180,
  errorCount = 70,
  batchId = "batch_20240322_abc123",
  onRetry = () => console.log("Retry upload"),
  onFinish = () => console.log("Finish upload process"),
}: UploadSummaryProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Upload Complete
          </CardTitle>
          <CardDescription>
            Your CSV file has been processed. Here's a summary of the results.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Processing Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{totalRecords}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-green-500">
                {successCount}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-500">{errorCount}</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Batch ID:</span>
              <code className="text-xs bg-background px-2 py-1 rounded">
                {batchId}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use this ID to reference this upload batch in the future.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" /> Upload Another File
            </Button>
            <Button onClick={onFinish}>Finish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSummary;
