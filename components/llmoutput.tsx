"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
export const LLMOutput = ({ output, url }: { output: string, url: string }) => {
  const [model, setModel] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await fetch(`${url}/v1/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const json = await response.json();
      setModel(json.data[0].id);
    }
    fetchInfo();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`${url}/v1/completions`, {
      method: "POST",
      body: JSON.stringify({
        model: "google/gemma-2-2b-it",
        prompt: "What is 2+2?",
        max_tokens: 256,
        temperature: 0.5,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const json = await response.json();
  }
  return (
    <Card className='col-span-4 p-4 my-4'>
      <CardHeader>
        <p>Model: {model}</p>
      </CardHeader>
      <CardBody>
        <div className="gap-4 items-center justify-center">
          <div className="">
            <h1>Output</h1>
            <p>{output}</p>
          </div>
        </div>
      </CardBody>

    </Card>
  )

};