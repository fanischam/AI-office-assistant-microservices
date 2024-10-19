import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

const getGPTResponse = async (prompt: string): Promise<string> => {
  const contextualPrompt = `
      You are an office assistant chatbot. Your job is to help users book appointments and remind them of upcoming appointments.
      Please respond with the following details in separate lines:
      Book Appointment
      - Appointment with: [Participant Name]
      - Purpose: [Purpose]
      - Date: [Date]
      - Time: [Time]
      - Contact Number: [Contact Number]

      In case that details are not specified, leave them empty.
  
      Here is the user's question: "${prompt}"
    `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an office assistant chatbot.' },
        { role: 'user', content: contextualPrompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const choice = response.choices[0];
    const text = choice?.message?.content?.trim();
    return text || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    throw new Error('Failed to get a response from the assistant.');
  }
};

export { getGPTResponse };
