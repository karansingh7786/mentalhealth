const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: modelName });
  console.log(`✅ Gemini AI configured successfully with model: ${modelName}`);
} else {
  console.warn('⚠️  No GEMINI_API_KEY found — AI features will use fallback responses');
}

// Cache for AI responses (keyed by fatigue level, same as Flask implementation)
const FATIGUE_CACHE = {};

const FALLBACK = {
  suggestion: 'Take rest and stay hydrated.',
  summary: 'You may be experiencing fatigue.',
  quote: "Rest if you must, but don't quit."
};

/**
 * Generates a recommendation using Gemini AI.
 * Mirrors the Python backend behavior:
 *   - Returns cached response if available
 *   - Calls Gemini with a 2-second timeout
 *   - Falls back to default if Gemini fails or times out
 */
async function getRecommendation(fatigue, sleep, study, screen, stress) {
  // Return cached response instantly if it exists
  if (FATIGUE_CACHE[fatigue]) {
    console.log(`DEBUG: Returning cached response for fatigue level: ${fatigue}`);
    return FATIGUE_CACHE[fatigue];
  }

  // Try Gemini AI
  if (model) {
    try {
      console.log(`DEBUG: Authenticating with Gemini API Key (Length: ${GEMINI_API_KEY.length})`);
      const prompt = `Fatigue: ${fatigue}. Give short suggestion, summary, and quote. Return JSON only.`;

      // Create a promise that rejects after 2 seconds (mirrors Python's 2s timeout)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout exceeded 2 seconds')), 2000)
      );

      const geminiPromise = (async () => {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log('Gemini RAW:', responseText);

        // Extract JSON from response (same regex as Python)
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          const aiData = JSON.parse(match[0]);

          // Validate that all required keys exist (same check as Python)
          if (aiData.suggestion && aiData.summary && aiData.quote) {
            return aiData;
          }
        }
        return null;
      })();

      // Race between Gemini response and timeout
      const result = await Promise.race([geminiPromise, timeoutPromise]);

      if (result) {
        // Cache the successful result before returning
        FATIGUE_CACHE[fatigue] = result;
        return result;
      } else {
        console.log('Gemini error: No valid JSON block found in response.');
      }
    } catch (err) {
      console.log(`Gemini error: ${err.message}`);
    }
  }

  return FALLBACK;
}

module.exports = { getRecommendation };
