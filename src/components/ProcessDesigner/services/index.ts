/*
 * @Author: vuvivian
 * @Date: 2020-11-15 13:42:25
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 14:22:58
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/services/index.ts
 */
import { request } from 'umi';

export interface CreateParamsType {
  setMainProcess?: Boolean,
  process_name: string,
  process_key: string,
  process_xml: string, 
  description?: string
}

// 创建
export async function fakeFlowCreate(params: CreateParamsType) {
  return request('/risk/flowable/flwTemplate/create', {
    method: 'POST',
    data: params,
  });
}

