"use client";
import type { model } from "@/app/types";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";

import { modelInfo } from "@/app/actions";
import { LLMOutput } from "@/components/llmoutput";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [temparature, setTemparature] = useState<number>(0.3);
  const [maxTokens, setMaxTokens] = useState<number>(128);
  const [models, setModels] = useState<model[]>([]);

  const handleModelLoad = async () => {
    const models = await modelInfo();

    setModels(models);
  };

  useEffect(() => {
    handleModelLoad();
  }, []);

  const handleOutput = () => {
    setOutput(prompt);
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
          maxValue={2048}
          minValue={1}
          step={1}
          value={maxTokens}
          onChange={handleMaxTokensChange}
        />
      </div>
      <div className="grid lg:grid-cols-12 grid-cols-4 gap-4">
        {models.map((model, index) => {
          return (
            <LLMOutput
              key={index}
              maxTokens={maxTokens}
              model={model}
              prompt={output}
              setPrompt={setPrompt}
              temparature={temparature}
            />
          );
        })}
      </div>
    </main>
  );
}
