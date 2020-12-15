/*
 * @Author: vuvivian
 * @Date: 2020-11-27 22:23:15
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-05 23:33:15
 * @Descripttion: DomainNode
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkflowDomain/js/DomainNode.js
 */
import _ from 'underscore';
import { uuid, findTree } from './util';

class DomainNode {
  key = 'domain_node_' + uuid();
  parent = null;
  type = ''; // 节点类型
  domain; // 节点的domain [&, ['a', '=', 1]]

  constructor(type, domain = []) {
    this.type = type;
    this.domain = domain;
  }

  setParent(parent) {
    this.parent = parent;
  }

  removeNode() {
    const parent = this.parent || this;
    const node = findTree([parent], { key: this.key });
    if (node) {
      if (node.parent) {
        const index = node.parent.children.findIndex(
          child => child.key === node.key,
        );
        if (index > -1) node.parent.children.splice(index, 1);
      } else {
        node.children = [];
      }
      parent.redraw();
    }
  }
}

export default DomainNode;
