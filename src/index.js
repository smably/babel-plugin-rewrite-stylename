import babelPluginJsxSyntax from 'babel-plugin-syntax-jsx';
import resolveStringLiteral from './resolveStringLiteral';
import replaceJsxExpressionContainer from './replaceJsxExpressionContainer';

const optionsDefaults = {
  attributeNames: {
    styleName: 'className'
  }
};

export default ({types: t}) => {
  return {
    inherits: babelPluginJsxSyntax,
    visitor: {
      JSXElement (path, stats) {
        let attributeNames = optionsDefaults.attributeNames;

        if (stats.opts && stats.opts.attributeNames) {
          attributeNames = Object.assign({}, attributeNames, stats.opts.attributeNames);
        }

        const attributes = path.node.openingElement.attributes.filter((attribute) => {
          return typeof attribute.name !== 'undefined' && typeof attributeNames[attribute.name.name] === 'string';
        });

        if (attributes.length === 0) {
          return;
        }

        for (const attribute of attributes) {
          const destinationName = attributeNames[attribute.name.name];

          if (t.isStringLiteral(attribute.value)) {
            resolveStringLiteral(path, attribute, destinationName);
          } else if (t.isJSXExpressionContainer(attribute.value)) {
            replaceJsxExpressionContainer(t, path, attribute, destinationName);
          }
        }
      }
    }
  };
};
