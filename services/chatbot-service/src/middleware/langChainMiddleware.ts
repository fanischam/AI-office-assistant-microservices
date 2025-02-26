import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from '@langchain/langgraph';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { v4 as uuidv4 } from 'uuid';
import { PROMPT_TEMPLATE } from '../utils/constants';

const config = { configurable: { thread_id: uuidv4() } };
const conversationHistory = new Map<
  string,
  Array<{ role: string; content: string }>
>();

export const getLangChainResponse = async (
  prompt: string,
  userId: string
): Promise<string> => {
  const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
    apiKey: process.env.OPEN_AI_API_KEY,
    temperature: 0.7,
  });

  const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    prompt: Annotation<string>(),
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', PROMPT_TEMPLATE],
    ['placeholder', '{messages}'],
  ]);

  const callModel = async (state: typeof GraphAnnotation.State) => {
    try {
      const currentPrompt = state.prompt || prompt;

      const formattedPrompt = await promptTemplate.invoke({
        messages: state.messages || [],
        prompt: currentPrompt,
      });

      const response = await llm.invoke(formattedPrompt);

      const userHistory = conversationHistory.get(userId) || [];
      userHistory.push({
        role: 'user',
        content: currentPrompt,
      });
      userHistory.push({
        role: 'assistant',
        content: response.content.toString(),
      });
      conversationHistory.set(userId, userHistory);

      return { messages: response };
    } catch (error) {
      console.error('Error in callModel:', error);
      throw error;
    }
  };

  const workflow = new StateGraph(GraphAnnotation)
    .addNode('model', callModel)
    .addEdge(START, 'model')
    .addEdge('model', END);

  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  const history = conversationHistory.get(userId) || [];
  const input = [...history, { role: 'user', content: prompt }];
  const output = await app.invoke({ messages: input }, config);

  return output.messages[output.messages.length - 1].content.toString();
};
