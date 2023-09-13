const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const folders = ['vectors', 'source/definitions', 'source/utils', 'source/classes', 'source/game'];

fs.writeFileSync('build/i.js', uglifyJS.minify(
  folders.map(dir => fs.readdirSync(dir).map(file => fs.readFileSync(path.join(dir, file), 'utf8')).join('')).join(''),
  { 
    toplevel: true,
    output: {
      comments: /^!/
    }
   }
).code);
