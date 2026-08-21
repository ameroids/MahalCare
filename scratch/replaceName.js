import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const replaceInFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Exclude changing the image file name string
  // but change the text.
  // E.g. "MahalCare" -> "Mahal al Shifa"
  // "Mahal-us-Shifa" -> "Mahal al Shifa"
  
  // We should be careful about MahalCare_Logo.png. We don't want it to become "Mahal al Shifa_Logo.png".
  // So we first replace "MahalCare_Logo.png" with a placeholder.
  newContent = newContent.replace(/MahalCare_Logo\.png/g, '___LOGO_PLACEHOLDER___');
  newContent = newContent.replace(/mahal-us-shifa-appointment-system/g, '___PACKAGE_NAME_PLACEHOLDER___');
  
  newContent = newContent.replace(/MahalCare/g, 'Mahal al Shifa');
  newContent = newContent.replace(/Mahal-us-Shifa/g, 'Mahal al Shifa');
  newContent = newContent.replace(/Mahal us Shifa/g, 'Mahal al Shifa');
  
  newContent = newContent.replace(/___LOGO_PLACEHOLDER___/g, 'MahalCare_Logo.png');
  newContent = newContent.replace(/___PACKAGE_NAME_PLACEHOLDER___/g, 'mahal-us-shifa-appointment-system');
  
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

console.log("Done updating app name!");
