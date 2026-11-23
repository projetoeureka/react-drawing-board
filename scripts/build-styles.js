const fs = require('fs');
const path = require('path');
const less = require('less');

const srcDir = path.resolve(__dirname, '../src');
const libDir = path.resolve(__dirname, '../lib');

function findLessFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findLessFiles(fullPath);
    return entry.name.endsWith('.less') ? [fullPath] : [];
  });
}

async function main() {
  for (const file of findLessFiles(srcDir)) {
    const { css } = await less.render(fs.readFileSync(file, 'utf-8'), { filename: file });
    const outFile = path.join(libDir, path.relative(srcDir, file)).replace(/\.less$/, '.css');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, css);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
