/*
 * @Author: vuvivian
 * @Date: 2020-11-29 13:17:49
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-29 13:19:36
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/custom/customModeler/custom.js
 */
import CustomPalette from './CustomPalette';
import CustomContextPad from './CustomContextPad';
import CustomRenderer from './CustomRenderer';

export default {
  __init__: ['paletteProvider', 'contextPadProvider', 'CustomRenderer'],
  paletteProvider: ['type', CustomPalette],
  contextPadProvider: ['type', CustomContextPad],
  CustomRenderer: ['type', CustomRenderer],
};
