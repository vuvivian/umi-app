/*
 * @Author: vuvivian
 * @Date: 2020-11-22 22:36:06
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-24 00:07:40
 * @Descripttion: 操作按钮
 * @FilePath: /umi-app/src/components/ProcessDesigner/components/workDomain/components/DomainNode.jsx
 */

import React, { useEffect, useCallback, useRef, useState, createContext } from 'react';
import { Button, Modal,Tabs, Radio, Space,  Menu, Switch, Input } from 'antd';
import { CloseOutlined , PlusCircleOutlined, SmallDashOutlined} from '@ant-design/icons';
import styles from './index.less';
import _ from 'underscore';

const DomainNode = ({children, handleAdd, handleRemove, handleAddChild}) => {
  return (
    <div className={styles.domainNode}>
      <div className={styles.btnContainter}>
        <div className={styles.btn}>
          <CloseOutlined  onClick={handleAdd}/>
        </div>
        <div className={styles.btn}>
          <PlusCircleOutlined onClick={handleRemove}/>
        </div>
        <div className={styles.btn}>
          <SmallDashOutlined onClick={handleAddChild}/>
        </div>
      </div>
      {children}
    </div>
  )
}

export default DomainNode