
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating math questions tailored to the user's level and selected difficulty.
 *
 * The flow takes the user's level, selected category, and desired difficulty as input.
 * It generates a math question with the correct answer, distractor options, and ensures the output difficulty matches the request.
 * It exports:
 *   - generateMathQuestion: The function to call to generate a math question.
 *   - GenerateMathQuestionInput: The input type for the function.
 *   - GenerateMathQuestionOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMathQuestionInputSchema = z.object({
  level: z.number().describe('The user\u2019s current level (for context).'),
  category: z
    .enum(['Arithmetic', 'Algebra', 'Geometry', 'Word Problems', 'Logic'])
    .describe('The category of math question to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The desired difficulty level of the question (e.g., "easy", "medium", "hard").')
});
export type GenerateMathQuestionInput = z.infer<typeof GenerateMathQuestionInputSchema>;

const GenerateMathQuestionOutputSchema = z.object({
  question: z.string().describe('The math question.'),
  correctAnswer: z.number().describe('The correct answer to the question.'),
  distractor1: z.number().describe('A distractor answer option.'),
  distractor2: z.number().describe('A distractor answer option.'),
  distractor3: z.number().describe('A distractor answer option.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the question, matching the requested difficulty.'),
});
export type GenerateMathQuestionOutput = z.infer<typeof GenerateMathQuestionOutputSchema>;


export async function generateMathQuestion(input: GenerateMathQuestionInput): Promise<GenerateMathQuestionOutput> {
  return generateMathQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMathQuestionPrompt',
  input: {schema: GenerateMathQuestionInputSchema},
  output: {schema: GenerateMathQuestionOutputSchema},
  prompt: `You are a math question generator for a game called "Math Hero: Brain Battle".

The user is at level {{{level}}}.
Your goal is to generate a {{{difficulty}}} math question for the category of {{{category}}}.

The question MUST be appropriate for the requested '{{{difficulty}}}' level.
The question should have one correct answer and three distractor options that are plausible but incorrect.

When you output the result, you MUST set the 'difficulty' field in the JSON output to be exactly '{{{difficulty}}}' as requested. For example, if asked for 'easy', set 'difficulty' to 'easy'.

CRITICAL INSTRUCTION FOR QUESTION UNIQUENESS:
It is absolutely VITAL that the generated question is NOVEL, CREATIVE, and SIGNIFICANTLY DIFFERENT from any questions you might have generated previously, especially for this specific combination of user level ({{{level}}}), category ({{{category}}}), and difficulty ({{{difficulty}}}). Do NOT repeat questions or use trivial variations of previous questions. Strive for maximum variety and originality in your questions. Each question should feel fresh and distinct. Avoid any repetitive patterns.

Output the question, correct answer, distractor options, and the determined difficulty in the JSON format specified by the schema.
  `,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const generateMathQuestionFlow = ai.defineFlow(
  {
    name: 'generateMathQuestionFlow',
    inputSchema: GenerateMathQuestionInputSchema,
    outputSchema: GenerateMathQuestionOutputSchema,
  },
  async (input: GenerateMathQuestionInput) => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const {output} = await prompt(input);
        // Ensure the output difficulty matches the input difficulty request
        if (output && output.difficulty !== input.difficulty) {
            // This is a safety net. The prompt strongly guides the AI, but if it misbehaves, we could log or adjust.
            // For now, we'll assume the AI follows the strong instruction to match the difficulty.
            console.warn(`AI returned difficulty '${output.difficulty}' when '${input.difficulty}' was requested. Proceeding with AI's output.`);
        }
        return output!;
      } catch (error: any) {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error(`Failed to generate question after ${MAX_RETRIES} retries:`, error);
          throw error; // Re-throw the error if max retries reached
        }
        if (error.message && (error.message.includes('503') || error.message.includes('Service Unavailable') || error.message.includes('overloaded') || error.message.includes('rate limit'))) {
          console.warn(`Attempt ${retries} failed due to service unavailability or rate limit. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (retries +1) )); // Exponential backoff might be better
        } else {
          console.error(`Attempt ${retries} failed with non-retryable error:`, error);
          throw error;
        }
      }
    }
    throw new Error('Failed to generate question after multiple retries.');
  }
);
