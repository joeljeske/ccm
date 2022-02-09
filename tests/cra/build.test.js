const path = require('path');
const fs = require('fs');

function walk(dir) {
  const files = [];
  for (const file of fs.readdirSync(dir)) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      for (const child of walk(path.join(dir, file))) {
        files.push(`${file}/${child}`);
      }
    } else {
      files.push(file);
    }
  }
  return files;
}

it('should match files in build', () => {
  const files = walk(path.resolve(__dirname, 'build'));
  expect(files).toEqual([
    'asset-manifest.json',
    'favicon.ico',
    'index.html',
    'logo192.png',
    'logo512.png',
    'manifest.json',
    'robots.txt',
    'static/css/main.fcdb2fb5.css',
    'static/css/main.fcdb2fb5.css.map',
    'static/js/89.44b870e8.chunk.js',
    'static/js/89.44b870e8.chunk.js.map',
    'static/js/main.148de774.js',
    'static/js/main.148de774.js.LICENSE.txt',
    'static/js/main.148de774.js.map',
    'static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg',
  ]);
});
