const fs = require('fs');
const path = require('path');

const ROOT = process.env.PROJECT_ROOT || __dirname;
const thisPath = p => path.join(ROOT, p);

console.log('ROOT', ROOT);

const findStoriesFiles = function findStoriesFiles(dirPath, collection = []) {
  const list = fs.readdirSync(dirPath);
  list.forEach((way) => {
    const maybeFile = path.join(dirPath, way);
    const isDir = fs.statSync(maybeFile).isDirectory();
    if (isDir) {
      findStoriesFiles(maybeFile, collection);
    } else if (/story\.js/.test(maybeFile)) {
      collection.push(maybeFile);
    }
  });

  return collection;
};

const makeTemplate = (files) => {
  const importedFiles = files
    .map(el => (`.${el.replace(thisPath('./app'), '').replace(/\\/g, '/').replace('.js', '')}`))
    .map((file, i) => ({ name: `story${i + 1}`, content: `import story${i + 1} from '${file}';` }));
  const importTemplate = importedFiles.map(el => el.content).join('\n');
  const exportTemplate = importedFiles.map(el => el.name).join(', ');

  return `${importTemplate}\n\nexport default [${exportTemplate}];\n`;
};

console.log('Searhing story files...');
const storyFiles = findStoriesFiles(thisPath('./app/pods/components'));
console.log('--- Detected stories ---');
console.log(storyFiles);
const template = makeTemplate(storyFiles);
console.log(`${storyFiles.length} Stories successfully created --`);

fs.writeFileSync(thisPath('app/stories.js'), template);
