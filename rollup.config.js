import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
  entry: 'src/js/app.js',
  dest: 'public/js/app.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs({}),
    css({ output: 'public/css/bundle.css' })
  ]
};