"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";

import { LLMOutput } from "@/components/llmoutput";

type model = {
  name: string;
  url: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [temparature, setTemparature] = useState<number>(0.5);
  const [maxTokens, setMaxTokens] = useState<number>(128);
  const [output, setOutput] = useState<Record<number, string>>({});
  const [error, setError] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [models, setModels] = useState<model[]>([]);

  const handleModelLoad = async () => {
    const response = await fetch("/api/models");
    const json = await response.json();

    setModels(json.models);
  };

  useEffect(() => {
    handleModelLoad();
  }, []);

  const handleOutput = () => {
    if (prompt === "") {
      return;
    }
    models.forEach((model, i) => {
      setLoading((prev) => {
        return { ...prev, [i]: true };
      });
      setOutput((prev) => {
        return { ...prev, [i]: "" };
      });
      fetch(`${model.url}/v1/completions`, {
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

  // ...existing code...
  const handleTemperatureChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setTemparature(value);
    }
  };

  const handleMaxTokensChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setMaxTokens(value);
    }
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
      <div className="flex flex-row gap-4 py-4">
        <Slider
          label="Temparature"
          maxValue={1}
          minValue={0.0}
          step={0.1}
          value={temparature}
          onChange={handleTemperatureChange}
        />
        <Slider
          label="Max Tokens"
          maxValue={512}
          minValue={1}
          step={1}
          value={maxTokens}
          onChange={handleMaxTokensChange}
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        {models.map((model, index) => {
          return (
            <LLMOutput
              key={index}
              error={error[index]}
              loading={loading[index]}
              model={model.name}
              output={output[index]}
            />
          );
        })}
      </div>
    </main>
  );
}
