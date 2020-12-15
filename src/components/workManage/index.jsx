/*
 * @Author: vuvivian
 * @Date: 2020-11-29 10:08:12
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-11 23:43:58
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/index.jsx
 */

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ProTable } from '@/bcompoents';
import { Button, Tabs, message, Select } from 'antd';
import {
  Container,
  RzConfirmButton,
  RzDrawer,
  RzModal,
  wrapperKeepAlive,
} from '@/components';
import request from '@/utils/request';
import { useSetState } from 'ahooks';
import styles from './index.less';
import ProcessDesigner from './designer/ProcessDesigner';
import _ from 'underscore';

const { TabPane } = Tabs;

const WorkManage = ({}) => {
  const actionRef = useRef();
  const [state, setState] = useSetState({
    visible: false,
    // selectedRows: [],
    selectRows: [],
    editFlow: null,
    typeData: [],
  });
  useEffect(() => {
    request
      .get('/system/sys-dictionary/entries/list', {
        typeId: '1334117573612146688',
      })
      .then(res => {
        setState({
          typeData: res,
        });
      });
  }, []);

  const columns = [
    {
      title: '模版名称',
      dataIndex: 'processName',
      valueType: 'text',
      width: 200,
      // sorter: true,
      fieldProps: {
        placeholder: '模版名称',
        allowClear: true,
      },
    },
    {
      title: '模版类型',
      dataIndex: 'type',
      valueType: 'text',
      search: true,
      width: 200,
      // sorter: true,
      fieldProps: {
        placeholder: '模版类型',
        allowClear: true,
      },
      renderFormItem: (item, props) => {
        return (
          <Select allowClear style={{ width: '100%' }} placeholder="模版类型">
            {_.map(state.typeData, type => {
              return (
                <Select.Option value={type.id} key={type.id}>
                  {type.name}
                </Select.Option>
              );
            })}
          </Select>
        );
      },
      render: (dom, entity) => {
        return <span>{entity.typeName}</span>;
      },
    },
    {
      title: '模版编码',
      dataIndex: 'code',
      valueType: 'text',
      search: false,
      width: 200,
      // sorter: true,
      fieldProps: {
        placeholder: '模版编码',
        allowClear: true,
      },
    },
    {
      title: '最新版本',
      dataIndex: 'version',
      valueType: 'text',
      search: false,
      width: 200,
      // width: '10%',
      // sorter: true,
      fieldProps: {
        placeholder: '最新版本',
        allowClear: true,
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'text',
      search: true,
      width: 200,
      // sorter: true,
      fieldProps: {
        placeholder: '状态',
        allowClear: true,
      },
      render: (dom, entity) => {
        return <span>{dom === 'publish' ? '发布' : '未发布'}</span>;
      },
      renderFormItem: (item, props) => {
        return (
          <Select allowClear style={{ width: '100%' }} placeholder="状态">
            <Select.Option value="publish">发布</Select.Option>
            <Select.Option value="unpublish">未发布</Select.Option>
          </Select>
        );
      },
    },
    {
      title: '最后修改人',
      dataIndex: 'updateName',
      search: false,
      width: 200,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      search: false,
      width: 200,
    },
  ];

  // 编辑
  async function handleEdit() {
    if (state.selectRows.length !== 1) {
      message.warn('请选择一条流程进行编辑');
      return;
    }
    // setState({
    //   visible: true,
    //   editFlow: state.selectRows[0],
    // });
    request
      .get(
        `/flowable/flwTemplate/getById/${_.pluck(state.selectRows, 'id')[0]}`,
      )
      .then(res => {
        if (res) {
          setState({
            visible: true,
            editFlow: res,
          });
        }
      });
  }

  // 发布
  async function handlePublish() {
    if (!state.selectRows.length) {
      message.warn('请选择要发布的流程');
      return;
    }
    request.post(`/flowable/designerWKF/deploy`, state.selectRows).then(res => {
      if (res && res.success) {
        if (res.success.res === 'true' || res.success.res) {
          message.success('操作成功');
          actionRef && actionRef.current.reload();
        } else {
          message.warn(res.success.message);
        }
      }
    });
  }

  // 失效
  async function handleInvalid() {
    if (!state.selectRows.length) {
      message.warn('请选择要失效的流程');
      return;
    }
    request
      .post(
        `/flowable/flwTemplate/uneffective?ids=${_.pluck(
          state.selectRows,
          'id',
        )}`,
      )
      .then(res => {
        if (res) {
          message.success('操作成功');
          actionRef && actionRef.current.reload();
          // if(res.success.res) {
          //   message.success('操作成功');
          //   actionRef && actionRef.current.reload();
          // } else {
          //   message.warn(res.success.message)
          // }
        }
      });
  }

  // 关闭drawer
  const onCloseDrawer = () => {
    setState({
      visible: false,
    });
    actionRef && actionRef.current.reload();
  };
  const rowSelectionSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log('selectedRows=>', selectedRows);
    setState({
      selectRows: [record],
    });
  };

  return (
    <Container overflow="hidden">
      <ProTable
        rowKey="id"
        options={false}
        columns={columns}
        actionRef={actionRef}
        params={{ isEffective: 1 }}
        requestUrl="/flowable/flwTemplate/page"
        tableAlertRender={false}
        rowSelection={{
          type: 'radio',
          onSelect: rowSelectionSelect,
          selectedRowKeys: _.pluck(state.selectRows, 'id'),
          /* onChange: (_, selectedRows) =>
                      setState({ selectedRows: selectedRows }),*/
        }}
        toolBarRender={() => [
          <Button
            ghost
            type="primary"
            onClick={() => {
              setState({ visible: true, editFlow: null });
            }}
          >
            新建
          </Button>,
          <Button ghost type="primary" onClick={handleEdit}>
            编辑
          </Button>,
          <Button ghost type="primary" onClick={handlePublish}>
            发布
          </Button>,
          <RzConfirmButton
            ghost
            type="primary"
            onClick={handleInvalid}
            popTerm={state.selectRows.length}
          >
            失效
          </RzConfirmButton>,
        ]}
      />
      <RzDrawer
        visible={state.visible}
        onClose={onCloseDrawer}
        width="100"
        isAutoWith={false}
      >
        <TabPane tab="流程定义" key="1" className={styles.tabcustom}>
          <ProcessDesigner onClose={onCloseDrawer} editFlow={state.editFlow} />
        </TabPane>
      </RzDrawer>
    </Container>
  );
};

export default WorkManage;
