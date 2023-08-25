const path = require("path");
const fs = require("fs");

const files = [];
function recursiveFileDrill(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const currPath = path.join(dir, file);
        if (fs.statSync(currPath).isDirectory()) return recursiveFileDrill(currPath);
        else return files.push({
            path: currPath,
            file, 
        });
    });
}

function nonRecursiveFileDrill(dir) {
    const result = [];
    const acc = [];
    acc.push(dir);
    while (acc.length > 0) {
      fs.readdirSync(acc[0]).forEach((file) => {
          const currPath = path.join(acc[0], file);
          if (fs.statSync(currPath).isDirectory()) return acc.push(currPath);
          return result.push({
              path: currPath,
              file, 
          });
      });
      acc.shift();
    }
    return result;
  };

recursiveFileDrill("/Users/alfredothill/POC/node/recursion");
console.log(files);
console.log(nonRecursiveFileDrill("/Users/alfredothill/POC/node/recursion"));
