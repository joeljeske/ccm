import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import ccm from '@css-components/rollup';

export default {
  input: './src/index.jsx',
  output: { format: 'esm' },
  external: ['react', '@babel/runtime'],
  plugins: [
    ccm(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
    nodeResolve({ extensions: ['.js', '.jsx'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    postcss({
      extract: true,
      minimize: false,
      exclude: '**/*.ccm.css',
    }),
  ],
};
