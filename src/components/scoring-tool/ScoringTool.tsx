import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlayCircle, Save, FileDown, Settings } from "lucide-react";

import ConfigurationSelector from "./ConfigurationSelector";
import RuleBuilder from "./RuleBuilder";
import ScoringProgress from "./ScoringProgress";
import ResultsViewer from "./ResultsViewer";
import ExportOptions from "./ExportOptions";

interface ScoringToolProps {
  onSaveConfiguration?: (config: any) => void;
  onRunScoring?: (configId: string) => void;
  onExportResults?: (format: string, options: any) => void;
}

const ScoringTool = ({
  onSaveConfiguration = () => {},
  onRunScoring = () => {},
  onExportResults = () => {},
}: ScoringToolProps) => {
  const [activeTab, setActiveTab] = useState("configure");
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [scoringRules, setScoringRules] = useState<any[]>([]);
  const [scoringStatus, setScoringStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [processedRecords, setProcessedRecords] = useState(0);
  const [totalRecords, setTotalRecords] = useState(1000);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [configName, setConfigName] = useState("New Scoring Configuration");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Run the actual scoring process using the scoring engine
  const runScoringProcess = async () => {
    setScoringStatus("processing");
    setProcessedRecords(0);

    try {
      // Import the scoring engine
      const { scoreAllProperties } = await import("@/lib/scoringEngine");

      // Run the scoring process with progress updates
      await scoreAllProperties(selectedConfigId, (processed, total) => {
        setProcessedRecords(processed);
        setTotalRecords(total);
        setUploadProgress(Math.round((processed / total) * 100));

        if (processed >= total) {
          setScoringStatus("completed");
        }
      });
    } catch (error) {
      console.error("Error running scoring process:", error);
      setScoringStatus("error");
    }
  };

  const handleConfigurationSelect = (configId: string) => {
    setSelectedConfigId(configId);
    // In a real app, you would fetch the rules for this configuration
    setScoringRules([
      {
        id: "1",
        field: "Property Type",
        operator: "equals",
        value: "Residential",
        score: 8,
      },
    ]);
  };

  const handleSaveRules = async (rules: any[]) => {
    setScoringRules(rules);

    try {
      // Import the supabase client
      const { supabase } = await import("@/lib/supabase");

      // Save the configuration if it doesn't exist
      if (selectedConfigId) {
        const { error: configError } = await supabase
          .from("scoring_configurations")
          .upsert({
            id: selectedConfigId,
            name: configName || "New Scoring Configuration",
            description: "Created from the Scoring Tool",
          });

        if (configError) {
          console.error("Error saving configuration:", configError);
          return;
        }

        // Delete existing rules for this configuration
        await supabase
          .from("scoring_rules")
          .delete()
          .eq("configuration_id", selectedConfigId);

        // Save the new rules
        const rulesWithConfig = rules.map((rule) => ({
          configuration_id: selectedConfigId,
          rule_name: `Rule for ${rule.field}`,
          rule_type: rule.field.toLowerCase().includes("tag")
            ? "tag"
            : rule.field.toLowerCase().includes("list")
              ? "list"
              : "field",
          field_name: rule.field,
          operator: rule.operator,
          value: rule.value,
          score: rule.score,
        }));

        const { error: rulesError } = await supabase
          .from("scoring_rules")
          .insert(rulesWithConfig);

        if (rulesError) {
          console.error("Error saving rules:", rulesError);
          return;
        }
      }

      onSaveConfiguration({ id: selectedConfigId, rules });
      setActiveTab("run");
    } catch (error) {
      console.error("Error in handleSaveRules:", error);
    }
  };

  const handleRunScoring = () => {
    if (selectedConfigId) {
      onRunScoring(selectedConfigId);
      runScoringProcess();
      setActiveTab("progress");
    }
  };

  const handleScoringComplete = () => {
    setActiveTab("results");
  };

  const handleExport = (format: string, options: any) => {
    onExportResults(format, options);
  };

  return (
    <div className="w-full min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Scoring Tool</h1>
          <div className="flex items-center gap-2">
            {activeTab === "results" && (
              <Button
                variant="outline"
                onClick={() => setShowExportOptions(true)}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            )}
            <Button variant="outline" onClick={() => setActiveTab("configure")}>
              <Settings className="mr-2 h-4 w-4" />
              Configuration
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="run">Run Scoring</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Configuration</CardTitle>
                <CardDescription>
                  Select an existing configuration or create a new one to define
                  how properties should be scored.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationSelector
                  onSelectConfiguration={handleConfigurationSelect}
                  onCreateConfiguration={(config) =>
                    setSelectedConfigId(config.id)
                  }
                />
              </CardContent>
            </Card>

            {selectedConfigId && (
              <Card>
                <CardHeader>
                  <CardTitle>Rule Builder</CardTitle>
                  <CardDescription>
                    Define the rules that determine how properties are scored
                    based on their attributes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RuleBuilder
                    onSave={handleSaveRules}
                    existingRules={scoringRules}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="run" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Run Scoring Process</CardTitle>
                <CardDescription>
                  Apply your scoring configuration to the database records.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedConfigId ? (
                  <div className="space-y-6">
                    <div className="p-4 border rounded-md bg-muted/50">
                      <h3 className="font-medium mb-2">
                        Selected Configuration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You are about to run scoring with the configuration:
                        <span className="font-medium text-foreground">
                          {" "}
                          {selectedConfigId}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This will process approximately{" "}
                        {totalRecords.toLocaleString()} records in the database.
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button size="lg" onClick={handleRunScoring}>
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Start Scoring Process
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Please select or create a configuration first.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("configure")}
                    >
                      Go to Configuration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Progress</CardTitle>
                <CardDescription>
                  Monitor the progress of the scoring process in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScoringProgress
                  totalRecords={totalRecords}
                  processedRecords={processedRecords}
                  status={scoringStatus}
                  errorCount={Math.floor(Math.random() * 10)}
                  statusMessage={
                    scoringStatus === "completed"
                      ? "Scoring process completed successfully!"
                      : scoringStatus === "processing"
                        ? "Processing records..."
                        : "Ready to start scoring process"
                  }
                  onComplete={handleScoringComplete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Results</CardTitle>
                <CardDescription>
                  View, filter, and export the results of your scoring process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsViewer
                  onExport={(format) => setShowExportOptions(true)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ExportOptions
          isOpen={showExportOptions}
          onOpenChange={setShowExportOptions}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default ScoringTool;
