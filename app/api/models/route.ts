export async function POST(request: Request) {
  let result = "";
  const body = await request.json();
  const { prompt, model, url, maxTokens, temparature } = body;

  try {
    const response = await fetch(`${url}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
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
        temperature: temparature,
      }),
    });
    const json = await response.json();

    result = json.choices[0].message.content;

    return new Response(JSON.stringify({ message: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
