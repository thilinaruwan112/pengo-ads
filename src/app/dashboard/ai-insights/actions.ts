"use server";

import { suggestCampaignImprovements, SuggestCampaignImprovementsInput } from "@/ai/flows/suggest-campaign-improvements";

export async function getCampaignSuggestions(input: SuggestCampaignImprovementsInput) {
  try {
    const result = await suggestCampaignImprovements(input);
    return { success: true, suggestions: result.suggestedImprovements };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get suggestions." };
  }
}
