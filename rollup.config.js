// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import jsonResolve from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

export default {
  banner: '#!/usr/bin/env node',
  input: 'asar/bin/asar.js',
  output: {
    file: 'dist/asar.js',
    format: 'umd'
  },
  plugins: [
    replace({
      delimiters: ['', ''],  
      '#!/usr/bin/env node': ''
    }),
    nodeResolve(),
    jsonResolve(),
    commonjs()
  ]
};