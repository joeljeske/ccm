import { processCCM } from "packages/node-api";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Args {
  inputs: string[];
  inputRoot: string;
  outputRoot: string;
  templateType: string;
  runtimeModule: string;
  generateScopedName: "optimized" | "default";
}

export const cli = async (args: Args): Promise<void> => {
  const absInputRoot = path.resolve(process.cwd(), args.inputRoot);
  const absOutputRoot = path.resolve(process.cwd(), args.outputRoot);

  await Promise.all(
    args.inputs.map(async (input) => {
      try {
        const absInputFile = path.resolve(absInputRoot, input);
        const relInputFile = path.relative(absInputRoot, absInputFile);
        const relOutputDir = path.dirname(relInputFile);
        const absOutputDir = path.join(absOutputRoot, relOutputDir);

        const outputFiles = await processCCM({
          filename: relInputFile,
          generateScopedName: args.generateScopedName,
          inputCSS: await readFile(absInputFile, "utf8"),
          runtimeModule: args.runtimeModule,
          templateType: args.templateType,
        });

        await Promise.all(
          outputFiles.map(({ filename, contents }) =>
            writeFile(path.join(absOutputDir, filename), contents)
          )
        );
      } catch (err) {
        console.error(`[CCM] Error processing file ${input}`);
        console.error(err);
        throw err;
      }
    })
  );
};
