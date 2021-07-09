import minimist from "minimist";
import { cli } from "./cli";

export async function main(rawArgs: string[]): Promise<void> {
  const args = minimist(rawArgs);

  const {
    inputRoot = process.cwd(),
    outputRoot = process.cwd(),
    generateScopedName = "default",
    runtimeModule = "packages/react-runtime",
    templateType = "typescript-source",
    _: inputs,
  } = args;

  if (!inputs.length) {
    throw new Error("Expected one or more files to be passed");
  }

  await cli({
    inputs,
    inputRoot,
    outputRoot,
    generateScopedName,
    runtimeModule,
    templateType,
  });
}
