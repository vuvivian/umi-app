/*
 * @Author: vuvivian
 * @Date: 2020-11-27 23:29:16
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-10 02:14:59
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkDomain/js/DomainTree.js
 */
import _ from 'underscore';
import DomainNode from './DomainNode';
import DomainLeaf from './DomainLeaf';
import { uuid, findTree } from './util';

class DomainTree extends DomainNode {
  operator = ''; // 树的规则符号 AND | OR
  children = []; // 树的子节点  <DomainTree | DomainLeaf>

  constructor(domain, options) {
    super('tree', domain);
    this.options = options;
    this._initChildren(this.domain);
    this._initDefaults(options);
  }

  addChildren(node) {
    this.children.push(node);
    node.setParent(this);
  }

  /**
   * 增加节点
   * @param {*} key
   * @param {*} branch
   */
  addNode(key, branch = false) {
    const node = findTree([this], { key });
    let parent = this,
      index = -1,
      domain = this.default;

    if (node) {
      parent = node.parent || this;
      if (branch)
        domain = [parent.operator === '&' ? '|' : '&']
          .concat(domain)
          .concat(domain);
      index = parent.children.findIndex(child => child.key === node.key);
    }

    const newNode = instantiateNode(domain, this.options);
    if (index > -1) {
      parent.children.splice(index + 1, 0, newNode);
    } else {
      parent.children.push(newNode);
    }
    newNode.setParent(parent);
  }

  /**
   * 重新计算该树的节点
   * 注意该操作非常耗性能 它会改变子节点的所有key， 造成所有子节点组件重绘一遍
   * 重绘优化 -- 父节点重绘，不用从跟根节点开始   ['&']
   */
  redraw(domain, isForce = false) {
    let node = this.parent || (this.hasTreeChild() ? this : null);
    if (isForce) node = node || this;
    node && node._redraw(domain);
  }

  /**
   * 更新默认的domain
   * @param {*} defaultVal
   */
  updateDefault(defaultVal) {
    this.options.defaultValue = defaultVal;
    this.default = [[defaultVal, '=', '', '0']];
  }

  /**
   * 重绘树节点
   */
  _redraw(domain) {
    domain = domain || this.getDomain();
    if (domain.length <= 1) {
      domain = ['&'].concat(domain);
    }
    this._initChildren(domain);
  }

  /**
   * 根据子domain添加节点，如果子树节点的操作符号和当前树相等
   * 将会合并子树的儿子节点到当前
   * @param {*} domain
   */
  _addFlattenedChildren(domain) {
    let node = instantiateNode(domain, this.options);
    if (node === null) return;

    if (!node.children || node.operator !== this.operator) {
      this.addChildren(node);
      return;
    }

    _.each(node.children, child => {
      this.addChildren(child);
    });
    node = null;
  }

  /**
   * 初始化children
   * @param {*} domain
   */
  _initChildren(domain) {
    this.operator = domain[0];
    this.children = [];
    if (domain.length <= 1) return;

    // 根据domain构建树
    let nbLeafsToFind = 1;
    for (let i = 1; i < domain.length; i++) {
      if (domain[i] === '&' || domain[i] === '|') {
        nbLeafsToFind++;
      } else {
        nbLeafsToFind--;
      }

      if (!nbLeafsToFind) {
        const left = domain.slice(1, i + 1);
        const right = domain.slice(i + 1);
        if (left.length) {
          this._addFlattenedChildren(left);
        }
        if (right.length) {
          this._addFlattenedChildren(right);
        }
        break;
      }
    }
  }

  _initDefaults(options) {
    const { defaultValue } = options;
    if (defaultValue) {
      this.default = [[defaultValue, '=', '', '0']];
    } else {
      this.default = [['id', '=', '', '0']];
    }
  }

  /**
   * 获取domain
   */
  getDomain() {
    let childDomains = [];
    let nbChildren = 0;
    _.each(this.children, child => {
      const childDomain = child.getDomain();
      if (childDomain.length) {
        nbChildren++;
        childDomains = childDomains.concat(childDomain);
      }
    });
    const operators = _.times(nbChildren - 1, _.constant(this.operator));
    return operators.concat(childDomains);
  }

  hasTreeChild() {
    return this.children.find(ch => ch.type === 'tree');
  }

  //获取条件表达式
  getScript(script = '', fieldsData, from) {
    _.each(this.children, (child, index) => {
      let firstLeaf = _.filter(this.children, item => {
        return item.type === 'leaf';
      });
      let operator = this.operator === '&' ? ' && ' : ' || ';
      let leftcontail = '(';
      let rightcontail = ')';
      if (child.type === 'leaf') {
        script =
          script +
          (index === 0 ? leftcontail : '') +
          this.getExpKey(child.chain) +
          ' ' +
          this.getExpOperator(child.operator) +
          this.getExpValue(child, fieldsData) +
          (index === firstLeaf.length - 1 ? rightcontail : '') +
          (index === firstLeaf.length - 1 ? '' : operator);
      } else {
        script = child.getScript(script + operator, fieldsData, 'self');
      }
    });
    if (script) {
      return from ? script : '${' + script + '}';
    } else {
      return '';
    }
  }

  //操作符转换
  getExpOperator(operator) {
    let expOperator;
    switch (operator) {
      case '=':
        expOperator = '==';
        break;
      case '!=':
        expOperator = '!=';
        break;
      default:
        expOperator = operator;
    }
    return expOperator;
  }

  //键转换（将.转成$）
  getExpKey(key) {
    return key.split('.').join('$');
  }

  //值处理，boolean类型的值不加‘’
  getExpValue(child, lists) {
    let obj = _.find(lists, list => {
      return child.chain === list.value;
    });
    if (obj && obj.type === 'boolean') {
      return child.value;
    } else if (obj && obj.type === 'text' && _.isBoolean(child.value)) {
      //处理为空，不为空的情况
      return 'null';
    } else {
      return '"' + child.value + '"';
    }
  }
}

function instantiateNode(domain, options = {}) {
  if (domain.length > 1) {
    return new DomainTree(domain, options);
  } else if (domain.length === 1) {
    return new DomainLeaf(domain, options);
  }
  return null;
}

export default DomainTree;
