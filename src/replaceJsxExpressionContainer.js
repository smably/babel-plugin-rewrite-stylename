import {binaryExpression, isJSXExpressionContainer, isStringLiteral, jSXAttribute, jSXExpressionContainer, jSXIdentifier} from 'babel-types';
import conditionalClassMerge from './conditionalClassMerge';

export default (t, path, sourceAttribute, destinationName) => {
  const styleNameExpression = sourceAttribute.value.expression;
  const destinationAttribute = path.node.openingElement.attributes.find((attribute) => {
    return typeof attribute.name !== 'undefined' && attribute.name.name === destinationName;
  });

  if (destinationAttribute) {
    path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(destinationAttribute), 1);
  }

  path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(sourceAttribute), 1);

  if (destinationAttribute) {
    if (isStringLiteral(destinationAttribute.value)) {
      path.node.openingElement.attributes.push(
        jSXAttribute(
          jSXIdentifier(destinationName),
          jSXExpressionContainer(binaryExpression('+', t.stringLiteral(destinationAttribute.value.value + ' '), styleNameExpression))
        )
      );
    } else if (isJSXExpressionContainer(destinationAttribute.value)) {
      path.node.openingElement.attributes.push(
        jSXAttribute(jSXIdentifier(destinationName), jSXExpressionContainer(conditionalClassMerge(destinationAttribute.value.expression, styleNameExpression)))
      );
    } else {
      throw new Error('Unexpected attribute value: ' + destinationAttribute.value);
    }
  } else {
    path.node.openingElement.attributes.push(jSXAttribute(jSXIdentifier(destinationName), jSXExpressionContainer(styleNameExpression)));
  }
};
