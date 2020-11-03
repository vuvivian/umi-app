/*
 * @Author: vuvivian
 * @Date: 2020-11-02 21:49:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-03 00:03:08
 * @Descripttion: 流程设计器
 * @FilePath: /umi-app/src/components/ProcessDesigner/index.jsx
 */
import React, { useState, useRef, useEffect } from 'react';
import { notification } from 'antd';
// 引入bpmn依赖
import BpmnModeler from 'bpmn-js/lib/Modeler';
// 引入校验插件
import lintModule from 'bpmn-js-bpmnlint';
// moren xml
import getDefaultXml from './process-editor/extend/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import styles from './index.less'

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
      moddleExtensions: {
        flowable: flowableModdle,
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        lintModule
      ],
      height: '100%',
      width: '100%'
    })
    useBpmnModeler(modeler)
    setTimeout(() => {
      const diagramXML = getDefaultXml();
      renderDiagram(diagramXML);
    }, 100);
  }, []);

  // 渲染 xml 格式
  const renderDiagram = xml => {
    console.log(bpmnModeler)
    bpmnModeler && bpmnModeler.importXML(xml, err => {
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