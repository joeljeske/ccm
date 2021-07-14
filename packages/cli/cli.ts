import { processCCM } from "packages/node-api";
import { promisify } from "util";
import glob from "glob";
import * as fs from "fs";
import * as path from "path";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Args {
  inputs: string[];
  inputRoot: string;
  outputRoot: string;
  templates: string;
  runtime: string;
  cssScoping: "optimized" | "default";
}

export const cli = async (args: Args): Promise<void> => {
  const absInputRoot = path.resolve(process.cwd(), args.inputRoot);
  const absOutputRoot = path.resolve(process.cwd(), args.outputRoot);

  const inputFilenames = await Promise.all(
    args.inputs.map<Promise<string[]>>(
      (input) =>
        new Promise((resolve, reject) =>
          glob(
            input,
            {
              cwd: absInputRoot,
            },
            (err, matches) => (err ? reject(err) : resolve(matches))
          )
        )
    )
  );
  const inputs = Array.from(new Set(inputFilenames.flat()));

  await Promise.all(
    inputs.map(async (input) => {
      try {
        const absInputFile = path.resolve(absInputRoot, input);
        const relInputFile = path.relative(absInputRoot, absInputFile);
        const relOutputDir = path.dirname(relInputFile);
        const absOutputDir = path.join(absOutputRoot, relOutputDir);

        const outputFiles = await processCCM({
          filename: relInputFile,
          generateScopedName: args.cssScoping,
          inputCSS: await readFile(absInputFile, "utf8"),
          runtime: args.runtime,
          templates: args.templates,
        });

        // Ensure parent dirs are made sync, avoid race conditions
        fs.mkdirSync(absOutputDir, { recursive: true });

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
