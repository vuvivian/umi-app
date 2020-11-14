/*
 * @Author: vuvivian
 * @Date: 2020-11-12 01:50:47
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-14 16:06:17
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/custom/customModeler/custom.js
 */
// 引入左侧工具栏CustomPalette和画布节点CustomContextPad自定义js
import CustomPalette from './CustomPalette';
import CustomContextPad from './CustomContextPad';
import CustomRenderer from './CustomRenderer';

export default {
    __init__: ['paletteProvider','contextPadProvider','CustomRenderer'],
    paletteProvider: ['type', CustomPalette],
    contextPadProvider: ['type', CustomContextPad],
    CustomRenderer:['type',CustomRenderer]
};
