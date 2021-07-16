/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const [, , outputDir] = process.argv;

glob.sync("*/**/*", { cwd: "packages/templates" }).forEach((filePath) => {
  const outFile = path.resolve(process.cwd(), outputDir, filePath);
  const inFile = path.resolve(process.cwd(), "packages/templates", filePath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.copyFileSync(inFile, outFile);
});
