/*
 * @Author: vuvivian
 * @Date: 2020-11-11 23:23:21
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-29 00:25:55
 * @Descripttion: 最终版
 * @FilePath: /umi-app/src/components/ProcessDesigner/index.jsx
 */
import React, { Component } from 'react';
import { notification , Button, Tooltip, Divider, Tabs, Form, Input, Checkbox, Switch, Select, message} from 'antd';
import styles from './index.less'
import { DeleteOutlined , ShareAltOutlined, CloseCircleOutlined} from '@ant-design/icons';
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
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式
// 引入校验插件
import lintModule from 'bpmn-js-bpmnlint';
// 组件
import {WorkAssignSelect, WorkflowDomain } from './components'
import { fakeFlowCreate } from './services/index';

const { TabPane } = Tabs;
class ProcessDesignerFlow extends Component{
  formRef = React.createRef();

  constructor (props) {
    super(props);
    this.state = {
      currentElement: null, // 当前编辑的节点
      mainTableFields: [], // 分支条件的字段
      visible: false, // 人岗选择控件
      assignList: null, // 人员列表
      isRoot: true, // 是否在操作跟节点
      domainFields: []
    }
  }

  componentDidMount(){
    const that = this;
    // 初始bpmn
    this.bpmnModeler = new CustomModeler({
      container: '#canvas',
      additionalModules: [
        lintModule,
        // CustomPalette
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
      height: '600px',
      width: '100%'
    });
    // 
    let diagramXML = null;

    // 如果是编辑的话
    if (this.props.editFlow) {
      diagramXML= JSON.parse(this.props.editFlow.processXmlStr);
    } else {
      diagramXML = getDefaultXml();
    }
    // 绘制初始流程
    this.renderDiagram(diagramXML);
    // 添加监听事件
    this.addModelerListener();
    this.addEventBusListener();
    // todo 获取domain字段
    this.getMainTableFields();
    // 赋初始值
    // this.setDefaultProperties();
  }

  // componentDidUpdate() {
  //   console.log('componentDidUpdate', this.state.currentElement)
  //   if (!this.state.currentElement) {
  //     console.log('this.c21312urrentElement', this.state.currentElement)
  //     // this.setState({currentElement: this.bpmnModeler.get('canvas').getRootElement() },()=>{
  //     //   this.setDefaultProperties();
  //     // });
  //   } else {
  //     this.setDefaultProperties();
  //   }
  // }
  
  // 赋初始值及更新右侧form： isUpdate=》是否更新modeler
  setDefaultProperties=() => {
    let values = {};
    const {currentElement} = this.state;
    console.log('this.currentElement', currentElement)
    const {name,description,shuxing,  AssignSelect, Approver, executeType, radio, nodeButton, returnValue } = currentElement.businessObject;
    switch(currentElement.type) {
      case  'bpmn:StartEvent':
        values = { 
          name: name || '开始节点'
         };
        break;
      case  'bpmn:EndEvent':
        values = { 
          name: name || '结束节点'
         };
        break;
      case  'bpmn:ExclusiveGateway':
        values = { 
          name: name || '排他网关',
          default: currentElement.businessObject.default,
          // todo 多个分支
         };
        break;
      case  'bpmn:ParallelGateway':
        values = { 
          name: name || '并行网关'
         };
        break;
      case  'bpmn:UserTask':
        values = { 
          name: name || '用户审批',
          Approver: Approver,
          executeType: executeType,
          radio: radio,
          nodeButton: nodeButton,
          returnValue: returnValue
         };
        break;
      case  'bpmn:Process':
        values ={ 
          name: name || '自定义流程',
          description: description,
          shuxing: shuxing,
        };
        break;
      default: 
        break;
    };
    // 更新表单
    this.formRef.current.setFieldsValue(values);
    // 赋默认值的需要更新element
    // this.changeField(values.name, 'name', false);
  };

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

  // modeler事件绑定
  addModelerListener = () => {
    const bpmnjs = this.bpmnModeler
    const that = this
    // 这里我是用了一个forEach给modeler上添加要绑定的事件
    const events = ['shape.added','shape.move.end', 'shape.removed', 'connect.end','connect.move']
    events.forEach(function(event) {
      that.bpmnModeler.on(event, e => {
        var elementRegistry = bpmnjs.get('elementRegistry')
        var shape = e.element ? elementRegistry.get(e.element.id) : e.shape
        console.log('event', event, shape)
      })
    })
  };

  // 元素事件绑定
  addEventBusListener = () => {
    let that = this
    const eventBus = this.bpmnModeler.get('eventBus') // 需要使用eventBus
    const eventTypes = ['element.click', 'element.changed'] // 需要监听的事件集合
    eventBus.on('element.changed', function(e) {
      console.log('change', e)
      // if (!e || e.element.type === 'bpmn:Process')  return // 这里我的根元素是bpmn:Process
      if (!e) return;
      const elementRegistry = that.bpmnModeler.get('elementRegistry')
      const shape = elementRegistry.get(e.element.id) // 传递id进去
      console.log('shape', shape)
      that.setState({
        isRoot: e.element.type === 'bpmn:Process',
        currentElement: shape
      })
    })

    eventBus.on('element.click', function(e) {
      console.log('click',e)
      if (!e) return;
      const elementRegistry = that.bpmnModeler.get('elementRegistry')
      const shape = elementRegistry.get(e.element.id) // 传递id进去
      if (!e || e.element.type === 'bpmn:Process')  return // 这里我的根元素是bpmn:Process
      that.setState({
        isRoot: e.element.type === 'bpmn:Process',
        currentElement: shape
      })
    })
  };
 
  // 获取某种类型的节点节点
  getRootElement(type = 'bpmn:Process' ) {
    let elements = this.bpmnModeler.get('elementRegistry')._elements;
    let root =  _.find(elements,(ele)=>{
      return ele.element.type === type;
    });
    return root.element;
  };

  // 更新元素属性
  updateProperties = (properties) => {
    const {currentElement} = this.state;
    console.log('updateProperties', currentElement, properties);
    const modeling = this.bpmnModeler.get('modeling');
    modeling.updateProperties(currentElement, properties);
  };

  // 更新属性
  changeField = (value, type, update=true) => {
    // 如果是根节点 更行流程名称
    // 如果是元素 更新元素属性
    console.log(value, 'value')
    const {currentElement} = this.state;
    let properties = {};
    if (currentElement) {
      currentElement[type] = value;
      currentElement.businessObject[type] = value;
      properties[type] = value;
      update && this.updateProperties(properties);
    }
  };

  // todo 分支条件获取表头字段接口
  getMainTableFields = () => {
    this.setState({
      mainTableFields: []
    })
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
      message.warn('Please select at least two elements');
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
  save = () =>  {
    // todo 1流程校验  2是否设置为主流程
     this.bpmnModeler.saveXML({ format: true }, async (err, xml)=> {
      console.log('xml', xml);
      let rootElement = this.bpmnModeler.get('canvas').getRootElement();
      let data = {
        'setMainProcess': true,
        'process_name': rootElement.name || '',
        'process_key': rootElement.id,
        'process_xml': JSON.stringify(xml), 
        'description': rootElement.description
      }
      let res = await fakeFlowCreate(data);
    })
  };  

  // 打开选人
  openAssign = () => {
    this.setState({
      visible: true
    })
  };
  // 人岗
  handleOk = (assign) => {
    const names = _.pluck(assign, 'user');
    const ids = _.pluck(assign, 'id');
    console.log('assign', assign)
    this.setState({
      assignList: assign
    })
    this.changeField(ids,'candidateUsers');
    this.handleCancel();
  };

  // 人岗弹框关闭
  handleCancel = () => {
    this.setState({
      visible: false
    })
  };

  // 删除人员
  handleDelete = (id) => {
    let data = _.filter((i) => {
      return i.id !==id
    })
    this.setState({
      assignList: data
    })
  }

  render() {
    const {currentElement, visible, assignList, isRoot} = this.state;
    return (
      <div className={styles.designerContainer}>
        {/* 流程图 */}
        <div className={styles.leftContainer}>
          <div className={styles.header}>
            <div className={styles.title}></div>
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
                ref={this.formRef}
                name="basic"
                labelCol={{span: 24}}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                >
                  {
                    isRoot ? (<>
                      <Form.Item label="流程名称" name="name" rules={[{ required: true, message: '流程名称!' }]} className={styles.formItem} >
                        <Input onChange={(e) => {this.changeField(e.target.value, 'name')}}/>
                      </Form.Item>
                      <Form.Item label="描述" name="description" rules={[{ required: true, message: 'Please input your username!' }]}  className={styles.formItem}>
                        <Input.TextArea onChange={(e) => {this.changeField(e.target.value, 'description')}}/>
                      </Form.Item>
                      <Form.Item label="流程属性" name="shuxing" rules={[{ required: true, message: 'Please input your username!' }]} className={styles.formItem}>
                        <Checkbox.Group >
                          <Checkbox value="autoPassSame" onChange={(e) => {this.changeField(e.target.checked, 'autoPassSame')}}>匹配不到有效审批人时，自动审批通过</Checkbox>
                          <Checkbox value="autoPassEmpty" onChange={(e) => {this.changeField(e.target.checked, 'autoPassEmpty')}}>审批人与制单人相同时，自动审批通过</Checkbox>
                          <Checkbox value="autoPassPerson" onChange={(e) => {this.changeField(e.target.checked, 'autoPassPerson')}}>审批人与制单人相同时，自动审批通过</Checkbox>
                        </Checkbox.Group>
                      </Form.Item>
                    </>) : (<>
                      <Form.Item label="节点名称" name="name" rules={[{ required: true, message: '节点名称!' }]} className={styles.formItem} >
                        <Input onChange={(e) => {this.changeField(e.target.value, 'name')}}/>
                      </Form.Item>
                    </>)
                  }
                  {currentElement && currentElement.type === 'bpmn:UserTask' ? 
                    (<>
                       <Form.Item label="审批人" name="Approver" rules={[{ required: true, message: 'Please input your username!' }]} className={styles.formItem} >
                          {
                            <div className={styles.assignContainer}>
                              <div className={styles.assignItemContainer}>
                                {
                                  _.map(assignList, (i) => {
                                    return (
                                      <div className={styles.assignItem}>
                                        <span>{i.user}</span>
                                        <span><CloseCircleOutlined onClick={() => {this.handleDelete(i.id)}}/></span>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              <ShareAltOutlined onClick={this.openAssign}/>
                            </div>
                          }
                        </Form.Item>
                        <Form.Item label="审批类型" name="executeType" rules={[{ required: true, message: 'Please input your username!' }]} className={styles.formItem}>
                          <Select onChange={(e) => {this.changeField(e, 'executeType')}}>
                            <Select.Option value="0">或签(多人审批时，一人通过即可)</Select.Option>
                            <Select.Option value="1">会签(多人审批时，需所有人通过)</Select.Option>
                            <Select.Option value="2">按比例通过</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => prevValues.executeType !== currentValues.executeType}
                        >

                          {({ getFieldValue }) => {
                            console.log(getFieldValue('executeType'), 'getFieldValue')
                            return getFieldValue('executeType') === '2' ? (
                              <Form.Item name="radio" rules={[{ required: true, message: 'Please input your username!' }]} className={styles.formItem}>
                                需要<Input onChange={(e) => {this.changeField(e.target.value, 'radio')}} style={{width:"20%"}}/>%的人通过才算通过
                              </Form.Item>
                            ) : null;
                          }}
                        </Form.Item>
                        <Form.Item label="节点按钮" name="nodeButton" rules={[{ required: true, message: 'Please input your username!' }]} className={styles.formItem}>
                            <Checkbox.Group onChange={(e) => {this.changeField(e, 'nodeButton')}}>
                                {/* <Checkbox value="0" disabled defaultChecked>同意</Checkbox>
                                <Checkbox value="1" disabled defaultChecked>退回</Checkbox>
                                <Checkbox value="2" disabled defaultChecked>撤销</Checkbox> */}
                                <Checkbox value="0">同意</Checkbox>
                                <Checkbox value="1">退回</Checkbox>
                                <Checkbox value="2">撤销</Checkbox>
                                <Checkbox value="7">否决</Checkbox>
                                <Checkbox value="4">加签</Checkbox>
                                <Checkbox value="5">传阅</Checkbox>
                                <Checkbox value="3">查看全流程</Checkbox>
                              </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label="退回规则" name="returnValue" rules={[{ required: true, message: '退回规则' }]} className={styles.formItem}>
                          < Switch defaultChecked onChange={(e)=>{this.changeField(e, 'returnValue')}}/> 退回时重新提交至本节点
                          <span>存在分支和审批节点服务调用的情况下，请不要使用此功能</span>
                        </Form.Item>
                    </>)
                    : 
                    null
                  }
                  {/* todo 并行分支条件 */}
                  {
                    currentElement && currentElement.type === 'bpmn:ExclusiveGateway' ?
                    (<>
                       <h4 className={styles.conditionTitle}><b>分支条件</b></h4>
                        {/* 遍历element.gatewayList */}
                      <Form.Item label="排他分支" name="description" rules={[{ required: true, message: 'Please input your username!' }]}  className={styles.formItem}>
                        <Input onChange={(e) => {this.changeField(e.target.value, 'description')}}/>
                      </Form.Item>
                      <Form.Item label="默认分支(不满足分支条件时)" name="default" rules={[{ required: true, message: 'Please input your username!' }]}  className={styles.formItem}>
                        <Select onChange={(e) => {this.changeField(e, 'default')}}>
                          {/*  遍历element.gatewayList */}
                          <Select.Option value="2">默认</Select.Option>
                        </Select>
                      </Form.Item>
                    </>) : null
                  }
              </Form>
            </TabPane>
          </Tabs>
        </div>
        <WorkAssignSelect 
          visible={visible}
          onOk={this.handleOk}
          onCancel = {this.handleCancel}
          />  
        <WorkflowDomain fields="domainFields" >
        </WorkflowDomain>       
      </div>
    )
  }
}
export default ProcessDesignerFlow