"use client";
import React from "react";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import { model } from "@/app/types";

type LLMOutputProps = {
  prompt: string;
  temparature: number;
  maxTokens: number;
  model: model;
  setPrompt: Dispatch<SetStateAction<string>>;
};

export const LLMOutput = ({
  prompt,
  temparature,
  maxTokens,
  model,
  setPrompt,
}: LLMOutputProps) => {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (prompt === "") {
      return;
    }
    const output = async () => {
      setLoading(true);
      setOutput("");
      try {
        const response = await fetch("/api/models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model.name,
            url: model.url,
            maxTokens: maxTokens,
            temparature: temparature,
          }),
        });
        const json = await response.json();

        if (json.message === "Error") {
          setOutput("Error");

          return;
        }
        const data = json.message;

        setOutput(data);
      } catch (error) {
      } finally {
        setLoading(false);
        setPrompt("");
      }
    };

    output();
  }, [prompt]);
  const renderTextWithBreaks = (text: string) => {
    return text
      ?.trim()
      .split("\n")
      .map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ));
  };

  return (
    <Card className="col-span-4 p-4 my-4 max-h-96 overflow-y-auto">
      <CardHeader>
        <p>Model: {model.name}</p>
      </CardHeader>
      <CardBody>
        <div className="gap-4 items-center justify-center">
          <div className="flex flex-col gap-4">
            <h1>Prompt</h1>
            <p>{prompt}</p>
            <h1>Output</h1>
            {loading && (
              <Spinner className="justify-center w-full h-full items-center" />
            )}
            {output !== "" && <div>{renderTextWithBreaks(output)}</div>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
