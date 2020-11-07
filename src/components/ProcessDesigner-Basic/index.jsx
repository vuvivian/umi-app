/*
 * @Author: vuvivian
 * @Date: 2020-11-02 21:49:39
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-07 23:51:38
 * @Descripttion: 流程设计器
 * @FilePath: /umi-app/src/components/ProcessDesigner-Basic/index.jsx
 */
import React, { Component } from 'react';
import { notification , Button} from 'antd';
// 引入bpmn依赖 src/components/ProcessDesigner/process-editor/modeler/index.js
import BpmnModeler from 'bpmn-js/lib/Modeler';
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

// 左侧工具栏
import propertiesPanelModule from 'bpmn-js-properties-panel'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
// 右侧属性栏
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
        // 右边的工具栏
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

  // 添加绑定事件
  addBpmnListener = () => {
    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('commandStack.changed', function () {
      // that.saveDiagram(function(err, xml) {
      //   console.log(xml) // 这里获取到的就是最新的xml信息
      // })
    })
  };

  // 下载为bpmn格式,done是个函数，调用的时候传入的
  saveDiagram(done) {
    // 把传入的done再传给bpmn原型的saveXML函数调用
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      done(err, xml)
    })
  };

  // 获取xml
  getXml = () => {

  };
  // 保存xml
  saveXml = () => {
    this.saveDiagram(function(err, xml) {
      console.log(xml) // 这里获取到的就是最新的xml信息
    })
  };
  
  // change xml
  changeXml = () => {

  };

  downloadSvg = () => {
    this.bpmnModeler.saveSVG()
  };

   // 当图发生改变的时候会调用这个函数，这个data就是图的xml
   setEncoded(link, name, data) {
    // 把xml转换为URI，下载要用到的
    const encodedData = encodeURIComponent(data)
    // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
    console.log(link, name, data)
    let xmlFile = new File([data], 'test.bpmn')
    console.log(xmlFile)
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
  };
  render() {
    return (
      <div>
        <div className="">
          <Button type="primary" onClick={this.getXml}>获取</Button>
          <Button type="primary" onClick={this.saveXml}>保存</Button>
          <Button type="primary" onClick={this.changeXml}>change</Button>
          <Button type="primary" onClick={this.saveDiagram}>下载为bpmn</Button>
          <Button type="primary" onClick={this.downloadSvg}>下载为svg</Button>
        </div>
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
      </div>
    )
  }
}
export default ProcessDesigner