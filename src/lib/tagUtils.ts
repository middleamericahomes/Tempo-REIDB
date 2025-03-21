import { supabase } from "./supabase";

/**
 * Utility functions for handling tags and lists with proper case sensitivity
 */

/**
 * Process tags from a string or array and ensure they're properly stored
 * with case-sensitive display names but case-insensitive uniqueness
 */
export const processTags = async (
  propertyId: string,
  tags: string | string[] | null,
): Promise<void> => {
  if (!tags || (Array.isArray(tags) && tags.length === 0)) {
    return;
  }

  // Convert to array if it's a string
  const tagArray =
    typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

  if (tagArray.length === 0) return;

  // Process each tag
  for (const tagName of tagArray) {
    // First check if tag exists (case-insensitive)
    const { data: existingTags } = await supabase
      .from("tags")
      .select("id, name")
      .ilike("name_canonical", tagName.toLowerCase())
      .limit(1);

    let tagId: number;

    if (existingTags && existingTags.length > 0) {
      // Tag exists, use its ID
      tagId = existingTags[0].id;
    } else {
      // Tag doesn't exist, create it
      const { data: newTag, error } = await supabase
        .from("tags")
        .insert({
          name: tagName,
          name_canonical: tagName.toLowerCase(),
        })
        .select("id")
        .single();

      if (error || !newTag) {
        console.error("Error creating tag:", error);
        continue;
      }

      tagId = newTag.id;
    }

    // Create property-tag relationship
    try {
      await supabase.from("property_tags").insert({
        property_id: propertyId,
        tag_id: tagId,
      });
    } catch (error) {
      // Ignore duplicate key errors
      console.log("Possible duplicate property-tag relationship, continuing");
    }
  }
};

/**
 * Process lists from a string or array and ensure they're properly stored
 * with case-sensitive display names but case-insensitive uniqueness
 */
export const processLists = async (
  propertyId: string,
  lists: string | string[] | null,
): Promise<void> => {
  if (!lists || (Array.isArray(lists) && lists.length === 0)) {
    return;
  }

  // Convert to array if it's a string
  const listArray =
    typeof lists === "string"
      ? lists
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
      : Array.isArray(lists)
        ? lists.map((l) => l.trim()).filter((l) => l.length > 0)
        : [];

  if (listArray.length === 0) return;

  // Process each list
  for (const listName of listArray) {
    // First check if list exists (case-insensitive)
    const { data: existingLists } = await supabase
      .from("lists")
      .select("id, name")
      .ilike("name_canonical", listName.toLowerCase())
      .limit(1);

    let listId: number;

    if (existingLists && existingLists.length > 0) {
      // List exists, use its ID
      listId = existingLists[0].id;
    } else {
      // List doesn't exist, create it
      const { data: newList, error } = await supabase
        .from("lists")
        .insert({
          name: listName,
          name_canonical: listName.toLowerCase(),
        })
        .select("id")
        .single();

      if (error || !newList) {
        console.error("Error creating list:", error);
        continue;
      }

      listId = newList.id;
    }

    // Create property-list relationship
    try {
      await supabase.from("property_lists").insert({
        property_id: propertyId,
        list_id: listId,
      });
    } catch (error) {
      // Ignore duplicate key errors
      console.log("Possible duplicate property-list relationship, continuing");
    }
  }
};

/**
 * Get all tags for a property with proper case-sensitive display names
 */
export const getPropertyTags = async (
  propertyId: string,
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("property_tags")
    .select("tag_id(name)")
    .eq("property_id", propertyId);

  if (error || !data) {
    console.error("Error fetching property tags:", error);
    return [];
  }

  return data.map((item) => item.tag_id.name);
};

/**
 * Get all lists for a property with proper case-sensitive display names
 */
export const getPropertyLists = async (
  propertyId: string,
): Promise<string[]> => {
  const { data, error } = await supabase
    .from("property_lists")
    .select("list_id(name)")
    .eq("property_id", propertyId);

  if (error || !data) {
    console.error("Error fetching property lists:", error);
    return [];
  }

  return data.map((item) => item.list_id.name);
};
