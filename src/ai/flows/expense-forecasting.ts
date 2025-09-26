'use server';

/**
 * @fileOverview Expense forecasting AI agent.
 *
 * - forecastExpenses - A function that handles the expense forecasting process.
 * - ForecastExpensesInput - The input type for the forecastExpenses function.
 * - ForecastExpensesOutput - The return type for the forecastExpenses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastExpensesInputSchema = z.object({
  pastExpenses: z.string().describe('A JSON string of past expenses data, including date and amount.'),
  seasonalTrends: z.string().describe('A JSON string of seasonal spending trends data.'),
});
export type ForecastExpensesInput = z.infer<typeof ForecastExpensesInputSchema>;

const ForecastExpensesOutputSchema = z.object({
  forecastedSpending: z
    .string()
    .describe('A JSON string containing forecasted spending for the next month, broken down by category and day.'),
  suggestedDailyLimit: z.number().describe('The suggested daily spending limit to stay within budget.'),
  explanation: z.string().describe('An explanation of how the forecast was generated.'),
});
export type ForecastExpensesOutput = z.infer<typeof ForecastExpensesOutputSchema>;

export async function forecastExpenses(input: ForecastExpensesInput): Promise<ForecastExpensesOutput> {
  return forecastExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastExpensesPrompt',
  input: {schema: ForecastExpensesInputSchema},
  output: {schema: ForecastExpensesOutputSchema},
  prompt: `You are a personal finance expert. Analyze the user's past expenses and seasonal trends to forecast their future spending.

Past Expenses: {{{pastExpenses}}}
Seasonal Trends: {{{seasonalTrends}}}

Based on this information, forecast the user's spending for the next month, broken down by category and day. Also suggest a daily spending limit to help the user stay within their budget. Provide an explanation of how you generated the forecast.

Return the forecasted spending as a JSON string and the suggested daily limit as a number. The explanation should be a concise summary of your analysis.

Forecasted Spending (JSON): 
Suggested Daily Limit:
Explanation: `,
});

const forecastExpensesFlow = ai.defineFlow(
  {
    name: 'forecastExpensesFlow',
    inputSchema: ForecastExpensesInputSchema,
    outputSchema: ForecastExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Regular expression to extract JSON and number from the output
    const jsonRegex = /\{.*\}/;
    const numberRegex = /\d+(\.\d+)?/;
    const jsonMatch = output?.text.match(jsonRegex);
    const numberMatch = output?.text.match(numberRegex);
    const explanation = output?.text.replace(jsonRegex, '').replace(numberRegex, '').trim();

    let forecastedSpending = '';
    let suggestedDailyLimit = 0;

    if (jsonMatch) {
      forecastedSpending = jsonMatch[0];
    }

    if (numberMatch) {
      suggestedDailyLimit = parseFloat(numberMatch[0]);
    }


    return {
      forecastedSpending: forecastedSpending || 'No spending data',
      suggestedDailyLimit: suggestedDailyLimit || 0,
      explanation: explanation || 'No explanation available.',
    };
  }
);
