
'use server';
/**
 * @fileOverview A Genkit flow for generating marketing campaign ideas.
 *
 * - generateCampaign - A function that creates campaign content based on a product description.
 * - GenerateCampaignInput - The input type for the generateCampaign function.
 * - GenerateCampaignOutput - The return type for the generateCampaign function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCampaignInputSchema = z.object({
  product: z.string().describe('The product or goal for the marketing campaign.'),
});
export type GenerateCampaignInput = z.infer<typeof GenerateCampaignInputSchema>;

const GenerateCampaignOutputSchema = z.object({
  name: z.string().describe('A catchy and concise name for the campaign.'),
  description: z.string().describe('A compelling, short description of the campaign for the ad copy.'),
  targetAudience: z.string().describe('A brief description of the ideal target audience (e.g., "Fitness enthusiasts aged 25-40 in urban areas").'),
});
export type GenerateCampaignOutput = z.infer<typeof GenerateCampaignOutputSchema>;

export async function generateCampaign(input: GenerateCampaignInput): Promise<GenerateCampaignOutput> {
  return generateCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignPrompt',
  input: { schema: GenerateCampaignInputSchema },
  output: { schema: GenerateCampaignOutputSchema },
  prompt: `You are a world-class marketing expert for social media platforms like Facebook and Instagram.
  
  A user will provide you with a product or a marketing goal.
  
  Your task is to generate a creative and effective campaign plan.
  
  Product/Goal: {{{product}}}
  
  Please provide a catchy name, a compelling description, and a specific target audience.`,
});

const generateCampaignFlow = ai.defineFlow(
  {
    name: 'generateCampaignFlow',
    inputSchema: GenerateCampaignInputSchema,
    outputSchema: GenerateCampaignOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
