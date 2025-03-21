import React, { useState, useCallback } from "react";
import { Upload, FileUp, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";

interface FileUploadProps {
  onFileSelected?: (file: File) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

const FileUpload = ({
  onFileSelected = () => {},
  maxFileSize = 100, // Default 100MB
  acceptedFileTypes = [".csv"],
  isUploading = false,
  uploadProgress = 0,
  error = "",
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileAnalysis, setFileAnalysis] = useState<{
    rows: number;
    columns: number;
    size: string;
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      setFileError(`Invalid file type. Please upload a CSV file.`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setFileError(`File size exceeds the maximum limit of ${maxFileSize}MB.`);
      return false;
    }

    setFileError("");
    return true;
  };

  const analyzeFile = (file: File) => {
    // In a real implementation, you would actually read and analyze the CSV
    // This is a mock implementation
    const estimatedRows = Math.floor(file.size / 100); // Rough estimate
    const estimatedColumns = 15; // Mock value

    setFileAnalysis({
      rows: estimatedRows,
      columns: estimatedColumns,
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    });

    // In a real app, we would parse the CSV file here and extract the actual data
    // For demo purposes, we're using mock data in the parent component
  };

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
          setFile(droppedFile);
          analyzeFile(droppedFile);
          onFileSelected(droppedFile);
        }
      }
    },
    [onFileSelected],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
          setFile(selectedFile);
          analyzeFile(selectedFile);
          onFileSelected(selectedFile);
        }
      }
    },
    [onFileSelected],
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setFileAnalysis(null);
  }, []);

  return (
    <div className="w-full bg-background p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

      {!file && !isUploading ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium mb-2">
            Drag & Drop your CSV file here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click the button below to browse files
          </p>
          <div className="flex flex-col items-center">
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <FileUp className="mr-2 h-4 w-4" /> Browse Files
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Maximum file size: {maxFileSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          {file && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <FileUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {fileAnalysis?.size} • {fileAnalysis?.rows.toLocaleString()}{" "}
                    rows • {fileAnalysis?.columns} columns
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Analyzing file structure and preparing for mapping...
              </p>
            </div>
          )}
        </div>
      )}

      {(fileError || error) && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">
              {fileError || error}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your file and try again.
            </p>
          </div>
        </div>
      )}

      {file && !isUploading && !fileError && !error && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-md flex items-start">
          <CheckCircle2 className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-success">
              File ready for processing
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Continue" to proceed to column mapping.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
