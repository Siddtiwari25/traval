import fs from 'fs';
import path from 'path';

function listAllFiles(dir: string, depth = 0) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'dist') continue;
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      const indent = '  '.repeat(depth);
      if (stats.isDirectory()) {
        console.log(`${indent}[DIR] ${file}`);
        listAllFiles(fullPath, depth + 1);
      } else {
        console.log(`${indent}[FILE] ${file} (${stats.size} bytes)`);
      }
    }
  } catch (err) {
    console.error('Error reading dir:', dir, err);
  }
}

console.log('--- Workspace Files ---');
listAllFiles(process.cwd());
