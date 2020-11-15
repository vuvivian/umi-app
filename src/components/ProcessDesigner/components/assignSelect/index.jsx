/*
 * @Author: vuvivian
 * @Date: 2020-11-15 01:53:26
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 13:11:36
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/components/assignSelect/index.jsx
 */
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Modal,Tabs, Radio, Space,  Menu, Switch, Input } from 'antd';
import { DeleteOutlined , DownOutlined, UpOutlined} from '@ant-design/icons';

import styles from './index.less';
const { TabPane } = Tabs;

import _ from 'underscore'

const AssignSelect = ({visible, onOk, ...props}) => {
  const [assignArr, useAssignArr] = useState([{
    id: '001',
    name: '成员1'
  }]); // 成员
  const [selectAssign, useSelectAssign] = useState([]); // 已选择成员

  const handleSelectAssign = (assign) => {
    const data = [...selectAssign, ...assign]
    useSelectAssign(data)
  };

  const handleOk = () => {
    onOk && onOk(selectAssign)
  };

  return (
    <Modal 
      width={660}
      visible={visible}
      title="添加审批人"
      bodyStyle={{padding: '0px'}}
      onOk={handleOk}
      {...props}
    >
      <div className={styles.assignContainer}>
        <div className={styles.leftContainer}>
          <Tabs tabPosition='left'>
            <TabPane tab="成员" key="1">
             <div className={styles.tabPane}>
              <Input.Search placeholder="input search text" enterButton />
              <ul class={styles.ulList}>
                {
                  _.map(assignArr, (i) => {
                    return (
                      <li className={styles.item} onClick={()=> {handleSelectAssign([i])}}>
                        <span>{i.name}</span>
                        <span>+</span>
                      </li>
                    )
                  })
                }
              </ul>
             </div>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.rightContainer}>
          <p>已选择</p>
          <ul className={styles.selectAssignUl}>
            <p><DownOutlined style={{marginRight: '5px'}}/> 成员</p>
            {
              _.map(selectAssign, (i) => {
                return (
                  <li key={i.id} class={styles.selectAssign}>
                    <span>{i.name}</span>
                    <DeleteOutlined />
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </Modal>
  )
}

export default AssignSelect