/*
 * @Author: vuvivian
 * @Date: 2020-11-26 22:36:20
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-03 22:53:52
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/WorkAssignSelect/index.jsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Tabs, Radio, Space, Menu, Switch, Input } from 'antd';
import {
  DeleteOutlined,
  UserAddOutlined,
  ApartmentOutlined,
  UpOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { ProTable } from '@/bcompoents';
import styles from './index.less';
import _ from 'underscore';

const { TabPane } = Tabs;

const AssignSelectTable = ({
  visible,
  onOk,
  onCancel,
  selectedAssignList,
  candidateUsers,
  ...props
}) => {
  const userRef = useRef(null);
  const positionRef = useRef(null);
  const roleRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeType, setActiveType] = useState('user');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const userColumns = [
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
    },
  ];
  const positionColumns = [
    {
      title: '岗位名称',
      dataIndex: 'name',
    },
    {
      title: '部门负责人岗',
      dataIndex: 'departmentLeader',
      render: text => (text === '0' ? '否' : '是'),
    },
    {
      title: '分公司负责人岗',
      dataIndex: 'branchLeader',
      render: text => (text === '0' ? '否' : '是'),
    },
    {
      title: '归属行政部门',
      dataIndex: 'adminDepartmentName',
    },
  ];
  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '上级归属',
      dataIndex: 'pname',
    },
  ];

  const handleOk = () => {
    console.log(selectedRows, 'name');
    onOk && onOk(selectedRows, activeType);
  };

  useEffect(() => {
    setSelectedRows(selectedAssignList);
    setSelectedRowKeys(candidateUsers);
  }, [candidateUsers]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleTableResponse = res => {
    return {
      data: res,
    };
  };

  return (
    <Modal
      {...props}
      width={800}
      visible={visible}
      title="添加审批人"
      bodyStyle={{ padding: '0px' }}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.modalClass}
    >
      <Tabs
        defaultActiveKey={activeType}
        onTabClick={key => {
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setActiveType(key);
        }}
        tabPosition="left"
      >
        <TabPane
          tab={
            <span>
              <UserAddOutlined />
              人员
            </span>
          }
          key="user"
        >
          <ProTable
            rowKey="id"
            actionRef={userRef}
            search={false}
            searchDisable={true}
            toolBarRender={false}
            columns={userColumns}
            othParams={{ busStatus: 1 }}
            requestUrl="/risk/system/sys-staff/page"
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (keys, selectedRows) => {
                setSelectedRowKeys(keys);
                setSelectedRows(selectedRows);
              },
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              岗位
            </span>
          }
          key="position"
        >
          <ProTable
            rowKey="id"
            actionRef={positionRef}
            search={false}
            searchDisable={true}
            toolBarRender={false}
            columns={positionColumns}
            othParams={{ status: 1 }}
            requestUrl="/organize/org-position/page"
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (keys, selectedRows) => {
                setSelectedRowKeys(keys);
                setSelectedRows(selectedRows);
              },
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              角色
            </span>
          }
          key="role"
        >
          <ProTable
            rowKey="id"
            actionRef={roleRef}
            search={false}
            searchDisable={true}
            toolBarRender={false}
            columns={roleColumns}
            params={{ typeId: '1334406526210805760' }}
            requestUrl="/system/sys-dictionary/entries/page"
            handleTableResponse={handleTableResponse}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (keys, selectedRows) => {
                setSelectedRowKeys(keys);
                setSelectedRows(selectedRows);
              },
            }}
          />
        </TabPane>
      </Tabs>
      <div className={styles.selectedFooter}>
        <span className={styles.footerInfo}>
          您已选择以下
          {activeType === 'user'
            ? '人员'
            : activeType === 'role'
            ? '角色'
            : '岗位'}
          ：
        </span>
        <span>
          {activeType === 'user'
            ? _.pluck(selectedRows, 'realName').join(',')
            : _.pluck(selectedRows, 'name').join(',')}
        </span>
      </div>
    </Modal>
  );
};

export default AssignSelectTable;
