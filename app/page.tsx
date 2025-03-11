"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { LLMOutput } from "@/components/llmoutput";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [temparature, setTemparature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(128);
  const [output, setOutput] = useState<Record<number, string>>({});
  const [error, setError] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [model, setModel] = useState<Record<number, string>>({});

  const urlList = process.env.NEXT_PUBLIC_LLM_URLS;
  const urls = urlList?.split(",") || [];

  useEffect(() => {
    urls.forEach((url, i) => {
      fetch(`${url}/v1/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setModel((prev) => {
            return { ...prev, [i]: json.data[0].id };
          });
        })
        .catch((error) => {
          setError((prev) => {
            return { ...prev, [i]: error };
          });
        });
    });
  }, []);

  const handleOutput = () => {
    if (prompt === "") {
      return;
    }
    urls.forEach((url, i) => {
      setLoading((prev) => {
        return { ...prev, [i]: true };
      });
      setOutput((prev) => {
        return { ...prev, [i]: "" };
      });
      fetch(`${url}/v1/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model[i],
          prompt: prompt,
          max_tokens: 128,
          temparature: 0.5,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setOutput((prev) => {
            return { ...prev, [i]: json.choices[0].text };
          });
          setLoading((prev) => {
            return { ...prev, [i]: false };
          });
        })
        .catch((error) => {
          setError((prev) => {
            return { ...prev, [i]: error };
          });
        });
    });
    setPrompt("");
  };

  return (
    <main>
      <div className="grid grid-cols-12 gap-4 items-center justify-center">
        <Input
          className="col-span-10"
          label="Prompt"
          value={prompt}
          onValueChange={setPrompt}
        />
        <Button className="col-span-2" color="primary" onPress={handleOutput}>
          Generate
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {urls.map((url, index) => {
          return (
            <LLMOutput
              key={index}
              error={error[index]}
              loading={loading[index]}
              model={model[index]}
              output={output[index]}
            />
          );
        })}
      </div>
    </main>
  );
}
