/*
 * @Author: vuvivian
 * @Date: 2020-11-26 22:36:20
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-27 00:56:37
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/components/assignSelectTable/index.jsx
 */
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Modal,Tabs, Radio, Space,  Menu, Switch, Input } from 'antd';
import { DeleteOutlined , UserAddOutlined,ApartmentOutlined,UpOutlined} from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer , FooterToolbar} from '@ant-design/pro-layout';
import styles from './index.less';
import _ from 'underscore';
import { request } from 'umi';
import { json } from 'express';

const { TabPane } = Tabs;


const AssignSelectTable = ({visible, onOk, ...props}) => {
  const userRef = useRef(null);
  const positionRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeType, setActiveType] = useState('1');

  const userColumns = [
    {
      title: '姓名',
      dataIndex: 'processName',
    },
    {
      title: '工号',
      dataIndex: 'number',
      sorter: true,
    },
    {
      title: '手机号',
      dataIndex: 'code',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
  ];
  const positionColumns = [
    {
      title: '名称',
      dataIndex: 'comments',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
  ];

  const handleOk = () => {
    // const aaa = _.pluck(selectedRows, 'id')
    console.log(selectedRows, 'name')
    onOk && onOk(selectedRows)
  };

  return (
    <Modal 
      width={800}
      visible={visible}
      title="添加审批人"
      bodyStyle={{padding: '0px'}}
      onOk={handleOk}
      {...props}
    >
      <Tabs defaultActiveKey={activeType} onTabClick={(key) => {setActiveType(key)}} tabPosition="left">
        <TabPane  tab={<span><UserAddOutlined />人员</span>} key="1" >
            <ProTable
              headerTitle="选择人员"
              actionRef={userRef}
              rowKey="id"
              search={false}
              toolBarRender={false}
              columns={userColumns}
              request={async (params = {}) =>
                request('https://proapi.azurewebsites.net/github/issues', {
                  params,
                })
              }
              // request={(params, sorter, filter) => {(params, sorter, filter) =>request('https://proapi.azurewebsites.net/github/issues', {params,sorter, filter})}}
              rowSelection={{
                onChange: (_, selectedRows) => setSelectedRows(selectedRows),
              }}
            />
        </TabPane>
        <TabPane  tab={<span><ApartmentOutlined />岗位</span>} key="2" >
            <ProTable
              headerTitle="选择人员"
              actionRef={userRef}
              rowKey="id"
              search={false}
              toolBarRender={false}
              columns={positionColumns}
              request={async (params = {}) =>
                request('https://proapi.azurewebsites.net/github/issues', {
                  params,
                })
              }
              // request={(params, sorter, filter) => {(params, sorter, filter) =>{return {data: {content: [{'name': '123'}]}}}}}
              // request={(params, sorter, filter) => {(params, sorter, filter) =>request('/flwTemplate/getVersionList', {params,sorter, filter})}}
              rowSelection={{
                onChange: (_, selectedRows) => setSelectedRows(selectedRows),
              }}
            />
        </TabPane>
        </Tabs>
        <div className={styles.selectedFooter}>
          <span className={styles.footerInfo}>您已选择以下{activeType==='1'?'人员': '岗位'}：</span>
          <span>{_.pluck(selectedRows, 'user').join(',')}</span>
        </div>
    </Modal>
   
  )


};

export default AssignSelectTable