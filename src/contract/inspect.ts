// inspect pure logic
import { readFileSync } from "node:fs";
import path from "node:path";

export function loadContractFrom(contractPath: string) {
  return JSON.parse(readFileSync(contractPath, "utf8"));
}

export function inspectContractData(contractPath: string) {
  const contract = loadContractFrom(contractPath);
  return {
    contractVersion: contract.contractVersion,
    projectId: contract.projectId,
    projectName: contract.projectName,
    projectVersion: contract.projectVersion,
    capabilities: contract.capabilities.map((c: any) => c.name),
    productions: contract.productions,
    compatibility: contract.compatibility,
  };
}
