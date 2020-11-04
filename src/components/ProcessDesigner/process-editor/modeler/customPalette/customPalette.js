/*
 * @Author: vuvivian
 * @Date: 2020-11-04 21:46:54
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-04 21:53:24
 * @Descripttion: 实现左侧工具栏，默认bpmn-js的工具栏有很多节点，但一些节点不是我们需要的；所以这里自定义
 * @FilePath: /umi-app/src/components/ProcessDesigner/process-editor/modeler/customPalette/customPalette.js
 */

// 定义一个类
export default class customPalette {
  constructor(bpmnFatory, create, elementFactory, palette, translate) {
    this.bpmnFatory = bpmnFatory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    // 在类中使用palette.registerProvider(this)指定这是一个palette
    palette.registerProvider(this);
  }

  // 绘制palette
  getPaletteEntries(element) {}
}

// 使用$inject注入一些需要的变量
customPalette.$inject = [
  'bpmnFatory', 
  'create', 
  'elementFactory', 
  'palette', 
  'translate'
]