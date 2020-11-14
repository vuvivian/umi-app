/*
 * @Author: vuvivian
 * @Date: 2020-11-11 23:23:21
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-14 16:49:39
 * @Descripttion: 最终版
 * @FilePath: /umi-app/src/components/ProcessDesigner/index.js
 */

import React, { Component } from 'react';
import { notification , Button, Tooltip, Divider, Tabs, Form, Input, Checkbox, Switch, Select, message} from 'antd';
import styles from './index.less'
import  Icon from '../icon';
import _ from 'underscore';
import CustomModeler from './custom/customModeler/index'
import customTranslate from './custom/customtranslate/customTranslate';
import camundaModdleDescriptor from './custom/descriptiors/flowable.json'
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

class ProcessDesignerFlow extends Component{
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    console.log('aaaa')
    const that = this;
    this.bpmnModeler = new CustomModeler({
      container: '#canvas',
      additionalModules: [
        // 翻译
        {
          translate: [ 'value', customTranslate ]
        },
      ],
      moddleExtensions: {
        flowable: camundaModdleDescriptor
      },
      //添加控制板
      // propertiesPanel: {
      //   parent: '#properties-panel',
      // },
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

  //后退方法
  undo = () => {
    this.bpmnModeler.get('commandStack').undo();
  };

  //前进方法
  redo =() => {
    this.bpmnModeler.get('commandStack').redo();
  };

  /** 流程对齐
   * @param  {String} type left|right|center|top|bottom|middle
   */
  align = (type) => {
    //获取所有选中的element
    let selectionList = this.bpmnModeler.get('selection').get();
    if(selectionList.length > 1){
      this.bpmnModeler.get('alignElements').trigger(selectionList, type);
    }else{
      message.warn(this.translate('Please select at least two elements'));
    }
  };

   //一键整理功能
   arrange = () => {
    //获取选中的节点
    let selectionList = this.bpmnModeler.get('selection').get();
    //获取页面中的所有节点
    let _elements = this.bpmnModeler.get('elementRegistry')._elements;
    //获取所有除process的节点的数组
    let allElements = _.pluck(_.filter(_elements,(ele)=>{
      return ele.element.type!=='bpmn:Process';
    }),'element');
    let finalElements = selectionList.length > 2 ? selectionList : allElements; 
    this.bpmnModeler.get('distributeElements').trigger(finalElements, 'horizontal');
  };


   //流程缩放
  handleZoom = (radio) => {
    const newScale = !radio
        ? 1.0 // 不输入radio则还原
        : this.scale + radio <= 0.2 // 最小缩小倍数
        ? 0.2
        : this.scale + radio;

    this.bpmnModeler.get('canvas').zoom(newScale);
    this.scale = newScale;
  };


  //关闭校验
  closeCheck = () => {
    this.removeDom();
    this.ifCheck = false;
  };

  // 导入
  import = () => {

  };

  // 导出
  export = () => {

  };

  // 校验
  checkFun = () => {
    // this.ifCheck = true;
    // this.removeDom();
    // verifyFlow(this.bpmnModeler);
  };

  // 保存
  save = () => {

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
              <Tooltip placement="bottom" className={styles.optionItem} title='后退' >
                <Icon type="iconundo" className={styles.optionIcon} onClick={this.undo}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='前进' >
                <Icon type="iconredo" className={styles.optionIcon} onClick={this.redo}/>
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='左对齐'>
                <Icon type="iconalign-left" className={styles.optionIcon} onClick={()=>{this.align('left')}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='左右居中对齐'>
                <Icon type="iconalign-center1" className={styles.optionIcon} onClick={()=>{this.align('center')}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='右对齐'>
                <Icon type="iconalign-right" className={styles.optionIcon} onClick={()=>{this.align('right')}} />
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='上对齐'>
                <Icon type="iconborder-top" className={styles.optionIcon} onClick={()=>{this.align('top')}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='上下居中对齐'>
                <Icon type="iconborder-center" className={styles.optionIcon} onClick={()=>{this.align('middle')}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='下对齐'>
                <Icon type="iconborder-bottom" className={styles.optionIcon} onClick={()=>{this.align('bottom')}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='一键整理'>
                <Icon type="iconundo" className={styles.optionIcon} onClick={()=>{this.arrange()}}/>
              </Tooltip>
              <Icon type="iconfengexian" />
              <Tooltip placement="bottom" className={styles.optionItem} title='放大' onClick={() => {this.handleZoom(0.1)}}>
                <Icon type="iconsearch-plus" className={styles.optionIcon}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='重置' onClick={() => {this.handleZoom()}}>
                <Icon type="iconsearch" className={styles.optionIcon}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='缩小' onClick={() => {this.handleZoom(-0.1)}}>
                <Icon type="iconsearch-minus" className={styles.optionIcon}/>
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='导入'>
                <Icon type="icondaoru" className={styles.optionIcon} onClick={() => {this.import()}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='导出'>
                <Icon type="icondaochu" className={styles.optionIcon} onClick={() => {this.export()}}/>
              </Tooltip>
              <Icon type="iconfengexian" className={styles.optionItem}/>
              <Tooltip placement="bottom" className={styles.optionItem} title='验证'>
                <Icon type="iconcheck" className={styles.optionIcon} onClick={() => {this.checkFun()}}/>
              </Tooltip>
              <Tooltip placement="bottom" className={styles.optionItem} title='保存'>
                <Icon type="iconbaocun" className={styles.optionIcon} onClick={() => {this.save()}}/>
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
              <Form
                name="basic"
                labelCol={{span: 24}}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                >
                  <Form.Item label="流程名称" name="name" rules={[{ required: true, message: 'Please input your username!' }]} >
                    <Input />
                  </Form.Item>
                  <Form.Item label="描述" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                    <Input />
                  </Form.Item>
                  <Form.Item label="流程属性" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                    <Checkbox.Group>
                      {/* <Checkbox value="A">与上一个节点审批人相同时，自动跳过</Checkbox> */}
                      <Checkbox value="B">匹配不到有效审批人时，自动审批通过</Checkbox>
                      <Checkbox value="C">审批人与制单人相同时，自动审批通过</Checkbox>
                      <Checkbox value="D">审批人与制单人相同时，自动审批通过</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item label="审批人" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                    <Input />
                  </Form.Item>
                  <Form.Item label="审批类型" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                    <Select>
                      <Select.Option value="jack">或签(多人审批时，一人通过即可)</Select.Option>
                      <Select.Option value="lucy">会签(多人审批时，需所有人通过)</Select.Option>
                      <Select.Option value="Yiminghe">按比例通过</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="节点按钮" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                      <Checkbox.Group>
                          <Checkbox value="A">同意</Checkbox>
                          <Checkbox value="B">退回</Checkbox>
                          <Checkbox value="C">撤销</Checkbox>
                          <Checkbox value="D">否决</Checkbox>
                          <Checkbox value="E">加签</Checkbox>
                          <Checkbox value="F">传阅</Checkbox>
                          <Checkbox value="Gs">查看全流程</Checkbox>
                        </Checkbox.Group>
                  </Form.Item>
                  <Form.Item label="退回规则" name="description" rules={[{ required: true, message: 'Please input your username!' }]} >
                  < Switch defaultChecked /> 退回时重新提交至本节点
                  </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default ProcessDesignerFlow