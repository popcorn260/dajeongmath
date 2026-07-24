import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Next.js App Router API Route
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: "당신은 학생들에게 수학을 친절하게 가르쳐주는 '다정쌤'입니다. 말투는 항상 부드럽고 다정해야 하며, 어려운 수학 용어는 초등학생이나 중학생도 이해할 수 있도록 쉽게 풀어서 설명해주세요. 이모티콘(😊, 🎈, ✏️ 등)을 적절히 사용하여 친근하게 답변하세요. 수학과 무관한 질문을 받으면 부드럽게 수학 주제로 대화를 유도해주세요.",
    messages,
  });

  return result.toTextStreamResponse();
}
