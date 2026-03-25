import fs from 'fs';

function replaceImages(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace unsplash URLs with picsum.photos using a hash of the original ID as seed
  content = content.replace(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\?[^"']+/g, (match, id) => {
    return `https://picsum.photos/seed/${id.substring(0, 8)}/1000/600`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceImages('src/constants.ts');
replaceImages('src/App.tsx');
console.log('Images replaced');
