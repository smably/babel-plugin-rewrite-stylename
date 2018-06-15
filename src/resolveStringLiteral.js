import {isJSXExpressionContainer, isStringLiteral, stringLiteral} from 'babel-types';
import conditionalClassMerge from './conditionalClassMerge';

/**
 * Updates the className value of a JSX element using a provided styleName attribute.
 */
export default (path, sourceAttribute, destinationName) => {
  const resolvedStyleName = sourceAttribute.value.value;

  const destinationAttribute = path.node.openingElement.attributes.find((attribute) => {
    return typeof attribute.name !== 'undefined' && attribute.name.name === destinationName;
  });

  if (destinationAttribute) {
    if (isStringLiteral(destinationAttribute.value)) {
      destinationAttribute.value.value += ' ' + resolvedStyleName;
    } else if (isJSXExpressionContainer(destinationAttribute.value)) {
      destinationAttribute.value.expression = conditionalClassMerge(destinationAttribute.value.expression, stringLiteral(resolvedStyleName));
    } else {
      throw new Error('Unexpected attribute value:' + destinationAttribute.value);
    }

    path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(sourceAttribute), 1);
  } else {
    sourceAttribute.name.name = destinationName;
    sourceAttribute.value.value = resolvedStyleName;
  }
};
