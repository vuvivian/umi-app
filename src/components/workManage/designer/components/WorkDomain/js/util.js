/*
 * @Author: vuvivian
 * @Date: 2020-11-27 22:30:16
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-05 22:36:51
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkflowDomain/js/util.js
 */

import _ from 'underscore';
/**
 * 获取固定长度的uuid
 * @param {*} len
 */
export const uuid = (len = 6) => {
  const scopes = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  let res = '';
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * 62);
    res += scopes[index];
  }
  return res;
};

export const findTree = (items, attrs, sonField = 'children') => {
  if (!_.isFunction(attrs) && _.isEmpty(attrs)) {
    return null;
  }

  let node = null;
  let callback = _.iteratee(attrs);
  let level = 0;

  // 递归查找子级所有节点
  while (items && items.length) {
    let children = [];
    level++;

    node = _.find(items, item => {
      children = children.concat(item[sonField] || []);

      return callback(item, level);
    });

    if (node) {
      break;
    }

    items = children;
  }

  return node;
};

// export const findTree = (items, attrs, sonField = 'children') => {
//   if (!_.isFunction(attrs) && _.isEmpty(attrs)) {
//     return null;
//   }

//   let node = null;
//   let callback = _.iteratee(attrs);
//   let level = 0;

//   // 递归查找子级所有节点
//   while (items && items.length) {
//       let children = [];
//       level++;

//       node = _.find(items, item => {
//         children = children.concat(item[sonField] || []);

//         return callback(item, level);
//       });

//       if (node) {
//         break;
//       }

//       items = children;
//   }

//   return node;
// };

/**
 * 遍历重组字段
 * @param {Array} fields
 * @param {Number} depth
 */
export const _getFieldsData = (
  fields = [],
  parent,
  isEnd = false,
  sonField = 'children',
  thisModel,
) => {
  let newFields = [];
  // let sonField = sonField ;
  // let thisModel = thisModel ;

  _.isArray(fields) &&
    fields.forEach(field => {
      if (!field.name) {
        return;
      }

      const parentType = getFieldType(parent) || 'one2many';
      const expandMany = this.expandAll || this.expandMore;
      const expandOne = this.expandAll || !this.expandMore;
      let newField = {
        ...field,
        value: field.name,
        label: this.showName
          ? `${field.string}（${field.name}）`
          : field.string,
        model: parentType === 'one2many' ? field.model : parent.model,
        level: parent ? parent.level + 1 : 1,
        longName: parent ? parent.longName + '.' + field.name : field.name,
        longString: parent
          ? parent.longString + '/' + field.string
          : field.string,
        [sonField]: [],
      };

      // 在中间做次过滤，避免多次循环 todo
      if (this.hasField && !this.hasField(newField)) {
        return;
      }

      if (field.type === 'many2many' || field.type === 'many2one') {
        if (expandMany && this.moreModels && field.relation && !isEnd) {
          // 先查当前模型是否有模型数据
          let model = _.find(thisModel, { key: field.relation });

          if (model) {
            // 主模型字段
            newField[sonField] = this._getFieldsData(
              model.fields,
              newField,
              true,
            );
          } else {
            // 再查more模型
            model = _.find(this.moreModels, { key: field.relation });
            model &&
              (newField[sonField] = this._getFieldsData(
                model.fields,
                newField,
                true,
              ));
          }
        }
      } else if (
        expandOne &&
        field.fields &&
        (!this.depth || newField.level <= this.depth)
      ) {
        // 加载one2many的子字段
        newField[sonField] = this._getFieldsData(field.fields, newField);
      }

      newFields.push(newField);
    });
  return newFields;
};

export const getFieldType = field => {
  return field
    ? field.type === 'related'
      ? field.options && field.options.relatedType
      : field.type
    : null;
};
