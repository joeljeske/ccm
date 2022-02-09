const path = require('path');
const fs = require('fs');

it('should match files in build', () => {
  const files = fs.readdirSync(path.resolve(__dirname, 'build'));
  expect(files).toEqual(['index-61fe771e.css', 'index-61fe771e.js']);
});
