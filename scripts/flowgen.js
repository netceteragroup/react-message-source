const fs = require('fs');
const glob = require('glob');
const { compiler, beautify } = require('flowgen');

console.group('Generating flow type definitions...');

const typeScriptDefinitions = glob.sync('dist/**/*.d.ts', {
  absolute: true,
});

typeScriptDefinitions.forEach(path => {
  console.log('Transpiling flow type definitions from:', path);
  fs.writeFileSync(
    path.replace('.d.ts', '.js.flow'),
    beautify(
      `// @flow

        ${compiler.compileDefinitionFile(path)}
      `,
    ),
  );
});

console.log('Finished!');
console.groupEnd();
