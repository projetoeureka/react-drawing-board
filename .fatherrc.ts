import path from 'path';
import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    input: 'src',
    output: 'lib',
    transformer: 'babel',
    // father 4 bundless copies .less as-is; scripts/build-styles.js compiles them to .css.
    ignores: ['src/**/*.less'],
  },
  extraBabelPlugins: [path.resolve(__dirname, 'scripts/babel-plugin-less-to-css.js')],
});
