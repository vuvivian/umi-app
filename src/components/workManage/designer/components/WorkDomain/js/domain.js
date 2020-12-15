/*
 * @Author: vuvivian
 * @Date: 2020-11-27 22:16:44
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-27 22:21:18
 * @Descripttion:
 * @FilePath: /umi-app/src/components/ProcessDesigner/components/workDomainSet/js/domain.js
 */
import _ from 'underscore';

const operator_mapping = {
  '=': '=',
  '!=': '!=',
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  ilike: '包含',
  'not ilike': '不含',
  in: '在',
  'not in': '不在',
  // custom
  set: '不为空',
  'not set': '为空',
};

// 根据字段获取operators
export const getOperatorsFromType = (type = 'char', isDomain) => {
  let operators;
  switch (type) {
    case 'boolean':
      operators = { '=': '=' };
      break;
    case 'char':
    case 'text':
    case 'html':
      operators = _.pick(
        operator_mapping,
        '=',
        '!=',
        'ilike',
        'not ilike',
        'in',
        'not in',
        'set',
        'not set',
      );
      break;
    case 'many2many':
    case 'one2many':
    case 'many2one':
      operators = _.pick(
        operator_mapping,
        '=',
        '!=',
        'ilike',
        'not ilike',
        'set',
        'not set',
      );
      break;
    case 'integer':
    case 'float':
    case 'monetary':
      operators = _.pick(
        operator_mapping,
        '=',
        '!=',
        '>',
        '<',
        '>=',
        '<=',
        'ilike',
        'not ilike',
        'in',
        'not in',
        'set',
        'not set',
      );
      break;
    case 'selection':
      operators = _.pick(
        operator_mapping,
        '=',
        '!=',
        'in',
        'not in',
        'set',
        'not set',
      );
      break;

    case 'date':
    case 'datetime':
      operators = _.pick(
        operator_mapping,
        '=',
        '!=',
        '>',
        '<',
        '>=',
        '<=',
        'set',
        'not set',
      );
      break;
    default:
      operators = _.pick(operator_mapping, '=', 'set', 'not set');
      break;
  }

  if (!isDomain) {
    delete operators['ilike'];
    delete operators['not ilike'];
  }

  return operators;
};
