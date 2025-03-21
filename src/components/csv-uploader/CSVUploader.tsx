import React, { useState, useEffect } from "react";
import { parseCSV } from "./CSVParser";
import { preprocessCsvFile } from "@/lib/csvPreprocessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import FileUpload from "./FileUpload";
import ColumnMapper from "./ColumnMapper";
import DataPreview from "./DataPreview";
import DuplicateResolver from "./DuplicateResolver";
import UploadProgress from "./UploadProgress";
import UploadSummary from "./UploadSummary";

type UploadStep =
  | "upload"
  | "map"
  | "preview"
  | "duplicates"
  | "progress"
  | "summary";

interface CSVUploaderProps {
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

const CSVUploader = ({
  onComplete = () => {},
  onCancel = () => {},
}: CSVUploaderProps) => {
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {},
  );
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [uploadErrors, setUploadErrors] = useState<
    Array<{ message: string; row?: number }>
  >([]);

  // State to hold the actual parsed CSV data
  const [csvData, setCsvData] = useState<{
    columns: string[];
    sampleData: Record<string, string[]>;
    data?: Record<string, string[]>;
  }>({
    columns: [],
    sampleData: {},
  });

  // State to track the total number of rows in the CSV
  const [totalRows, setTotalRows] = useState(0);

  // State to track detected duplicates
  const [detectedDuplicates, setDetectedDuplicates] = useState([]);

  const mockDatabaseFields = [
    "first_name",
    "last_name",
    "mailing_address",
    "mailing_city",
    "mailing_state",
    "mailing_zip",
    "mailing_zip5",
    "mailing_county",
    "mailing_vacant",
    "property_address",
    "property_city",
    "property_state",
    "property_zip",
    "property_zip5",
    "property_county",
    "property_vacant",
    "business_name",
    "status",
    "lists",
    "tags",
    "email_1",
    "email_2",
    "email_3",
    "email_4",
    "email_5",
    "email_6",
    "email_7",
    "email_8",
    "email_9",
    "email_10",
    "phone_1",
    "phone_type_1",
    "phone_status_1",
    "phone_tags_1",
    "phone_2",
    "phone_type_2",
    "phone_status_2",
    "phone_tags_2",
    "phone_3",
    "phone_type_3",
    "phone_status_3",
    "phone_tags_3",
    "phone_4",
    "phone_type_4",
    "phone_status_4",
    "phone_tags_4",
    "phone_5",
    "phone_type_5",
    "phone_status_5",
    "phone_tags_5",

    "bedrooms",
    "bathrooms",
    "sqft",
    "air_conditioner",
    "heating_type",
    "storeys",
    "year",
    "above_grade",
    "rental_value",
    "building_use_code",
    "neighborhood_rating",
    "structure_type",
    "number_of_units",
    "apn",
    "parcel_id",
    "legal_description",
    "lot_size",
    "land_zoning",
    "tax_auction_date",
    "total_taxes",
    "tax_delinquent_value",
    "tax_delinquent_year",
    "year_behind_on_taxes",
    "deed",
    "mls",
    "last_sale_price",
    "last_sold",
    "lien_type",
    "lien_recording_date",
    "personal_representative",
    "personal_representative_phone",
    "probate_open_date",
    "attorney_on_file",
    "foreclosure_date",
    "bankruptcy_recording_date",
    "divorce_file_date",
    "loan_to_value",
    "open_mortgages",
    "mortgage_type",
    "owned_since",
    "estimated_value",
  ];

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Start the upload progress animation
      simulateFileUpload();

      // Preprocess the CSV file to properly handle tag fields
      const processedFile = await preprocessCsvFile(file);

      // Parse the preprocessed CSV file
      const result = await parseCSV(processedFile);

      // Update the state with the actual CSV data
      setCsvData({
        columns: result.columns,
        sampleData: result.sampleData,
        data: result.data,
      });

      // Set the total rows for display
      setTotalRows(result.totalRows);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadErrors([
        { message: `Failed to process CSV file: ${error.message}` },
      ]);
      setIsUploading(false);
    }
  };

  const simulateFileUpload = () => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleContinueToMapping = () => {
    setCurrentStep("map");
  };

  const handleMappingComplete = (mappings: Record<string, string>) => {
    setColumnMappings(mappings);
    setCurrentStep("preview");
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  const handlePreviewContinue = () => {
    // In a real app, we would check for duplicates here by comparing with database
    // For demo purposes, we'll just show the duplicate resolver with generated data
    setShowDuplicates(true);
    setCurrentStep("duplicates");

    // In a real implementation, we would detect duplicates here by comparing with database
    // For now, we'll let the DuplicateResolver component generate sample duplicates
  };

  const handleDuplicateResolution = (
    strategy: string,
    duplicateIds: string[],
  ) => {
    console.log(
      `Applying resolution strategy: ${strategy} to ${duplicateIds.length} records`,
    );
    setShowDuplicates(false);
    setCurrentStep("progress");
    processAndUploadData();
  };

  const simulateProcessing = () => {
    setUploadStatus("processing");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("completed");
        setCurrentStep("summary");
        return;
      }
      setUploadProgress(progress);
    }, 500);
  };

  const processAndUploadData = async () => {
    // Validate the database schema first
    try {
      setUploadStatus("processing");
      setUploadProgress(0);
      setUploadErrors([]);

      // Import necessary functions
      const { supabase } = await import("@/lib/supabase");
      const { transformData, processInChunks } = await import(
        "@/lib/dataTransformer"
      );

      // Generate a unique batch ID for this import
      const newBatchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setBatchId(newBatchId);

      // Transform the data based on column mappings
      // Use the full data instead of just the sample data
      // Check if csvData.data exists before using it
      if (!csvData.data) {
        throw new Error("CSV data is undefined or null");
      }
      const transformedData = transformData(
        csvData.data,
        columnMappings,
        newBatchId,
      );

      // Process in chunks to avoid memory issues with large datasets
      const CHUNK_SIZE = 250; // Increased chunk size for better performance
      let processedCount = 0;

      await processInChunks(transformedData, CHUNK_SIZE, async (chunk) => {
        const { data, error } = await supabase
          .from("properties")
          .insert(chunk)
          .select();

        if (error) {
          throw new Error(`Error inserting data: ${error.message}`);
        }

        processedCount += chunk.length;
        const newProgress = (processedCount / transformedData.length) * 100;
        setUploadProgress(newProgress);
        setProcessedRecords(processedCount);

        return data || [];
      });

      // Complete the upload
      setUploadStatus("completed");
      setUploadProgress(100);
      setSuccessCount(processedCount);
      setCurrentStep("summary");
    } catch (error) {
      console.error("Error uploading data:", error);
      setUploadStatus("error");
      setUploadErrors([{ message: `Failed to upload data: ${error.message}` }]);
    }
  };

  const handleRetry = () => {
    setCurrentStep("upload");
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setColumnMappings({});
    setShowDuplicates(false);
    setUploadStatus("idle");
    setUploadErrors([]);
  };

  const [batchId, setBatchId] = useState<string>("");
  const [successCount, setSuccessCount] = useState<number>(0);

  const handleFinish = () => {
    onComplete({
      file: selectedFile,
      mappings: columnMappings,
      status: "completed",
      batchId: batchId,
      successCount: successCount,
      errorCount: uploadErrors.length,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <div className="space-y-6">
            <FileUpload
              onFileSelected={handleFileSelected}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
            {selectedFile && !isUploading && (
              <div className="flex justify-end">
                <Button onClick={handleContinueToMapping}>
                  Continue to Mapping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      case "map":
        return (
          <div className="space-y-6">
            <ColumnMapper
              csvColumns={csvData.columns}
              databaseFields={mockDatabaseFields}
              onMappingComplete={handleMappingComplete}
              onBack={handleBackToUpload}
              fileName={selectedFile?.name || "property_data.csv"}
              totalRows={totalRows}
              sampleData={csvData.sampleData}
            />
          </div>
        );
      case "preview":
        return (
          <div className="space-y-6">
            <DataPreview
              data={csvData.sampleData}
              mappedColumns={columnMappings}
              onContinue={handlePreviewContinue}
              onBack={() => setCurrentStep("map")}
              fileName={selectedFile?.name || "property_data.csv"}
              totalRows={totalRows}
            />
          </div>
        );
      case "duplicates":
        return (
          <DuplicateResolver
            isOpen={showDuplicates}
            onResolve={handleDuplicateResolution}
            onCancel={() => {
              setShowDuplicates(false);
              setCurrentStep("preview");
            }}
            mappedData={csvData.sampleData}
            mappedColumns={columnMappings}
          />
        );
      case "progress":
        return (
          <div className="space-y-6">
            <UploadProgress
              progress={uploadProgress}
              status={uploadStatus}
              totalRecords={totalRows}
              processedRecords={processedRecords}
              errorCount={uploadErrors.length}
              statusMessage={`Processing records... ${Math.floor(uploadProgress)}%`}
              errors={uploadErrors}
            />
          </div>
        );
      case "summary":
        return (
          <div className="space-y-6">
            <UploadSummary
              onRetry={handleRetry}
              onFinish={handleFinish}
              totalRecords={totalRows}
              successCount={successCount}
              errorCount={uploadErrors.length}
              batchId={batchId}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-background p-6 rounded-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">CSV Uploader</h1>
        <p className="text-muted-foreground">
          Upload, map, and process your real estate data CSV files
        </p>
      </div>

      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger
            value="upload"
            disabled={currentStep !== "upload"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              1
            </span>
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger
            value="map"
            disabled={currentStep !== "map"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              2
            </span>
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            disabled={currentStep !== "preview"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              3
            </span>
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
          <TabsTrigger
            value="duplicates"
            disabled={currentStep !== "duplicates"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              4
            </span>
            <span className="hidden sm:inline">Duplicates</span>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            disabled={currentStep !== "progress"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              5
            </span>
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            disabled={currentStep !== "summary"}
            className="flex items-center gap-2"
          >
            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
              6
            </span>
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">{renderStepContent()}</div>
      </Tabs>

      {currentStep !== "upload" &&
        currentStep !== "summary" &&
        currentStep !== "duplicates" && (
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === "map") setCurrentStep("upload");
                if (currentStep === "preview") setCurrentStep("map");
                if (currentStep === "progress") setCurrentStep("preview");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
    </div>
  );
};

export default CSVUploader;
