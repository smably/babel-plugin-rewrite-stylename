import {binaryExpression, conditionalExpression, stringLiteral} from 'babel-types';

export default (classNameExpression, styleNameExpression) => {
  return binaryExpression(
    '+',
    conditionalExpression(classNameExpression, binaryExpression('+', classNameExpression, stringLiteral(' ')), stringLiteral('')),
    styleNameExpression
  );
};
