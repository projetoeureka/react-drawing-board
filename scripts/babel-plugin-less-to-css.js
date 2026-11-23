// Consumers of lib/ (SGLearner's webpack) have no less-loader, so style imports must point at the
// .css files that scripts/build-styles.js emits next to each module.
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
