/*
 * @Author: vuvivian
 * @Date: 2020-11-11 21:57:13
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 23:37:37
 * @Descripttion: 流程列表
 * @FilePath: /umi-app/src/pages/Flow/service.ts
 */
import { request } from 'umi';
import _ from 'lodash';
import { TableListParams } from './data.d';

// mock
export async function queryFlow(params?: TableListParams) {
  return request('/flwTemplate/getVersionList', {
    params,
  });
}

// 获取当前模型当前流程名称所有流程信息 get
export async function getVersionList(params?: any) {
  const response = await request('/risk/flowable/flwTemplate/getProcessListByPage', {
    method: 'POST',
    data: params
  });
  const data = {
    data: _.get(response, 'content') || _.get(response, 'data'),
    success: true,
    total: _.get(response, 'totalElements'),
    pageSize: params.pageSize,
    current: params.current,
  }
  return  data
}
// 编辑 get
export async function getFlowDetail(params?:any) {
  return request('/risk/flowable/flwTemplate/edit', {
    params
  });
}

// 发布 
export async function deploy(params?: any) {
  return request(`/risk/flowable/designerWKF/deploy`, {
    method: 'POST',
    data: params
  });
}

// 失效
export async function invalid(params?: any) {
  return request(`/risk/flowable/flwTemplate/uneffective?ids=${params}`, {
    method: 'POST',
  });
}


// 实际 查询获取当前模型下默认流程列表
export async function getDefaultFlowList(params?: any) {
  return request('/risk/flowable/flwTemplate/getDefaultList', {
    params
  });
}

// 暂无 当前流程设置为主流程
export async function setDefaultVersion(params?: any) {
  return request('/risk/flowable/flwTemplate/setDefaultVersion', {
    params
  });
}

