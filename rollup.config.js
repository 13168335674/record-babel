import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/main.js",
  output: {
    file: "./build/main.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs({}),
  ],
};
