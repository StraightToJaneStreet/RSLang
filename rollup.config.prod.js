import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-import-css';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    css(),
    babel({
      sourceMaps: 'both',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      plugins: ['@babel/plugin-transform-typescript'],
    }),
    nodeResolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    commonjs(),
  ],
};
