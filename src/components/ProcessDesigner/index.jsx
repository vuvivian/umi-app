/*
 * @Author: vuvivian
 * @Date: 2020-11-02 21:49:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-05 21:54:53
 * @Descripttion: 流程设计器
 * @FilePath: /umi-app/src/components/ProcessDesigner/index.jsx
 */
import React, { Component } from 'react';
import { notification } from 'antd';
// 引入bpmn依赖 src/components/ProcessDesigner/process-editor/modeler/index.js
// import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModeler from './process-editor/modeler';
// 引入校验插件
import lintModule from 'bpmn-js-bpmnlint';
// 默认 xml
import getDefaultXml from './process-editor/extend/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边工具栏样式
import styles from './index.less'

// 属性面板
import propertiesPanelModule from 'bpmn-js-properties-panel'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// 引入flowable的节点文件
import flowableModdle from './floeModel/flowable.json';

class ProcessDesigner extends Component{
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
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      //添加控制板
      propertiesPanel: {
        parent: '#properties-panel',
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        propertiesPanelModule,
        lintModule
      ],
      moddleExtensions: {
        flowable: flowableModdle,
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
    )
  }
}
export default ProcessDesigner