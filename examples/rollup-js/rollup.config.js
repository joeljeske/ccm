import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import ccm from "./ccm-plugin";

export default {
  input: "./src/index.jsx",
  output: {
    dir: "./public/dist",
    format: "esm",
  },
  plugins: [
    ccm(),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    nodeResolve({ extensions: [".js", ".jsx"] }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    postcss({
      extract: true,
      plugins: [autoprefixer, cssnano],
    }),
  ],
};
