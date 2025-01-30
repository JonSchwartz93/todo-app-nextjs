import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('*****body', body);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    // temperature: 0.7,
    // max_tokens: 100,
    messages: [
      { 
        role: 'user',
        content: `Generate a recipe given the following list of ingredients: ${body.ingredients}. The response should be a json blob that contains the following properties: title, instructions, suggestedIngredients, and nutritionalFacts. "suggestedIngredients should be ingredients that are not already on the list.`
      },
    ]
  });

  return new NextResponse(JSON.stringify({ data: response.choices[0].message.content }), {
    status: 200,
  });
}
