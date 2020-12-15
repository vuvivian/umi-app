import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react';
import { Button, Modal, Tabs, Radio, Space, Menu, Switch, Input } from 'antd';
import {
  PlusCircleFilled,
  CloseOutlined,
  SmallDashOutlined,
} from '@ant-design/icons';

import { DomainContext } from './index';

import _ from 'underscore';
import styles from './index.less';

const DomainNode = ({ children, nodeData, className }) => {
  const [nodeClass, setNodeClass] = useState('add-tree-btn-hover');
  const [enterIcon, setEnterIcon] = useState('add_tree');
  const { changeDomain, addNode } = useContext(DomainContext);

  useEffect(() => {
    if (enterIcon === 'del_node') setNodeClass('del-btn-hover');
    if (enterIcon === 'add_leaf') setNodeClass('add-leaf-btn-hover');
    if (enterIcon === 'add_tree') setNodeClass('add-tree-btn-hover');
  }, [enterIcon]);

  const onBtnClick = option => {
    setEnterIcon(option);
    switch (option) {
      case 'del_node':
        setEnterIcon(option);
        nodeData.removeNode();
        changeDomain();
        break;
      case 'add_leaf':
        addNode(nodeData.key);
        break;
      case 'add_tree':
        addNode(nodeData.key, true);
        break;
      default:
        break;
    }
  };
  return (
    <div className={`${styles['std-domain-node']} ${className} ${nodeClass}`}>
      <div className={styles['std-domain-control-panel']}>
        <div
          className={styles['btn']}
          onClick={() => {
            onBtnClick('del_node');
          }}
        >
          <CloseOutlined />
        </div>
        <div
          className={styles['btn']}
          onClick={() => {
            onBtnClick('add_leaf');
          }}
        >
          <PlusCircleFilled />
        </div>
        <div
          class={styles['btn']}
          onClick={() => {
            onBtnClick('add_tree');
          }}
        >
          <SmallDashOutlined />
        </div>
      </div>
      {children}
    </div>
  );
};

export default DomainNode;
