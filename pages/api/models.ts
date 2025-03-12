"use server";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  models: model[];
};
type model = {
  name: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
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
  res.status(200).json({ models: models });
}
