import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const replaceInFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the image source
  let newContent = content.replace(/\/MahalCare_Logo\.png/g, '/mahal-al-shifa-logo.png');
  newContent = newContent.replace(/MahalCare_Logo\.png/g, 'mahal-al-shifa-logo.png');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (
        dirFile.endsWith('.jsx') || 
        dirFile.endsWith('.js') || 
        dirFile.endsWith('.html') || 
        dirFile.endsWith('.css') || 
        dirFile.endsWith('.json') ||
        dirFile.endsWith('.md')
      ) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const allFiles = walkSync(rootDir);
allFiles.forEach(replaceInFile);

console.log("Done updating logo path!");
