import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import alias from '@rollup/plugin-alias';
import ccm from '@css-components/rollup';

export default {
  input: './src/index.jsx',
  output: {
    format: 'esm',
    dir: './public/dist',
  },
  plugins: [
    alias({
      entries: [
        {
          find: 'react',
          // eslint-disable-next-line no-undef
          replacement: require.resolve('react'),
        },
      ],
    }),
    ccm(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    nodeResolve({ extensions: ['.js', '.jsx'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    postcss({
      extract: true,
      plugins: [autoprefixer, cssnano],
      exclude: '**/*.ccm.css',
    }),
  ],
};
