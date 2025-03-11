"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {LLMOutput} from "@/components/llmoutput";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  const url = "http://localhost:8000,http://localhost:8000,http://localhost:8000";
  const urls = url.split(",");

  const handleOutput = () => {
    setOutput(prompt);
  }
  return (
    <main>
      <div className="grid grid-cols-12 gap-4 items-center justify-center">
        <Input className="col-span-10" label="Prompt" value={prompt} onValueChange={setPrompt} />
        <Button className="col-span-2" color="primary" onPress={handleOutput}>
          Generate
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {urls.map((url, index) => {
          return (
            <LLMOutput key={index} url={url} output={output} />
          );
        })}
      </div>
    </main>
  );   
}
