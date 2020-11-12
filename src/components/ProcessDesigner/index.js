/*
 * @Author: vuvivian
 * @Date: 2020-11-11 23:23:21
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-12 21:42:53
 * @Descripttion: 最终版
 * @FilePath: /umi-app/src/components/ProcessDesigner/index.js
 */

import React, { Component } from 'react';
import { notification , Button, Tooltip, Divider, Tabs} from 'antd';
import styles from './index.less'
import  Icon from '../icon';
import CustomModeler from './custom/customModeler/index'

// 默认 xml
import getDefaultXml from './utils/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边工具栏样式

const { TabPane } = Tabs;

class ProcessDesigner extends Component{
  constructor (porps) {
    super(props)
  }

  componentDidMount(){
    const that = this;
    this.bpmnModeler = new CustomModeler({
      container: '#canvas',
      //添加控制板
      propertiesPanel: {
        parent: '#properties-panel',
      },
      // additionalModules: [
        // 左边工具栏以及节点
        // propertiesProviderModule,
        // 右边的工具栏
        // propertiesPanelModule,
        // lintModule,
        // CustomPalette
      // ],
      // moddleExtensions: {
        // flowable: flowableModdle,
        // camunda: camundaModdleDescriptor 用了报错
      // },
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
          <div className={styles.header}>
            <div className={styles.title}>
              
            </div>
            <div className={styles.option}>
              <Tooltip placement="bottom" className={styles.optionItem} title='后退'>
                <Icon type="iconundo" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='前进'>
                <Icon type="iconredo" />
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='左对齐'>
                <Icon type="iconalign-left" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='左右居中对齐'>
                <Icon type="iconalign-center1" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='右对齐'>
                <Icon type="iconalign-right" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='上对齐'>
                <Icon type="iconborder-top" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='上下居中对齐'>
                <Icon type="iconborder-center" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='下对齐'>
                <Icon type="iconborder-bottom" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='一键整理'>
                <Icon type="iconundo" />
              </Tooltip>
              <Icon type="iconfengexian" />
              <Tooltip placement="bottom" className={styles.optionItem} title='放大'>
                <Icon type="iconsearch-plus" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='重置'>
                <Icon type="iconsearch" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='缩小'>
                <Icon type="iconsearch-minus" />
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='导入'>
                <Icon type="icondaoru" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='导出'>
                <Icon type="icondaochu" />
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='验证'>
                <Icon type="iconcheck" />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='保存'>
                <Icon type="iconbaocun" />
              </Tooltip>
            </div>
          </div>
          <div className={styles.canvas} id="canvas" />
        </div>
        {/* 属性栏 */}
        <div className={styles.rightContainer}>
          {/* <div id="properties-panel"></div> */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本属性" key="1">
              Content of Tab Pane 1
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default ProcessDesigner