import React, { useState } from "react";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface RuleBuilderProps {
  onSave?: (rules: Rule[]) => void;
  existingRules?: Rule[];
  availableFields?: Field[];
}

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string | number;
  score: number;
}

interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date";
}

const defaultFields: Field[] = [
  { id: "1", name: "Property Type", type: "string" },
  { id: "2", name: "Square Footage", type: "number" },
  { id: "3", name: "Year Built", type: "number" },
  { id: "4", name: "Bedrooms", type: "number" },
  { id: "5", name: "Bathrooms", type: "number" },
  { id: "6", name: "Has Pool", type: "boolean" },
  { id: "7", name: "Neighborhood", type: "string" },
  { id: "8", name: "School District", type: "string" },
  { id: "9", name: "Last Sale Date", type: "date" },
  { id: "10", name: "Asking Price", type: "number" },
];

const operators = {
  string: ["equals", "contains", "starts with", "ends with"],
  number: ["equals", "greater than", "less than", "between"],
  boolean: ["is true", "is false"],
  date: ["before", "after", "between"],
};

// Define form schema
const formSchema = z.object({
  configName: z.string().min(1, "Configuration name is required"),
});

const RuleBuilder = ({
  onSave = () => {},
  existingRules = [],
  availableFields = defaultFields,
}: RuleBuilderProps) => {
  const [rules, setRules] = useState<Rule[]>(
    existingRules.length
      ? existingRules
      : [{ id: "1", field: "", operator: "", value: "", score: 5 }],
  );
  const [configName, setConfigName] = useState<string>(
    "New Scoring Configuration",
  );

  // Initialize form with the schema
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      configName: "New Scoring Configuration",
    },
  });

  const addRule = () => {
    setRules([
      ...rules,
      { id: `${Date.now()}`, field: "", operator: "", value: "", score: 5 },
    ]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: any) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === id) {
          return { ...rule, [field]: value };
        }
        return rule;
      }),
    );
  };

  const handleSave = () => {
    // Ensure all rules have valid values before saving
    const validRules = rules.filter(
      (rule) =>
        rule.field &&
        rule.operator &&
        rule.value !== undefined &&
        rule.value !== null,
    );

    if (validRules.length === 0) {
      alert("Please add at least one complete rule before saving.");
      return;
    }

    onSave(validRules);
  };

  const getFieldType = (
    fieldName: string,
  ): "string" | "number" | "boolean" | "date" => {
    const field = availableFields.find((f) => f.name === fieldName);
    return field?.type || "string";
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg border border-border">
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Scoring Rule Builder</CardTitle>
            <CardDescription>
              Create and customize scoring rules based on property attributes
            </CardDescription>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="configName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={configName}
                        onChange={(e) => {
                          setConfigName(e.target.value);
                          field.onChange(e);
                        }}
                        placeholder="Enter a name for this scoring configuration"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="p-4 border rounded-md bg-card relative"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRule(rule.id)}
                    disabled={rules.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-medium mb-4">Rule {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Select
                      value={rule.field}
                      onValueChange={(value) =>
                        updateRule(rule.id, "field", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.name}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select
                      value={rule.operator}
                      onValueChange={(value) =>
                        updateRule(rule.id, "operator", value)
                      }
                      disabled={!rule.field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {rule.field &&
                          operators[getFieldType(rule.field)].map((op) => (
                            <SelectItem key={op} value={op}>
                              {op}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={rule.value.toString()}
                      onChange={(e) =>
                        updateRule(rule.id, "value", e.target.value)
                      }
                      type={
                        getFieldType(rule.field) === "number"
                          ? "number"
                          : "text"
                      }
                      placeholder="Enter value"
                      disabled={
                        !rule.operator ||
                        ["is true", "is false"].includes(rule.operator)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Score (0-10)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[rule.score]}
                        min={0}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          updateRule(rule.id, "score", value[0])
                        }
                        className="flex-1"
                      />
                      <span className="w-8 text-center">{rule.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addRule} className="w-full mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};

export default RuleBuilder;
