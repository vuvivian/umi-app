import React, { useEffect, useCallback, useRef, useState, createContext } from 'react';
import { Button, Modal,Tabs, Radio, Space,  Menu, Switch, Input } from 'antd';
import { DeleteOutlined , DownOutlined, PlusOutlined} from '@ant-design/icons';
import DomainTree from './components/DomainTree';
import DomainLeaf from './components/DomainLeaf';
import ListInfo from './components/Demo';
import styles from './index.less';
import _ from 'underscore';
import e from 'express';

const data = [
  {date: '今天1', time: '11:20', name: 'Matt', content: '你好', avatar: ''},
  {
    date: '今天2', time: '11:20', name: 'Jenny', content: '你好', avatar: '',
      subComment: [
          { time: '11:20',name: 'Sal', content: '你好', avatar: ''},
          { time: '11:20',name: 'Jenny', content: '你好', avatar: ''},
          { time: '11:20',name: 'Elliot', content: '你好', avatar:''},
          { time: '11:20',name: 'Molly', content: '你好', avatar: ''}
      ]
  },
  {date: '今天3', time: '11:20', name: 'Molly', content: '你好', avatar:''},
];


const WorkDomain = ({}) => {
  const [treeNode, usetreeNode] = useState({})

  // 新增叶子节点
  const addLeaf = () => {
    data.push({
      date: '今天7', time: '11:20', name: 'Matt', content: '你好', avatar: ''
    })
  };

  // 删除叶子节点
  const removeLeaf = () => {

  };

  // 新增孩子
  const addChild =() => {

  };

  return (
    <div>
      <div className={styles.domainContainer}>
        <div className={styles.addFilter}><PlusOutlined /> 添加过滤条件</div>
        <div class={styles.domainSelector}>
          {
            data.map((item, index) => {
              if (item.subComment) {
                return (<DomainTree key={index} {...item}></DomainTree>)
              } else {
                return <DomainLeaf key={index} {...item} addLeaf={addLeaf} removeLeaf={removeLeaf} addChild={addChild}></DomainLeaf>
              }
            })
          }
        </div>
      </div>
    </div>
  )
}
export default WorkDomain