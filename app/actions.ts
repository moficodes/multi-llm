"use server";

import type { model } from "@/app/types";

export async function modelInfo(): Promise<model[]> {
  const MODEL = process.env.LLM_URLS || "";
  const urls = MODEL.split(",");
  const models: model[] = [];

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

  return models;
}

export async function modelOutput(
  model: model,
  prompt: string,
  maxTokens: number,
  temparature: number,
): Promise<string> {
  const response = await fetch(`${model.url}/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.name,
      prompt: prompt,
      max_tokens: maxTokens,
      temparature: temparature,
    }),
  });
  const json = await response.json();

  return json.choices[0].text;
}
