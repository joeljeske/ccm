import { processCCM } from 'packages/node-api';
import { promisify } from 'util';
import _glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const glob = promisify(_glob);

export interface Args {
  watch: boolean;
  watchOnlyChanges: boolean;
  inputs: string[];
  inputRoot: string;
  outputRoot: string;
  templates: string;
  runtime: string;
  cssScoping: 'optimized' | 'default';
}

export const cli = async (args: Args): Promise<void> => {
  const absInputRoot = path.resolve(process.cwd(), args.inputRoot);
  const absOutputRoot = path.resolve(process.cwd(), args.outputRoot);

  // Shared utility to process a single file
  const processFile = async (input: string) => {
    try {
      console.log(`[CCM] Processing File ${input}`);
      const absInputFile = path.resolve(absInputRoot, input);
      const relInputFile = path.relative(absInputRoot, absInputFile);
      const relOutputDir = path.dirname(relInputFile);
      const absOutputDir = path.join(absOutputRoot, relOutputDir);

      const outputFiles = await processCCM({
        filename: relInputFile,
        generateScopedName: args.cssScoping,
        inputCSS: await readFile(absInputFile, 'utf8'),
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
      if (err instanceof Error && err.name === 'CssSyntaxError') {
        console.error(err.toString());
        throw null;
      }
      throw err;
    }
  };

  if (args.watch) {
    await buildWatch(args, absInputRoot, processFile);
  } else {
    await buildOnce(args, absInputRoot, processFile);
  }
};

const buildOnce = async (
  args: Args,
  cwd: string,
  processFile: (file: string) => Promise<void>
) => {
  const inputFilenames = await Promise.all(
    args.inputs.map((input) => glob(input, { cwd }))
  );
  const distinctFiles = new Set(inputFilenames.flat());
  await Promise.all(Array.from(distinctFiles, processFile));
};

const buildWatch = async (
  args: Args,
  cwd: string,
  processFile: (file: string) => Promise<void>
) => {
  // Lazy import the file watcher
  const chokidar = await import('chokidar');

  // Promise that resolves when all current work is finished.
  let work: Promise<any> = Promise.resolve();
  const processFileWithWork = (file: string) =>
    // Work is finished when it and the new file is finished
    (work = Promise.all([work, processFile(file)]).then(
      () => null,
      () => null
    ));

  const watcher = chokidar
    .watch(args.inputs, {
      cwd,
      ignoreInitial: args.watchOnlyChanges,
    })
    .on('add', processFileWithWork)
    .on('change', processFileWithWork);

  console.log(`[CCM] Watching for file changes...`);

  const cleanup = async () => {
    try {
      console.log('[CCM] Shutting down...');
      await watcher.close();
      await work;
    } finally {
      process.exit();
    }
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};
