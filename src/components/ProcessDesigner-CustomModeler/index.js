/*
 * @Author: vuvivian
 * @Date: 2020-11-07 22:52:00
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-12 22:32:28
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/index.js
 */
import React, { Component } from 'react';
import { notification } from 'antd';
import CustomModeler from './customModeler'
// 默认 xml
import getDefaultXml from './utils/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边工具栏样式
import styles from './index.less'

class ProcessDesignerCustom extends Component{
  constructor() {
    super()
  };
  
  state = {
    scale: 1, // 流程图比例
    svgVisible: false, // 预览图片
    svgSrc: '', // 图片地址
    bpmnModeler: null
  };

  componentDidMount() {
    const that = this;
    this.bpmnModeler = new CustomModeler({
      container: '#canvas',
      //添加控制板
      propertiesPanel: {
        parent: '#properties-panel',
      },
      additionalModules: [
        // 左边工具栏以及节点
        // propertiesProviderModule,
        // 右边的工具栏
        // propertiesPanelModule,
        // lintModule,
        // CustomPalette
      ],
      moddleExtensions: {
        // flowable: flowableModdle,
        // camunda: camundaModdleDescriptor 用了报错
      },
      height: '100%',
      width: '100%'
    });
    const diagramXML = getDefaultXml();
    this.renderDiagram(diagramXML);
  }

  // 渲染 xml 格式
  renderDiagram = xml => {
    this.bpmnModeler.importXML(xml, err => {
      if (err) {
        console.log(err);
        console.log(xml);
        notification.error({
          message: '提示',
          description: '导入失败',
        });
      }
    });
  };

  render() {
    return (
      // <div>
        <div className={styles.designerContainer}>
          {/* 流程图 */}
          <div className={styles.leftContainer}>
            <div className={styles.canvas} id="canvas" />
          </div>
          {/* 属性栏 */}
          <div className={styles.rightContainer}>
            <div id="properties-panel"></div>
          </div>
        </div>
      // </div>
    )
  }
}
export default ProcessDesignerCustom