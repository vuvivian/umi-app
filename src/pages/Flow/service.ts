/*
 * @Author: vuvivian
 * @Date: 2020-11-11 21:57:13
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-11 22:41:40
 * @Descripttion: 
 * @FilePath: /umi-app/src/pages/Flow/service.ts
 */
import { request } from 'umi';
import { TableListParams } from './data.d';

export async function queryFlow(params?: TableListParams) {
  console.log('asda')
  return request('/flwTemplate/getVersionList', {
    params,
  });
}
