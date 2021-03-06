/*
 * @Author: vuvivian
 * @Date: 2020-11-01 20:54:41
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-17 20:26:38
 * @Descripttion: 
 * @FilePath: /umi-app/src/utils/utils.ts
 */
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
import _ from 'lodash';
export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * 返回Table的结果
 * @param {*} response
 */
export const handleTableResponse = (response: any) => {
  const data = _.get(response, 'content') || _.get(response, 'data');
  const total = _.get(response, 'totalElements');
  return {
    data: data,
    success: data,
    total: total,
  };
};

export function isNotEmptyArray(obj:any) {
  return Array.isArray(obj) && obj.length > 0
}
