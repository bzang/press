#!/usr/bin/env node

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const vueCompiler = require('vue-template-compiler');
const {transform} = require('@babel/core');
const glob = require('glob');

const CJS = process.env.BUILD_TARGET === 'cjs';

(async function run() {
  try {
    const files = glob.sync('**/*.vue', {cwd: path.resolve(__dirname, 'src')});

    for (const file of files) {
      await compile(file);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();

async function compile(file) {
  const inPath = path.resolve(__dirname, 'src', file);
  const outFile = path.resolve(__dirname, 'dist', CJS ? 'cjs' : 'esm', file);
  const outDir = path.dirname(outFile);

  mkdirp.sync(outDir);

  const {script, styles, template} = vueCompiler.parseComponent(
    fs.readFileSync(inPath, 'utf-8')
  );

  const {code} = await transform(script.content);

  fs.writeFileSync(outFile, toSfc(styles, template.content, code));
}

function toSfc(styles, template, code) {
  return `<template>
  ${template
    .split('\n')
    .join('\n  ')
    .trim()}
</template>

<script>
${code}
</script>

${styles
    .map(
      (style) =>
        `<style${_.get(style, 'attrs.scoped') ? ' scoped' : ''}>${
          style.content
        }</style>`
    )
    .join('\n\n')}
`;
}
