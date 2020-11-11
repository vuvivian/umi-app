/*
 * @Author: vuvivian
 * @Date: 2020-11-11 15:49:44
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-11 22:46:39
 * @Descripttion: 
 * @FilePath: /umi-app/src/pages/Flow/data.d.ts
 */
export interface TableListItem {
  key: number;
  state: string;
  version: string;
  process_name: string;
  code: string;
  type: string;
  updated: string;
  updator: string;
}

export interface TableListParams {
  processName?: string; // 流程名称
  modelName?: string; // 模型名称
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}