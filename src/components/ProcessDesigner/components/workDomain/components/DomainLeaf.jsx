import React, { useEffect, useCallback, useRef, useState, createContext } from 'react';
import { Button, Modal,Select, Radio, Space,  Row, Col, Cascader, Input } from 'antd';
import { DeleteOutlined , DownOutlined, UpOutlined} from '@ant-design/icons';
import DomainNode from './DomainNode';
import styles from './index.less';
import _ from 'underscore';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const DomainLeaf = ({children, addLeaf, removeLeaf, addChild}) => {
  return (
    <DomainNode handleAdd={addLeaf} handleRemove={removeLeaf} handleAddChild={addChild}>
      <Row gutter={24} className={styles.DomainLeaf}>
        <Col span={6}>
          <Select placeholder="请选择字段" style={{ width: '100%' }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Cascader  style={{ width: '100%' }}
            options={options}
          />
        </Col>
        <Col span={6}>
          <Input placeholder="Basic usage"   style={{ width: '100%' }}/>
        </Col>
      </Row>
      {children}
    </DomainNode>
  )
}

export default DomainLeaf