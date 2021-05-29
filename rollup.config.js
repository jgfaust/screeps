"use strict";

import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import screeps from 'rollup-plugin-screeps';

let cfg;
const dest = process.env.DEST;
if(!dest) {
   console.log("No destination specified - code will be compiled but not uploaded");
} else if((cfg = require("./screeps.json")[dest]) == null) {
   throw new Error("Invalid upload destination");
}

export default {
   input: "src/main.ts",
   output: {
      file: "dist/main.js",
      format: "cjs",
      sourcemap: true
   },

   plugins: [
      del({verbose: true, targets: ["dist/*"]}),
      resolve({rootDir: "src"}),
      commonjs(),
      typescript({tsconfig: "./tsconfig.json"}),
      screeps({config: cfg, dryRun: cfg == null}),
      copy({ hook: 'closeBundle', verbose: true, targets: [{src: 'dist/*.js', dest: 'deploy/'}]}),
      copy({ hook: 'closeBundle', verbose: true, targets: [{src: 'dist/*.js', dest: '../private-link'}]}),
   ]
};