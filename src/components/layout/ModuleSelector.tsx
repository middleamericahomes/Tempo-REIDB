import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, BarChart2 } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ModuleCard = ({
  title = "Module Title",
  description = "Module description goes here. This explains what the module does.",
  icon = <FileUp className="h-10 w-10" />,
  onClick = () => {},
}: ModuleCardProps) => {
  return (
    <Card
      className="w-full max-w-md bg-card hover:bg-accent/10 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Open {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ModuleSelectorProps {
  onSelectModule?: (module: "csv-uploader" | "scoring-tool") => void;
}

const ModuleSelector = ({ onSelectModule = () => {} }: ModuleSelectorProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-background">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Select a Module</h2>
        <p className="text-muted-foreground mt-2">
          Choose which tool you'd like to work with
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ModuleCard
          title="CSV Uploader"
          description="Upload, map, and process CSV files with real estate data. Handles large files with intelligent column mapping and validation."
          icon={<FileUp className="h-10 w-10" />}
          onClick={() => onSelectModule("csv-uploader")}
        />

        <ModuleCard
          title="Scoring Tool"
          description="Create and apply scoring configurations based on tags and field values. Filter and export results based on your criteria."
          icon={<BarChart2 className="h-10 w-10" />}
          onClick={() => onSelectModule("scoring-tool")}
        />
      </div>
    </div>
  );
};

export default ModuleSelector;
