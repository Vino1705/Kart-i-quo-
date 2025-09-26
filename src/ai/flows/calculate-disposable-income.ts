'use server';

/**
 * @fileOverview Calculates disposable income, daily spending limit, and savings potential.
 *
 * - calculateDisposableIncome - A function that performs the calculation.
 * - CalculateDisposableIncomeInput - The input type for the function.
 * - CalculateDisposableIncomeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateDisposableIncomeInputSchema = z.object({
  totalIncome: z.number().describe("The user's total monthly income."),
  mandatoryExpenses: z
    .array(z.object({name: z.string(), amount: z.number()}))
    .describe('An array of mandatory monthly expenses with their amounts.'),
});
export type CalculateDisposableIncomeInput = z.infer<
  typeof CalculateDisposableIncomeInputSchema
>;

const CalculateDisposableIncomeOutputSchema = z.object({
  disposableIncome: z
    .number()
    .describe(
      'The income remaining after subtracting mandatory expenses. This is the amount available for daily spending and goals.'
    ),
  dailySpendingLimit: z
    .number()
    .describe(
      'A suggested daily spending limit for discretionary items. (e.g., 40% of disposable income divided by 30 days)'
    ),
  goalSavingsSuggestion: z
    .number()
    .describe(
      'A suggested monthly amount to be allocated towards goals. (e.g., 60% of disposable income)'
    ),
  explanation: z
    .string()
    .describe(
      'A brief, encouraging explanation of how the numbers were calculated.'
    ),
});
export type CalculateDisposableIncomeOutput = z.infer<
  typeof CalculateDisposableIncomeOutputSchema
>;

export async function calculateDisposableIncome(
  input: CalculateDisposableIncomeInput
): Promise<CalculateDisposableIncomeOutput> {
  return calculateDisposableIncomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateDisposableIncomePrompt',
  input: {schema: CalculateDisposableIncomeInputSchema},
  output: {schema: CalculateDisposableIncomeOutputSchema},
  prompt: `You are a friendly financial assistant. A user has provided their income and mandatory monthly expenses.

Your task is to calculate their disposable income, a reasonable daily spending limit, and a suggested monthly amount for their savings goals.

- Total Income: ₹{{{totalIncome}}}
- Mandatory Expenses:
{{#each mandatoryExpenses}}
  - {{{name}}}: ₹{{{amount}}}
{{/each}}

1.  **Calculate Total Mandatory Expenses**: Sum up all the amounts from the mandatory expenses.
2.  **Calculate Disposable Income**: Subtract the total mandatory expenses from the total income.
3.  **Calculate Daily Spending Limit**: Take 40% of the disposable income and divide it by 30. This will be the discretionary spending limit per day.
4.  **Calculate Goal Savings Suggestion**: Take the remaining 60% of the disposable income as the suggested monthly savings amount for goals.
5.  **Provide a brief, encouraging explanation** of the results.

Return the result in the specified JSON format.
`,
});

const calculateDisposableIncomeFlow = ai.defineFlow(
  {
    name: 'calculateDisposableIncomeFlow',
    inputSchema: CalculateDisposableIncomeInputSchema,
    outputSchema: CalculateDisposableIncomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
