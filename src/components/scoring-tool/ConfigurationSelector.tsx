import React, { useState } from "react";
import { PlusCircle, Save, FileText, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ConfigurationSelectorProps {
  onSelectConfiguration?: (configId: string) => void;
  onCreateConfiguration?: (config: ScoringConfiguration) => void;
  savedConfigurations?: ScoringConfiguration[];
}

interface ScoringConfiguration {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
}

const ConfigurationSelector = ({
  onSelectConfiguration = () => {},
  onCreateConfiguration = () => {},
  savedConfigurations = [
    {
      id: "config-1",
      name: "Residential Properties",
      description:
        "Scoring configuration for residential properties based on location and amenities",
      createdAt: "2023-10-15",
      lastModified: "2023-11-02",
    },
    {
      id: "config-2",
      name: "Commercial Properties",
      description:
        "Scoring for commercial real estate with focus on ROI metrics",
      createdAt: "2023-09-20",
      lastModified: "2023-10-25",
    },
    {
      id: "config-3",
      name: "Investment Portfolio",
      description:
        "Configuration for evaluating investment potential across mixed property types",
      createdAt: "2023-11-01",
      lastModified: "2023-11-01",
    },
  ],
}: ConfigurationSelectorProps) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigDescription, setNewConfigDescription] = useState("");
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleCreateConfiguration = () => {
    const newConfig: ScoringConfiguration = {
      id: `config-${Date.now()}`,
      name: newConfigName,
      description: newConfigDescription,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    };
    onCreateConfiguration(newConfig);
    setNewConfigName("");
    setNewConfigDescription("");
    setDialogOpen(false);
  };

  const handleSelectConfiguration = (configId: string) => {
    setSelectedConfigId(configId);
    onSelectConfiguration(configId);
    setDialogOpen(false);
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Scoring Configuration</h2>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Settings className="mr-2 h-4 w-4" />
            Select Configuration
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scoring Configuration</DialogTitle>
            <DialogDescription>
              Create a new scoring configuration or select an existing one to
              apply to your data.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="existing"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">
                Existing Configurations
              </TabsTrigger>
              <TabsTrigger value="new">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4 mt-4">
              {savedConfigurations.length > 0 ? (
                <div className="grid gap-4">
                  {savedConfigurations.map((config) => (
                    <Card
                      key={config.id}
                      className={`cursor-pointer transition-all ${selectedConfigId === config.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedConfigId(config.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{config.name}</CardTitle>
                          <div className="text-xs text-muted-foreground">
                            Last modified: {config.lastModified}
                          </div>
                        </div>
                        <CardDescription className="mt-1">
                          {config.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">
                    No saved configurations found
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Configuration Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter configuration name"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    placeholder="Enter a description for this configuration"
                    value={newConfigDescription}
                    onChange={(e) => setNewConfigDescription(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            {activeTab === "existing" ? (
              <Button
                onClick={() =>
                  handleSelectConfiguration(
                    selectedConfigId || savedConfigurations[0].id,
                  )
                }
                disabled={!selectedConfigId && savedConfigurations.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Use Selected Configuration
              </Button>
            ) : (
              <Button
                onClick={handleCreateConfiguration}
                disabled={!newConfigName.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedConfigId && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Selected Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {savedConfigurations.find((c) => c.id === selectedConfigId)?.name ||
              "No configuration selected"}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Change Configuration
            </Button>
          </CardFooter>
        </Card>
      )}

      {!selectedConfigId && (
        <div className="mt-8 text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            No Configuration Selected
          </h3>
          <p className="mt-2 text-muted-foreground">
            Select an existing configuration or create a new one to get started
          </p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            Select Configuration
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConfigurationSelector;
