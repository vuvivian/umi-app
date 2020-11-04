/*
 * @Author: vuvivian
 * @Date: 2020-11-01 20:54:41
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-05 00:05:49
 * @Descripttion: 
 * @FilePath: /umi-app/config/defaultSettings.ts
 */
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: 'Ant Design Pro',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
