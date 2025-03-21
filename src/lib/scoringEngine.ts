import { supabase } from "./supabase";
import { fromJsonString } from "./jsonUtils";

/**
 * Scoring engine for applying scoring rules to properties
 */

interface ScoringRule {
  id: number;
  configuration_id: string;
  rule_name: string;
  rule_type: string;
  field_name?: string;
  operator?: string;
  value?: string;
  score: number;
}

interface Property {
  id: string;
  [key: string]: any;
}

interface ScoreDetails {
  rule_id: number;
  rule_name: string;
  score: number;
  matched: boolean;
  reason?: string;
}

/**
 * Apply a scoring configuration to a property
 */
export const scoreProperty = async (
  propertyId: string,
  configurationId: string,
): Promise<number> => {
  // Get the property data
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    console.error("Error fetching property:", propertyError);
    return 0;
  }

  // Get the property's tags
  const { data: propertyTags, error: tagsError } = await supabase
    .from("property_tags")
    .select("tag_id(id, name)")
    .eq("property_id", propertyId);

  if (tagsError) {
    console.error("Error fetching property tags:", tagsError);
  }

  const tags = propertyTags?.map((pt) => pt.tag_id.name) || [];
  const tagIds = propertyTags?.map((pt) => pt.tag_id.id) || [];

  // Get the property's lists
  const { data: propertyLists, error: listsError } = await supabase
    .from("property_lists")
    .select("list_id(id, name)")
    .eq("property_id", propertyId);

  if (listsError) {
    console.error("Error fetching property lists:", listsError);
  }

  const lists = propertyLists?.map((pl) => pl.list_id.name) || [];
  const listIds = propertyLists?.map((pl) => pl.list_id.id) || [];

  // Get the scoring rules for this configuration
  const { data: rules, error: rulesError } = await supabase
    .from("scoring_rules")
    .select("*")
    .eq("configuration_id", configurationId);

  if (rulesError || !rules) {
    console.error("Error fetching scoring rules:", rulesError);
    return 0;
  }

  // Apply each rule and calculate the total score
  let totalScore = 0;
  const scoreDetails: ScoreDetails[] = [];

  for (const rule of rules) {
    const { matched, score, reason } = applyRule(
      rule,
      property,
      tags,
      tagIds,
      lists,
      listIds,
    );

    if (matched) {
      totalScore += score;
    }

    scoreDetails.push({
      rule_id: rule.id,
      rule_name: rule.rule_name,
      score: score,
      matched: matched,
      reason: reason,
    });
  }

  // Save the score to the database
  const { error: saveError } = await supabase.from("property_scores").upsert({
    property_id: propertyId,
    configuration_id: configurationId,
    score: totalScore,
    details: scoreDetails,
  });

  if (saveError) {
    console.error("Error saving property score:", saveError);
  }

  return totalScore;
};

/**
 * Apply a single scoring rule to a property
 */
const applyRule = (
  rule: ScoringRule,
  property: Property,
  tags: string[],
  tagIds: number[],
  lists: string[],
  listIds: number[],
): { matched: boolean; score: number; reason?: string } => {
  switch (rule.rule_type) {
    case "tag":
      return applyTagRule(rule, tags);

    case "list":
      return applyListRule(rule, lists);

    case "field":
      return applyFieldRule(rule, property);

    default:
      return { matched: false, score: 0, reason: "Unknown rule type" };
  }
};

/**
 * Apply a tag-based scoring rule
 */
const applyTagRule = (
  rule: ScoringRule,
  tags: string[],
): { matched: boolean; score: number; reason?: string } => {
  if (!rule.value) {
    return {
      matched: false,
      score: 0,
      reason: "No tag value specified in rule",
    };
  }

  // Case-insensitive tag matching
  const tagValue = rule.value.toLowerCase();
  const hasTag = tags.some((tag) => tag.toLowerCase() === tagValue);

  if (hasTag) {
    return {
      matched: true,
      score: rule.score,
      reason: `Property has tag '${rule.value}'`,
    };
  }

  return {
    matched: false,
    score: 0,
    reason: `Property does not have tag '${rule.value}'`,
  };
};

/**
 * Apply a list-based scoring rule
 */
const applyListRule = (
  rule: ScoringRule,
  lists: string[],
): { matched: boolean; score: number; reason?: string } => {
  if (!rule.value) {
    return {
      matched: false,
      score: 0,
      reason: "No list value specified in rule",
    };
  }

  // Case-insensitive list matching
  const listValue = rule.value.toLowerCase();
  const hasList = lists.some((list) => list.toLowerCase() === listValue);

  if (hasList) {
    return {
      matched: true,
      score: rule.score,
      reason: `Property is in list '${rule.value}'`,
    };
  }

  return {
    matched: false,
    score: 0,
    reason: `Property is not in list '${rule.value}'`,
  };
};

/**
 * Apply a field-based scoring rule
 */
const applyFieldRule = (
  rule: ScoringRule,
  property: Property,
): { matched: boolean; score: number; reason?: string } => {
  if (!rule.field_name || !rule.operator) {
    return {
      matched: false,
      score: 0,
      reason: "Missing field name or operator in rule",
    };
  }

  const fieldValue = property[rule.field_name];

  // Handle null or undefined field values
  if (fieldValue === null || fieldValue === undefined) {
    return {
      matched: false,
      score: 0,
      reason: `Field '${rule.field_name}' is null or undefined`,
    };
  }

  // Convert values for comparison
  let propertyValue: number | string = fieldValue;
  let ruleValue: number | string = rule.value || "";

  // Try to convert to numbers for numeric comparisons
  if (!isNaN(Number(propertyValue)) && !isNaN(Number(ruleValue))) {
    propertyValue = Number(propertyValue);
    ruleValue = Number(ruleValue);
  }

  // Apply the operator
  let matched = false;
  switch (rule.operator) {
    case "equals":
      matched = propertyValue === ruleValue;
      break;
    case "not_equals":
      matched = propertyValue !== ruleValue;
      break;
    case "greater_than":
      matched = propertyValue > ruleValue;
      break;
    case "less_than":
      matched = propertyValue < ruleValue;
      break;
    case "contains":
      matched = String(propertyValue)
        .toLowerCase()
        .includes(String(ruleValue).toLowerCase());
      break;
    case "starts_with":
      matched = String(propertyValue)
        .toLowerCase()
        .startsWith(String(ruleValue).toLowerCase());
      break;
    case "ends_with":
      matched = String(propertyValue)
        .toLowerCase()
        .endsWith(String(ruleValue).toLowerCase());
      break;
    default:
      return {
        matched: false,
        score: 0,
        reason: `Unknown operator '${rule.operator}'`,
      };
  }

  if (matched) {
    return {
      matched: true,
      score: rule.score,
      reason: `Field '${rule.field_name}' ${rule.operator} '${rule.value}'`,
    };
  }

  return {
    matched: false,
    score: 0,
    reason: `Field '${rule.field_name}' does not match condition`,
  };
};

/**
 * Apply a scoring configuration to all properties
 */
export const scoreAllProperties = async (
  configurationId: string,
  onProgress?: (processed: number, total: number) => void,
): Promise<number> => {
  // Get all properties
  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select("id");

  if (propertiesError || !properties) {
    console.error("Error fetching properties:", propertiesError);
    return 0;
  }

  const total = properties.length;
  let processed = 0;

  // Process properties in chunks to avoid overwhelming the database
  const chunkSize = 50;
  for (let i = 0; i < total; i += chunkSize) {
    const chunk = properties.slice(i, i + chunkSize);

    // Process each property in the chunk
    await Promise.all(
      chunk.map(async (property) => {
        await scoreProperty(property.id, configurationId);
        processed++;

        if (onProgress) {
          onProgress(processed, total);
        }
      }),
    );
  }

  return processed;
};

/**
 * Get scored properties with optional filtering
 */
export const getScoredProperties = async (
  configurationId: string,
  filters?: {
    minScore?: number;
    maxScore?: number;
    tags?: string[];
    lists?: string[];
  },
): Promise<any[]> => {
  // Start with the base query
  let query = supabase
    .from("property_scores")
    .select(
      `
      property_id,
      score,
      details,
      properties!inner(*)
    `,
    )
    .eq("configuration_id", configurationId);

  // Apply score filters
  if (filters?.minScore !== undefined) {
    query = query.gte("score", filters.minScore);
  }

  if (filters?.maxScore !== undefined) {
    query = query.lte("score", filters.maxScore);
  }

  // Execute the query
  const { data, error } = await query;

  if (error || !data) {
    console.error("Error fetching scored properties:", error);
    return [];
  }

  // If we have tag or list filters, we need to filter the results in memory
  let results = data;

  if (filters?.tags && filters.tags.length > 0) {
    // Get all property-tag relationships for the filtered tags
    const { data: tagData } = await supabase
      .from("tags")
      .select("id")
      .in(
        "name_canonical",
        filters.tags.map((t) => t.toLowerCase()),
      );

    if (tagData && tagData.length > 0) {
      const tagIds = tagData.map((t) => t.id);

      const { data: propertyTags } = await supabase
        .from("property_tags")
        .select("property_id, tag_id")
        .in("tag_id", tagIds);

      if (propertyTags) {
        // Group by property_id to find properties with all required tags
        const propertyTagCounts: Record<string, number> = {};
        propertyTags.forEach((pt) => {
          propertyTagCounts[pt.property_id] =
            (propertyTagCounts[pt.property_id] || 0) + 1;
        });

        // Filter to properties that have all required tags
        results = results.filter(
          (r) =>
            propertyTagCounts[r.property_id] &&
            propertyTagCounts[r.property_id] >= filters.tags!.length,
        );
      }
    } else {
      // No matching tags found, return empty result
      return [];
    }
  }

  if (filters?.lists && filters.lists.length > 0) {
    // Get all property-list relationships for the filtered lists
    const { data: listData } = await supabase
      .from("lists")
      .select("id")
      .in(
        "name_canonical",
        filters.lists.map((l) => l.toLowerCase()),
      );

    if (listData && listData.length > 0) {
      const listIds = listData.map((l) => l.id);

      const { data: propertyLists } = await supabase
        .from("property_lists")
        .select("property_id, list_id")
        .in("list_id", listIds);

      if (propertyLists) {
        // Group by property_id to find properties with all required lists
        const propertyListCounts: Record<string, number> = {};
        propertyLists.forEach((pl) => {
          propertyListCounts[pl.property_id] =
            (propertyListCounts[pl.property_id] || 0) + 1;
        });

        // Filter to properties that have all required lists
        results = results.filter(
          (r) =>
            propertyListCounts[r.property_id] &&
            propertyListCounts[r.property_id] >= filters.lists!.length,
        );
      }
    } else {
      // No matching lists found, return empty result
      return [];
    }
  }

  return results.map((r) => ({
    ...r.properties,
    score: r.score,
    score_details: r.details,
  }));
};
