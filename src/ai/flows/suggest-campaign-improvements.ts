'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting improvements to low-performing ad campaigns.
 *
 * - suggestCampaignImprovements - A function that analyzes campaign performance and suggests improvements.
 * - SuggestCampaignImprovementsInput - The input type for the suggestCampaignImprovements function.
 * - SuggestCampaignImprovementsOutput - The return type for the suggestCampaignImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCampaignImprovementsInputSchema = z.object({
  campaignName: z.string().describe('The name of the ad campaign.'),
  reach: z.number().describe('The current reach of the campaign.'),
  impressions: z.number().describe('The current impressions of the campaign.'),
  conversions: z.number().describe('The current conversions of the campaign.'),
  clickThroughRate: z.number().describe('The click-through rate (CTR) of the campaign.'),
  costPerClick: z.number().describe('The cost per click (CPC) of the campaign.'),
  costPerMille: z.number().describe('The cost per mille (CPM) of the campaign.'),
  campaignDescription: z.string().describe('A detailed description of the ad campaign, including the target audience, ad creatives, and campaign goals.'),
});
export type SuggestCampaignImprovementsInput = z.infer<
  typeof SuggestCampaignImprovementsInputSchema
>;

const SuggestCampaignImprovementsOutputSchema = z.object({
  suggestedImprovements: z.string().describe('A list of suggested improvements for the campaign to improve reach, impressions, and conversions.'),
});
export type SuggestCampaignImprovementsOutput = z.infer<
  typeof SuggestCampaignImprovementsOutputSchema
>;

export async function suggestCampaignImprovements(
  input: SuggestCampaignImprovementsInput
): Promise<SuggestCampaignImprovementsOutput> {
  return suggestCampaignImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCampaignImprovementsPrompt',
  input: {schema: SuggestCampaignImprovementsInputSchema},
  output: {schema: SuggestCampaignImprovementsOutputSchema},
  prompt: `You are an AI-powered marketing expert specializing in ad campaign optimization. Analyze the performance of the following low-performing ad campaign and suggest specific improvements to increase reach, impressions, and conversions. Provide actionable advice that the administrator can implement immediately.

Campaign Name: {{{campaignName}}}
Reach: {{{reach}}}
Impressions: {{{impressions}}}
Conversions: {{{conversions}}}
Click-Through Rate (CTR): {{{clickThroughRate}}}
Cost Per Click (CPC): {{{costPerClick}}}
Cost Per Mille (CPM): {{{costPerMille}}}
Campaign Description: {{{campaignDescription}}}

Based on this data, what specific changes would you recommend to improve the campaign's performance? Focus on concrete suggestions related to targeting, ad creatives, bidding strategies, and landing page optimization.
`, // Added prompt
});

const suggestCampaignImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestCampaignImprovementsFlow',
    inputSchema: SuggestCampaignImprovementsInputSchema,
    outputSchema: SuggestCampaignImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
