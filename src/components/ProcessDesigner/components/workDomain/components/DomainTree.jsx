import React, { useEffect, useCallback, useRef, useState, createContext } from 'react';
import { Button, Modal,Select, Radio, Space,  Menu, Dropdown, Input } from 'antd';
import { DeleteOutlined , DownOutlined, UpOutlined} from '@ant-design/icons';
import DomainNode from './DomainNode';
import DomainLeaf from './DomainLeaf';
import styles from './index.less';
import _ from 'underscore';


const DomainTree = ({time, name, content, avatar, subComment}) => {
  const addTree = () => {

  };
  const removeTree = () => {

  };
  const addTreeChild = () => {

  };

  const addLeaf = () => {

  };
  const removeLeaf = () => {

  };
  const addChild = () => {

  };

  return (
    <DomainNode handleAdd={addTree} handleRemove={removeTree} handleAddChild={addTreeChild}>
      <div>
        <Select defaultValue="lucy" style={{ width: 160 }} bordered={false}>
          <Select.Option value="jack">满足下面所有条件</Select.Option>
          <Select.Option value="lucy">满足下面任意条件</Select.Option>
        </Select>
      </div>
      <div>
        {
          subComment.map((child, index) => {
            if (child.subComment) {
            return (<DomainTree key={index} {...child}>1</DomainTree>)
            } else {
              return (<DomainLeaf key={index} {...child} addLeaf={addLeaf} removeLeaf={removeLeaf} addChild={addChild}>123</DomainLeaf>)
            }
          })
        }
      </div>
    </DomainNode>
  )
}
console.log(DomainTree, 'console.log(DomainTree)')
export default DomainTree