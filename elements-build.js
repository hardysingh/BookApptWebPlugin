const concat = require('concat');
const fs = require('fs-extra');

(async function build() {
  const files = [
    './dist/WayuPlugin/runtime-es2015.js',
    './dist/WayuPlugin/polyfills-es2015.js',
    './dist/WayuPlugin/main-es2015.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/wayupluginwithslots.js');
  await fs.copyFile(
    './dist/WayuPlugin/styles.css',
    'elements/styles.css'
  );
})();
