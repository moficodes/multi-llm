import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

type LLMOutputProps = {
  output: string;
  model: string;
  loading: boolean;
  error: string;
};

export const LLMOutput = ({
  output,
  model,
  loading,
  error,
}: LLMOutputProps) => {
  return (
    <Card className="col-span-4 p-4 my-4">
      <CardHeader>
        <p>Model: {model}</p>
      </CardHeader>
      <CardBody>
        <div className="gap-4 items-center justify-center">
          <div className="">
            <h1>Output</h1>
            {loading && <Spinner />}
            {output !== "" && <p>{output}</p>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
