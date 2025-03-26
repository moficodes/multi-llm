"use client";
import type { model } from "@/app/types";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";

import { modelInfo, modelOutput } from "@/app/actions";
import { LLMOutput } from "@/components/llmoutput";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [temparature, setTemparature] = useState<number>(0.5);
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
  }

  // const handleOutput = async () => {
  //   if (prompt === "") {
  //     return;
  //   }

  //   // Reset outputs, errors, and set loading to true for all models
  //   setOutput({});
  //   setError({});
  //   const initialLoading: Record<number, boolean> = {};

  //   models.forEach((_, i) => {
  //     initialLoading[i] = true;
  //   });
  //   setLoading(initialLoading);

  //   // Create an array of promises for each model's output
  //   const outputPromises = models.map(async (model, i) => {
  //     try {
  //       const result = await modelOutput(model, prompt, maxTokens, temparature);

  //       return { index: i, output: result, error: "" };
  //     } catch (e) {
  //       return { index: i, output: "", error: "Failed to fetch output" + e };
  //     }
  //   });

  //   // Wait for all promises to resolve
  //   const results = await Promise.all(outputPromises);

  //   // Update state based on the results
  //   const newOutput: Record<number, string> = {};
  //   const newError: Record<number, string> = {};
  //   const newLoading: Record<number, boolean> = {};

  //   results.forEach((result) => {
  //     newOutput[result.index] = result.output;
  //     newError[result.index] = result.error;
  //     newLoading[result.index] = false;
  //   });

  //   setOutput(newOutput);
  //   setError(newError);
  //   setLoading(newLoading);
  //   setPrompt("");
  // };

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
              prompt={output}
              model={model}
              temparature={temparature}
              maxTokens={maxTokens}
              setPrompt={setPrompt}
            />
          );
        })}
      </div>
    </main>
  );
}
