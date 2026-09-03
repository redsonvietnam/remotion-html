// preflight pure logic
import { existsSync } from "node:fs";

export function evaluatePreflight(rootPath: string) {
  const checks = [
    {
      name: "contract",
      state: existsSync(`${rootPath}/contract.json`) ? "READY" : "FAILED",
    },
    {
      name: "source",
      state: existsSync(`${rootPath}/src/Root.tsx`) ? "READY" : "FAILED",
    },
  ];

  let status = "READY";
  const evaluated = [];
  for (const check of checks) {
    evaluated.push(check);
    if (check.state === "FAILED") {
      status = "FAILED";
      break;
    }
    if (check.state === "BLOCKED") {
      status = "BLOCKED";
      break;
    }
  }
  return { status, checks: evaluated };
}
