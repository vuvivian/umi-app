/*
 * @Author: vuvivian
 * @Date: 2020-11-11 11:05:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-12 21:18:07
 * @Descripttion: 
 * @FilePath: /umi-app/src/pages/Flow/index.tsx
 */

import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Modal,  Divider, message, Input, Drawer } from 'antd';
import { TableListItem } from './data.d';
import ProcessDesigner from '../../components/ProcessDesigner/index'
import { queryFlow } from './service';

const Flow: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisble] = useState(false);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '模版名称',
      dataIndex: 'process_name',
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
      valueEnum: {
        0: { text: '已发布', state: 'Default' },
        1: { text: '未发布', state: 'Processing' },
      },
    },
    {
      title: '最后修改人',
      dataIndex: 'updator',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updated',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a>{dom}</a>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => {setVisble(true)}} >新建</Button>,
          <Button type="primary" >编辑</Button>,
          <Button type="primary" >发布</Button>,
          <Button type="primary" >失效</Button>,
        ]}
        columns={columns}
        request={(params, sorter, filter) => queryFlow({ ...params, sorter, filter })}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
      />
      <Drawer
        title="绘制流程"
        width={1000}
        visible={visible}
        closable={false}
        bodyStyle={{padding: '0px', background: 'red'}}

      >
        <ProcessDesigner />
      </Drawer>
    </PageContainer>
  )
}

export default Flow