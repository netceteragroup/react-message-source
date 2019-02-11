import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import { terser as minify } from 'rollup-plugin-terser';

import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    babel(),
    isProduction && minify(),
    resolve(),
    commonjs()
  ].filter(Boolean),
};
