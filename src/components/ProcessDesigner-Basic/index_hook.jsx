/*
 * @Author: vuvivian
 * @Date: 2020-11-02 21:49:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-04 23:56:08
 * @Descripttion: 流程设计器
 * @FilePath: /umi-app/src/components/ProcessDesigner/index_cb.jsx
 */
import React, { useState, useRef, useEffect } from 'react';
import { notification } from 'antd';
// 引入bpmn依赖
import BpmnModeler from 'bpmn-js/lib/Modeler';
// 引入校验插件
import lintModule from 'bpmn-js-bpmnlint';
// 默认 xml
import getDefaultXml from './process-editor/extend/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import styles from './index.less'

// 属性面板
import propertiesPanelModule from 'bpmn-js-properties-panel'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// 引入flowable的节点文件
import flowableModdle from './floeModel/flowable.json';

const ProcessDesigner = () => {
  const [bpmnModeler, useBpmnModeler] = useState(null);
  useEffect(() => {
    let modeler = new BpmnModeler({
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
    })
    useBpmnModeler(modeler)
    const diagramXML = getDefaultXml();
    renderDiagram(diagramXML, modeler);
  }, []);

  // 渲染 xml 格式
  const renderDiagram = (xml, modeler) => {
    console.log(bpmnModeler, modeler)
    modeler.importXML(xml)
  };

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

export default ProcessDesigner