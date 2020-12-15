/*
 * @Author: vuvivian
 * @Date: 2020-11-11 11:05:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-29 00:11:16
 * @Descripttion: 
 * @FilePath: /umi-app/src/pages/Flow/index.tsx
 */

import React, { useState, useRef } from 'react';
import _ from 'underscore';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal,  Divider, message, Input, Drawer } from 'antd';
import { TableListItem } from './data.d';
import ProcessDesignerFlow from '../../components/ProcessDesigner/index.jsx'
import {getVersionList, getFlowDetail,  deploy, invalid} from './service';

const Flow: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisble] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editFlow, setEditFlow] = useState(null);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '模版名称',
      dataIndex: 'processName',
      tip: '规则名称是唯一的 key',
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '模版类型',
      dataIndex: 'type',
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '模版编码',
      dataIndex: 'code',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '最新版本',
      dataIndex: 'version',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom === 'publish' ? '发布' : '未发布'}</a>;
      },
    },
    {
      title: '最后修改人',
      dataIndex: 'updateName',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
  ];

  // 编辑
  async function handleEdit () {
    if (selectedRows.length !== 1) {
      message.warn('请选择一条流程进行编辑');
      return
    };
    const res =  await getFlowDetail({
      id: _.pluck(selectedRows, 'id')[0]
    })
    setEditFlow(res);
    setVisble(true)
  };
  // 发布
  async function handlePublish(){
    if (!selectedRows.length) {
      message.warn('请选择要发布的流程');
      return
    };
    const res =  await deploy(selectedRows)
  };
  // 失效
  async function handleInvalid () {
    if (!selectedRows.length) {
      message.warn('请选择要失效的流程');
      return
    };
    const res =  await invalid(_.pluck(selectedRows, 'id'))
  };

  const onCloseDrawer = () => {
    setVisble(false)
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => {setVisble(true)}} >新建</Button>,
          <Button type="primary" onClick={handleEdit}>编辑</Button>,
          <Button type="primary" onClick={handlePublish}>发布</Button>,
          <Button type="primary" onClick={handleInvalid} >失效</Button>,
        ]}
        columns={columns}
        request={(params, sorter, filter) => getVersionList({ ...params, sorter, filter })}
        rowSelection={{
          onChange: (_, selectedRows:any) => setSelectedRows(selectedRows),
        }}
      />
      <Drawer
        title="绘制流程"
        width={1240}
        visible={visible}
        closable={true}
        onClose={onCloseDrawer}
        bodyStyle={{padding: '0px'}}
      >
        <ProcessDesignerFlow 
          editFlow={editFlow}
        />
      </Drawer>
    </PageContainer>
  )
};

export default Flow;