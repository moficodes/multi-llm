"use server";

import type { model } from "@/app/types";

export async function modelInfo(): Promise<model[]> {
  const MODEL = process.env.LLM_URLS || "";
  const urls = MODEL.split(",");
  const models: model[] = [];

  try {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const response = await fetch(`${url}/v1/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      models.push({ name: json.data[0].id, url: url });
    }
  } catch (error) {}

  return models;
}

export async function modelOutput(
  model: model,
  prompt: string,
  maxTokens: number,
  temparature: number,
): Promise<string> {
  let result = "";

  try {
    const response = await fetch(`${model.url}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.name,
        messages: [
          {
            role: "system",
            content:
              "you are an helpful ai assistant. you will answer the users questions. be brief and to the point. try to be factual and kind. do not use slang or jargon. do not use abbreviations. do not use emojis. try to keep your answers short and simple.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: maxTokens,
        temparature: temparature,
      }),
    });
    const json = await response.json();

    result = json.choices[0].message.content;
  } catch (error) {}

  return result;
}
