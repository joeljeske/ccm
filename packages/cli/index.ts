import minimist from "minimist";
import * as path from "path";
import { cli } from "./cli";

function help() {
  console.log(`
Usage:
  ccm [options] [...files]

Options:
  --inputRoot       Root directory of input files, for determining the
                    relative path to use when creating output files.
                    Default: cwd

  --outputRoot      Root directory of the output files. The output files
                    will be located in the outputRoot in the same directory
                    structure as the input source files.
                    Default: "$INPUT_ROOT/.ccm"

  --cssScoping      The strategy for scoping css class names and custom
                    properties.
                    One of: "default", "optimized"
                    - default: retains the original class name and appends
                      a unique hex suffix. Helps with readability
                    - optimized: use only a unique hex suffix resulting in
                      smaller css files
                    Default: "default"

  --templates       The type of CSS Component templates to use. Can use any
                    set of templates from "packages/templates" or
                    can be a path to a custom set of templates.
                    Default: "js"

Files:
  files             The set of CCM files to transform. Can be relative paths
                    from the output root, or can contain globs.
                    Default: "**/*.ccm.css"
`);
}

export async function main(rawArgs: string[]): Promise<void> {
  const args = minimist(rawArgs);

  if (args.help) {
    help();
    process.exit(1);
  }

  const {
    inputRoot = process.cwd(),
    outputRoot = path.resolve(process.cwd(), ".ccm"),
    cssScoping = "default",
    runtime = "packages/react-runtime",
    templates = "js",
    _: inputs,
  } = args;

  if (!inputs.length) {
    inputs.push("**/*.ccm.css");
  }

  await cli({
    inputs,
    inputRoot,
    outputRoot,
    cssScoping,
    runtime,
    templates,
  });
}
