/*
 * @Author: vuvivian
 * @Date: 2020-11-28 12:22:02
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-06 23:07:53
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkDomain/DomainTree.jsx
 */

import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react';
import { Select } from 'antd';

import DomainLeaf from './DomainLeaf';
import DomainNode from './DomainNode';
import styles from './index.less';

const DomainTree = ({
  nodeData = {
    key: '',
    operator: '',
    children: [],
    chain: '',
    value: '',
    type: 'leaf',
  },
  propData,
}) => {
  return (
    <DomainNode className="std-domain-tree" nodeData={nodeData}>
      <div className={styles['std-tree-header']}>
        <Select
          defaultValue="AND"
          style={{ width: 160 }}
          bordered={false}
          className={styles['std-tree-header-select']}
        >
          <Select.Option value="AND">满足下面所有条件</Select.Option>
          <Select.Option value="OR">满足下面任意条件</Select.Option>
        </Select>
      </div>
      <div class={styles['std-domain-children-container']}>
        {nodeData.children.map((child, index) => {
          if (child.type === 'leaf') {
            return (
              <DomainLeaf
                key={child.index}
                nodeData={child}
                propData={propData}
                selectFieldsData={child.fieldsData}
              ></DomainLeaf>
            );
          } else {
            return (
              <DomainTree
                key={child.index}
                nodeData={child}
                propData={propData}
              ></DomainTree>
            );
          }
        })}
      </div>
    </DomainNode>
  );
};

export default DomainTree;
