/*
 * @Author: vuvivian
 * @Date: 2020-11-17 22:31:04
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-17 22:33:58
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/AsyncTree/service.ts
 */
import { request } from 'umi';
import _ from 'lodash';

// 编辑 get
export async function getTree(params?:any) {
  return request('/risk/organize/org-person-post-selector/human-post-tree', {
    params
  });
}