import React from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  details?: string;
  severity?: "error" | "warning" | "info";
  onClose?: () => void;
  onRetry?: () => void;
  recoveryOptions?: Array<{
    label: string;
    action: () => void;
  }>;
}

const ErrorDisplay = ({
  title = "An error occurred",
  message = "Something went wrong. Please try again or contact support if the problem persists.",
  details = "",
  severity = "error",
  onClose = () => {},
  onRetry = () => {},
  recoveryOptions = [
    { label: "Try Again", action: () => {} },
    { label: "Go Back", action: () => {} },
  ],
}: ErrorDisplayProps) => {
  const getIcon = () => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-6 w-6 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-destructive" />;
    }
  };

  const getSeverityClass = () => {
    switch (severity) {
      case "error":
        return "border-destructive bg-destructive/10";
      case "warning":
        return "border-amber-500 bg-amber-500/10";
      case "info":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "border-destructive bg-destructive/10";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background">
      <Card className={`border-2 ${getSeverityClass()}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle>{title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <AlertDescription className="text-base">{message}</AlertDescription>
          {details && (
            <Alert className="mt-4 bg-background">
              <AlertTitle>Technical Details</AlertTitle>
              <AlertDescription className="mt-2 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-32">
                {details}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {recoveryOptions.map((option, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              onClick={option.action}
            >
              {option.label}
            </Button>
          ))}
          {onRetry && (
            <Button variant="default" onClick={onRetry}>
              Retry
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
