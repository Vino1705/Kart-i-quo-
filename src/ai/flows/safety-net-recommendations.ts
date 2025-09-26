// src/ai/flows/safety-net-recommendations.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that provides personalized financial advice
 * and recommends spending cuts during times of income reduction.
 *
 * @interface SafetyNetRecommendationsInput - Defines the input schema for the safety net recommendations flow.
 * @interface SafetyNetRecommendationsOutput - Defines the output schema for the safety net recommendations flow.
 * @function getSafetyNetRecommendations - The main function that triggers the flow to get financial advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafetyNetRecommendationsInputSchema = z.object({
  income: z.number().describe('The user\'s current income.'),
  expenses: z
    .array(z.object({category: z.string(), amount: z.number()}))
    .describe('The user\'s expenses, with category and amount.'),
  essentialCategories: z
    .array(z.string())
    .describe('Categories considered essential expenses (e.g., rent, EMI, food).'),
});
export type SafetyNetRecommendationsInput = z.infer<typeof SafetyNetRecommendationsInputSchema>;

const SafetyNetRecommendationsOutputSchema = z.object({
  prioritizedExpenses: z
    .array(z.object({category: z.string(), amount: z.number()}))
    .describe('The user\'s expenses, with essential expenses prioritized.'),
  recommendations: z.array(z.string()).describe('Recommendations for cutting back on spending.'),
});
export type SafetyNetRecommendationsOutput = z.infer<typeof SafetyNetRecommendationsOutputSchema>;

export async function getSafetyNetRecommendations(
  input: SafetyNetRecommendationsInput
): Promise<SafetyNetRecommendationsOutput> {
  return safetyNetRecommendationsFlow(input);
}

const safetyNetRecommendationsPrompt = ai.definePrompt({
  name: 'safetyNetRecommendationsPrompt',
  input: {schema: SafetyNetRecommendationsInputSchema},
  output: {schema: SafetyNetRecommendationsOutputSchema},
  prompt: `You are a financial advisor providing advice to a user who has experienced a drop in income.

  Based on their income, expenses, and essential expense categories, provide recommendations for cutting back on spending.

  Prioritize essential expenses ({{{essentialCategories}}}) and suggest specific cuts in other areas.

  Income: {{{income}}}
  Expenses: {{#each expenses}}{{{category}}}: {{{amount}}}\n{{/each}}
  `,
});

const safetyNetRecommendationsFlow = ai.defineFlow(
  {
    name: 'safetyNetRecommendationsFlow',
    inputSchema: SafetyNetRecommendationsInputSchema,
    outputSchema: SafetyNetRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await safetyNetRecommendationsPrompt(input);
    return output!;
  }
);
