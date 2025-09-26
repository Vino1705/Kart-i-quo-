'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized financial advice through a conversational chatbot.
 *
 * - `getFinancialAdvice` - A function that takes a user's query and returns personalized financial advice.
 * - `FinancialAdviceInput` - The input type for the `getFinancialAdvice` function.
 * - `FinancialAdviceOutput` - The return type for the `getFinancialAdvice` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  query: z
    .string()
    .describe('The user query about their finances or a request for advice.'),
  userProfile: z
    .string()
    .optional()
    .describe('Optional user profile information to personalize the advice.'),
  pastExpenses: z
    .string()
    .optional()
    .describe('Optional user past expenses to personalize the advice.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('The personalized financial advice.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a helpful AI financial advisor. A user will provide you with a query, optionally with their profile information and past expenses, and you will provide them with personalized financial advice.

  User Query: {{{query}}}

  {{#if userProfile}}
  User Profile: {{{userProfile}}}
  {{/if}}

  {{#if pastExpenses}}
  Past Expenses: {{{pastExpenses}}}
  {{/if}}
  `,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
