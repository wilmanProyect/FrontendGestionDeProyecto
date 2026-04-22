import fs from 'fs';
import path from 'path';

const dir = './src/features/auth';
const extensions = ['.tsx', '.ts'];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Reemplazos de colores
      content = content.replace(/\bviolet-(300|400|500|600|900|950)\b/g, 'brand-$1');
      content = content.replace(/\bindigo-(300|500|600|900|950)\b/g, 'accent-$1');
      content = content.replace(/\bslate-(300|400|500|600|700|800|900|950)\b/g, 'surface-$1');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log('Reemplazo completado');
