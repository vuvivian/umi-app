/*
 * @Author: vuvivian
 * @Date: 2020-11-11 15:49:44
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 14:22:16
 * @Descripttion: 
 * @FilePath: /umi-app/src/pages/Flow/data.d.ts
 */
// 列表结果
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

// 列表查询
export interface TableListParams {
  processName?: string; // 流程名称 
  modelName?: string; // 模型名称
  code?: string; // 模版编号
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}