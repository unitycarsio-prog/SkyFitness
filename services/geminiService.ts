
import { GoogleGenAI, Type } from "@google/genai";
import { FitnessPlan, DailyPlan, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fitnessPlanSchema = {
  type: Type.OBJECT,
  properties: {
    goal: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          restDay: { type: Type.BOOLEAN },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['name', 'sets', 'reps', 'description'],
            },
          },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                food: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                cheapAlternative: { type: Type.STRING },
              },
              required: ['name', 'food', 'ingredients', 'cheapAlternative'],
            },
          },
        },
        required: ['day', 'restDay', 'exercises', 'meals'],
      },
    },
  },
  required: ['goal', 'duration', 'plan'],
};


export const generateFitnessPlan = async (goal: string, duration: number): Promise<FitnessPlan> => {
  const prompt = `
    You are an expert fitness coach and world-class nutritionist.
    Create a detailed and effective fitness plan for a user with the goal of '${goal}' over a duration of ${duration} days.

    Instructions:
    1.  The plan must cover every single day of the duration.
    2.  For each day, provide a full exercise routine and a complete meal plan (e.g., Breakfast, Lunch, Dinner, Snack).
    3.  For exercise days, list specific exercises with sets, reps, and a brief, clear description.
    4.  For rest days, set the 'restDay' flag to true, provide an empty exercises array, and for meals, suggest lighter, recovery-focused options. Also, suggest light activities like stretching or walking.
    5.  For each meal, provide a list of main ingredients.
    6.  Crucially, for each meal, also suggest a cheaper, budget-friendly alternative that provides similar nutritional value.
    7.  The entire output must be a single JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fitnessPlanSchema,
        temperature: 0.7
      }
    });
    
    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText);

    // Basic validation to ensure we got something that looks like our plan
    if (!parsedPlan.plan || !Array.isArray(parsedPlan.plan)) {
        throw new Error("Invalid plan structure received from API.");
    }

    return parsedPlan as FitnessPlan;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan from Gemini API.");
  }
};


export const getChatbotResponse = async (
  message: string,
  history: ChatMessage[],
  planContext: { plan: FitnessPlan; currentDayPlan: DailyPlan | undefined } | null
): Promise<string> => {
  let contextPrompt: string;

  if (planContext) {
    const { plan, currentDayPlan } = planContext;
    contextPrompt = `
      You are a friendly, motivating, and knowledgeable AI fitness coach.
      The user is currently following a fitness plan. Here are their details:
      - Goal: ${plan.goal}
      - Duration: ${plan.duration} days
      - Today is Day: ${currentDayPlan?.day || 'Unknown'}

      Today's Plan:
      ${currentDayPlan
        ? (currentDayPlan.restDay
            ? "- Today is a rest day. Recommended activities: light stretching, walking."
            : `- Workout: ${currentDayPlan.exercises.map(e => e.name).join(', ')}`) +
          `\n- Nutrition: ${currentDayPlan.meals.map(m => m.food).join(', ')}`
        : "- No plan details available for today."
      }

      Your role is to answer the user's questions based on this context. Be encouraging and provide safe, practical advice. If a question is outside the scope of fitness, nutrition, or motivation, politely decline to answer.
    `;
  } else {
    contextPrompt = `
      You are a friendly, motivating, and knowledgeable AI fitness coach.
      The user does not have an active fitness plan yet. 
      Your role is to answer general fitness, nutrition, and wellness questions.
      You can also help them understand how to use this app to generate a personalized plan by selecting a goal and duration.
      Be encouraging and provide safe, practical advice. If a question is outside the scope of fitness and nutrition, politely decline to answer.
    `;
  }

  const fullPrompt = `
    ${contextPrompt}

    Conversation History:
    ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    User's new question: "${message}"
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};