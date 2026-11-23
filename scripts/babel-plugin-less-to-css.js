// Quem consome o lib/ empacota sem loader de less, então cada import de estilo precisa apontar
// para o .css compilado ao lado do módulo.
module.exports = function lessToCss() {
  return {
    name: 'less-to-css',
    visitor: {
      ImportDeclaration(nodePath) {
        const source = nodePath.node.source;
        if (source.value.endsWith('.less')) {
          source.value = source.value.replace(/\.less$/, '.css');
        }
      },
    },
  };
};
