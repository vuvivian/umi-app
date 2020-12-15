/*
 * @Author: vuvivian
 * @Date: 2020-11-27 22:22:47
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-06 21:24:54
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkDomain/js/DomainLeaf.js
 */
import DomainNode from './DomainNode';

class DomainLeaf extends DomainNode {
  chain = ''; // 字段名路径
  operator = ''; // 规则符号
  value;

  constructor(domain, options) {
    super('leaf', domain);

    this.chain = domain[0][0]; // 'name' | 'line_ids.name'
    this.operator = domain[0][1]; // '='
    this.value = domain[0][2];
    this.valueType = domain[0][3] || '0';
    this.isDomain = options.isDomain;

    this._initFieldKey(options);
  }

  _initFieldKey({ fieldsData }) {
    // this.fieldsData = this.isDomain ? store.state.model.fields : fieldsData;
    this.fieldsData = fieldsData;
    const selectField = this._getSelectField(this.chain);
    this.longKey = selectField ? selectField.longKey : '';
  }

  // 获取选择的字段
  _getSelectField(chain) {
    chain = chain.split('.');
    let res,
      arr = this.fieldsData;
    for (let ch of chain) {
      res = arr.find(item => item.name === ch || item.value === ch);
      if (res && res.children) {
        arr = res.children;
      } else {
        res = {};
        break;
      }
    }
    return res;
  }

  getDomain() {
    let domain = this._getDomain();

    if (this.longKey) {
      const chains = this.chain.splite('.');
      const keys = this.longKey.splite('/').splite(-chains.length);
      // const refs = call('reference', 'get', keys); ??
      const refs = false;
      const prop = this.isDomain ? (this.valueType == 1 ? '2' : '') : '0';
      if (refs && refs.length && prop) {
        Object.defineProperty(domain, prop, {
          get() {
            let res = refs.map(ref => ref.value);
            if (chains[0] === 'parent') {
              res.unshift('parent');
            }
            return res.join('.');
          },
        });
      }
    }

    return [domain];
  }

  _getDomain() {
    return [this.chain, this.operator, this.value, this.valueType];
  }
}

export default DomainLeaf;
