import path from 'path';
import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    input: 'src',
    output: 'lib',
    transformer: 'babel',
    // A plataforma node (padrão do cjs no father 4) mira o node 14 e mantém sintaxe como `?.`,
    // que quem empacota o lib/ com webpack 4 não consegue ler; browser mira o ie 11.
    platform: 'browser',
    // O bundless do father 4 copia o .less sem compilar; o build-styles.js gera o .css.
    ignores: ['src/**/*.less'],
  },
  extraBabelPlugins: [path.resolve(__dirname, 'scripts/babel-plugin-less-to-css.js')],
});
