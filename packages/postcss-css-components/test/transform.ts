import * as fs from "fs";
import postcss from "postcss";
import ccmPostcssPlugin from "packages/postcss-css-components";

async function main([outputFile, inputFile]: string[]) {
  const inputCss = fs.readFileSync(inputFile, "utf8");
  const result = postcss([ccmPostcssPlugin()]).process(inputCss, {
    to: outputFile,
    from: inputFile,
  });
  fs.writeFileSync(outputFile, result.css);
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
