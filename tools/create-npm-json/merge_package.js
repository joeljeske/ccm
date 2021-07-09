/* eslint-disable */

const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function main([outputFile, parentFile, partialFile]) {
  const parent = JSON.parse(await readFile(parentFile, 'utf8'));
  const partial = JSON.parse(await readFile(partialFile, 'utf8'));
  await writeFile(
    outputFile,
    JSON.stringify({
      ...parent,
      ...partial,
    }, null, 2),
    'utf8'
  );
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
