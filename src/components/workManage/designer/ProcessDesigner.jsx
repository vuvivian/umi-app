/*
 * @Author: vuvivian
 * @Date: 2020-11-29 12:48:48
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-14 23:29:36
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/ProcessDesigner.jsx
 */
import React, { Component } from 'react';
import {
    notification,
    Button,
    Tooltip,
    Modal,
    Tabs,
    Form,
    Input,
    Checkbox,
    Switch,
    Select,
    message,
} from 'antd';
import {
    PlusCircleOutlined,
    CloseCircleOutlined,
    SmallDashOutlined,
    EditFilled,
} from '@ant-design/icons';
// 默认 xml
import getDefaultXml from './utils/defaultxml';
// 样式文件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import lintModule from 'bpmn-js-bpmnlint';
import CustomModeler from './custom/customModeler/index';
import camundaModdleDescriptor from './custom/descriptiors/flowable.json';
import { verifyFlow } from './utils/verify';
import {
    EditingTools,
    WorkAssignSelect,
    WorkflowDomain,
} from './components/index';
import styles from './ProcessDesigner.less';
import request from '@/utils/request';
import _ from 'underscore';
import { sort } from 'd3';

const { TabPane } = Tabs;

class ProcessDesigner extends Component {
    formRef = React.createRef();
    domainRef = React.createRef();
    state = {
        bpmnModeler: null,
        currentElement: null, // 当前编辑的节点
        mainTableFields: [], // 分支条件的字段
        visible: false, // 人岗选择控件
        assignList: null, // 人员列表
        isRoot: true, // 是否在操作跟节点
        scale: 1,
        typeData: [],
        domainModal: false,
        domainFields: [], // 下啦选择字段
        currentDomainItem: null, // 设置分支条件的biaodan字段
        domainIndex: '', //
        id: this.props.editFlow ? this.props.editFlow.id : null,
    };

    componentWillMount() {
        // 获取流程属性
        this.getType();
        this.getFields();
    }
    componentDidMount() {
        const that = this;
        this.bpmnModeler = new CustomModeler({
            container: '#canvas',
            moddleExtensions: {
                flowable: camundaModdleDescriptor,
            },
            height: '100%',
            width: '100%',
        });

        let diagramXML = null;

        // 如果是编辑的话
        if (this.props.editFlow) {
            diagramXML = JSON.parse(this.props.editFlow.processXml);
        } else {
            diagramXML = getDefaultXml();
        }
        // 绘制初始流程
        this.renderDiagram(diagramXML);
        // 添加监听事件
        // this.addModelerListener();
        this.addEventBusListener();
        // todo 获取domain字段
        // this.getMainTableFields();
    }

    // 渲染 xml 格式
    renderDiagram = xml => {
        this.bpmnModeler.importXML(xml, err => {
            if (err) {
                console.log(err);
                // console.log(xml);
                notification.error({
                    message: '提示',
                    description: '导入失败',
                });
            }
        });
    };

    addEventBusListener = () => {
        let that = this;
        const eventBus = this.bpmnModeler.get('eventBus'); // 需要使用eventBus
        // 节点变化时
        eventBus.on('element.changed', function (e) {
            if (!e) return;
            const elementRegistry = that.bpmnModeler.get('elementRegistry');
            const shape = elementRegistry.get(e.element.id);
            that.setState(
                {
                    isRoot: e.element.type === 'bpmn:Process',
                    currentElement: shape,
                },
                () => {
                    that.updateFormRef();
                },
            );
        });

        // 节点点击的时候
        eventBus.on('element.click', function (e) {
            if (!e) return;
            const elementRegistry = that.bpmnModeler.get('elementRegistry');
            const shape = elementRegistry.get(e.element.id);
            that.setState(
                {
                    isRoot: e.element.type === 'bpmn:Process',
                    currentElement: shape,
                },
                () => {
                    that.updateFormRef();
                },
            );
        });
    };

    getType = () => {
        request
            .get('/system/sys-dictionary/entries/list', {
                typeId: '1334117573612146688',
            })
            .then(res => {
                this.setState({
                    typeData: res,
                });
            });
    };

    getFields = () => {
        request
            .get('system/sys-dictionary/entries/page', {
                typeId: '1334056867630026752',
            })
            .then(res => {
                // 处理值todo
                _.map(res, i => {
                    if (i.sort === 1) {
                        i.type = 'char';
                    } else {
                        i.type = 'float';
                    }
                    i.label = i.name;
                });
                this.setState({
                    domainFields: res,
                    // domainFields: [{"type":"char","name":"fff","string":"文本","model":"mmm"},{"type":"integer","name":"nnnn","string":"整数","model":"mmm"}]
                });
            });
    };

    // 更新 form
    updateFormRef() {
        const { currentElement } = this.state;
        // 删除节点
        if (!currentElement) return;
        let values = {};
        const {
            name,
            description,
            checkAssignList,
            executeType,
            radio,
            nodeButton,
            returnValue,
            autoAttribute,
            outgoing,
            modelType,
        } = currentElement.businessObject;

        switch (currentElement.type) {
            case 'bpmn:StartEvent':
                values = {
                    name: name || '开始节点',
                };
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                break;
            case 'bpmn:EndEvent':
                values = {
                    name: name || '结束节点',
                };
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                break;
            case 'bpmn:ExclusiveGateway':
                //设置第一个出分支为默认分支
                if (outgoing && outgoing.length > 0) {
                    currentElement.default = currentElement.businessObject.default
                        ? currentElement.businessObject.default.id
                        : outgoing[0].id;
                }
                values = {
                    name: name || '排他网关',
                    default: currentElement.default,
                    // todo 多个分支
                };
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                this.updateGateWayList(currentElement);
                break;
            case 'bpmn:ParallelGateway':
                values = {
                    name: name || '并行网关',
                };
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                break;
            case 'bpmn:UserTask':
                values = {
                    name: name || '用户审批',
                    // name: name,
                    Approver: checkAssignList,
                    executeType: executeType,
                    radio: radio,
                    nodeButton: nodeButton || ['0', '1', '2'],
                    returnValue: returnValue,
                };
                this.setState({
                    assignList: checkAssignList ? JSON.parse(checkAssignList) : [],
                });
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                break;
            case 'bpmn:Process':
                values = {
                    name: name || '自定义流程',
                    description: description,
                    autoAttribute: autoAttribute ? JSON.parse(autoAttribute) : [],
                    modelType: modelType ? JSON.parse(modelType) : { value: null },
                };
                if (!name) {
                    currentElement.businessObject.name = values.name;
                    currentElement.name = values.name;
                }
                break;
            default:
                break;
        }
        // 更新表单
        this.formRef.current.setFieldsValue(values);
    }

    // 属性变更的时候 更新回流程节点
    changeField = (value, type, element = this.state.currentElement, from) => {
        let properties = {};
        let moddle = this.bpmnModeler.get('moddle');
        if (element) {
            // 如果是流程属性的话需要拆分下
            if (type === 'autoAttribute') {
                _.map(value, v => {
                    element[v] = true;
                    element.businessObject[v] = true;
                    properties[v] = true;
                });
                value = JSON.stringify(value);
                element[type] = value;
                element.businessObject[type] = value;
            } else if (type === 'default') {
                //设置默认分支
                element.businessObject[type] = undefined;
                let defaultElement = _.find(element.outgoing, item => {
                    return item.id === value;
                });
                value = defaultElement;
                element[type] = value;
                element.businessObject[type] = value;
            } else if (type === 'checkAssignList') {
                // 人岗存储处理 candidateUsers checkAssignList
                value = JSON.stringify(value);
                element[type] = value;
                element.businessObject[type] = value;
            } else if (type === 'modelType') {
                // 流程属性
                value = JSON.stringify(value);
                element[type] = value;
                element.businessObject[type] = value;
            } else if (type === 'conditionExpression') {
                let newCondition = moddle.create('bpmn:FormalExpression', {
                    body: value,
                });
                value = newCondition;
                // properties[type] = newCondition;
            } else if (type === 'gatewayDomain') {
                value = JSON.stringify(value);
                element[type] = value;
                element.businessObject[type] = value;
            } else {
                element[type] = value;
                element.businessObject[type] = value;
            }
            // 特殊处理流程属性
            properties[type] = value;
            this.updateProperties(properties, element);
        }
    };

    // 更新流程属性
    updateProperties(properties, element = this.state.currentElement) {
        const modeling = this.bpmnModeler.get('modeling');
        modeling.updateProperties(element, properties);
    }

    // 更新分支
    updateGateWayList(element) {
        element.gatewayList = element.businessObject.outgoing;
        _.each(element.gatewayList, (item, index) => {
            let expressionObj = element.businessObject.outgoing[index].expressionObj;
            if (expressionObj && !_.isObject(expressionObj)) {
                expressionObj = JSON.parse(expressionObj);
                item.valueExpression = expressionObj.valueExpression || '';
                const data = {};
                data[item.id] = item.valueExpression;
                this.formRef.current.setFieldsValue(data);
            }
        });
    }

    // 获取某种类型的节点节点
    getRootElement(type = 'bpmn:Process') {
        let elements = this.bpmnModeler.get('elementRegistry')._elements;
        let root = _.find(elements, ele => {
            return ele.element.type === type;
        });
        return root.element;
    }

    //后退方法
    undo = () => {
        this.bpmnModeler.get('commandStack').undo();
    };

    //前进方法
    redo = () => {
        this.bpmnModeler.get('commandStack').redo();
    };

    // 流程对齐 left|right|center|top|bottom|middle
    align = type => {
        //获取所有选中的element
        let selectionList = this.bpmnModeler.get('selection').get();
        if (selectionList.length > 1) {
            this.bpmnModeler.get('alignElements').trigger(selectionList, type);
        } else {
            message.warn('请至少选择两个元素进行操作');
        }
    };

    //一键整理功能
    arrange = () => {
        //获取选中的节点
        let selectionList = this.bpmnModeler.get('selection').get();
        //获取页面中的所有节点
        let _elements = this.bpmnModeler.get('elementRegistry')._elements;
        //获取所有除process的节点的数组
        let allElements = _.pluck(
            _.filter(_elements, ele => {
                return ele.element.type !== 'bpmn:Process';
            }),
            'element',
        );
        let finalElements = selectionList.length > 2 ? selectionList : allElements;
        this.bpmnModeler
            .get('distributeElements')
            .trigger(finalElements, 'horizontal');
    };

    //流程缩放
    handleZoom = radio => {
        const newScale = !radio
            ? 1.0 // 不输入radio则还原
            : this.state.scale + radio <= 0.2 // 最小缩小倍数
                ? 0.2
                : this.state.scale + radio;

        this.bpmnModeler.get('canvas').zoom(newScale);
        this.setState({
            scale: newScale,
        });
    };

    //关闭校验
    closeCheck = () => {
        this.removeDom();
        this.ifCheck = false;
    };

    //
    removeDom() {
        document.getElementById('djs-overlay-info').style.display = 'none';
        let overlayContainer = document.querySelectorAll('.djs-overlay-linting');
        _.each(overlayContainer, item => {
            item.remove();
        });
    }

    // 导入
    importXML = e => {
        const that = this;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            let data = '';
            reader.readAsText(file);
            reader.onload = function (event) {
                data = event.target.result;
                that.renderDiagram(data, 'open');
            };
        }
    };

    // 导出
    exportXML = () => {
        this.bpmnModeler.saveSVG({ format: true }, (err, data) => {
            this.download('svg', data);
        });
    };

    // 导出
    exportDia = () => {
        this.bpmnModeler.saveXML({ format: true }, (err, data) => {
            const dataTrack = 'bpmn';
            const a = document.createElement('a');
            const name = `diagram.${dataTrack}`;
            a.setAttribute(
                'href',
                `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`,
            );
            a.setAttribute('target', '_blank');
            a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
            a.setAttribute('download', name);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

    // 下载
    download = (type, data, name) => {
        let dataTrack = '';
        const a = document.createElement('a');

        switch (type) {
            case 'xml':
                dataTrack = 'bpmn';
                break;
            case 'svg':
                dataTrack = 'svg';
                break;
            default:
                break;
        }
        name = name || `diagram.${dataTrack}`;
        a.setAttribute(
            'href',
            `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`,
        );
        a.setAttribute('target', '_blank');
        a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
        a.setAttribute('download', name);

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 校验
    checkFun = () => {
        // this.ifCheck = true;
        // this.removeDom();
        verifyFlow(this.bpmnModeler);
    };

    cleanVerfify = () => { };

    //保存时的流程校验
    // saveVerify() {
    //   const _elements = this.bpmnModeler.get('elementRegistry').getAll();
    //   // let ifEmptyName = false;
    //   // let ifEmptyTimer = false;
    //   // let ifReturn = false;
    //   // let nameList = [];
    //   let root = this.bpmnModeler.get('canvas').getRootElement();
    //   _.each(_elements, ele => {
    //     if (ele.type === 'bpmn:UserTask') {
    //       if (!ele.businessObject.name) {
    //         ifEmptyName = true;
    //       } else if (
    //         ele.businessObject.overTimeMessage &&
    //         !ele.businessObject.overTimeMsgHour &&
    //         !ele.businessObject.overTimeMsgMinute
    //       ) {
    //         ifEmptyTimer = true;
    //       } else {
    //         nameList.push(ele.businessObject.name);
    //       }
    //       //若审批节点的退回规则已勾选，则判断该审批节点是否有服务
    //       if (ele.businessObject.returnValue) {
    //         const serviceValue = JSON.parse(ele.businessObject.serviceValue);
    //         //遍历该审批节点下的所有服务，若有服务，则将该节点名称push到returnList
    //         _.each(serviceValue, value => {
    //           if (value.length) {
    //             ifReturn = true;
    //           }
    //         });
    //         //若某一个审批节点勾选了退回规则，且流程中含有网关，且则ifReturn为true
    //         if (
    //           _.pluck(_elements, 'type')
    //             .toString()
    //             .includes('Gateway')
    //         ) {
    //           ifReturn = true;
    //         }
    //       }
    //     }
    //   });
    //   const uniqueList = new Set(nameList);
    //   //流程名是否为空
    //   if (!root.name || root.name === '') {
    //     message.warn('流程名称不能为空');
    //     return false;
    //   }
    //   //审批节点名称是否为空
    //   if (ifEmptyName) {
    //     message.warn('Approval node name cannot be empty');
    //     return false;
    //   }
    //   // 网关与退回规则同时存在
    //   // 审批节点存在服务与退回规则同时选择的情况
    //   if (ifReturn) {
    //     message.warn(
    //       '流程存在分支或者服务调用的情况下，请不要开启‘退回后重新提交至本节点’流程参数。',
    //     );
    //     return false;
    //   }
    //   //审批节点超时提醒是否存在未填项
    //   if (ifEmptyTimer) {
    //     message.warn('There is an open item in the timeout reminder');
    //     return false;
    //   }
    //   //审批节点名称是否重复
    //   if ([...uniqueList].length !== nameList.length) {
    //     message.warn('Duplicate approval node name, please check');
    //     return false;
    //   }
    //   return true;
    // }

    // 保存前的校验
    beforeSave = () => {
        const root = this.bpmnModeler.get('canvas').getRootElement().businessObject;
        const _elements = this.bpmnModeler.get('elementRegistry').getAll();

        // 更新根节点的processkey
        if (_.isEmpty(this.state.id)) {
            const id = _.uniqueId('process_');
            root.id = id;
            if (root.businessObject) {
                root.businessObject.id = id;
            }
        }

        if (!root.name) {
            message.warn('流程名称不能为空');
            return;
        }
        if (!root.modelType) {
            message.warn('模版类型不能为空');
            return;
        }
        // 审批人不能为空
        // 排他分支条件不能为空
        // 必须要有结束节点
        return true;
    };

    // 保存
    save = () => {
        // this.saveVerify();
        // todo 1流程校验  2是否设置为主流程
        if (this.beforeSave()) {
            this.bpmnModeler.saveXML({ format: true }, async (err, xml) => {
                console.log('xml', xml);
                let rootElement = this.bpmnModeler.get('canvas').getRootElement()
                    .businessObject;
                let data = {
                    setMainProcess: true,
                    process_name: rootElement.name || '',
                    process_key: rootElement.id,
                    process_xml: JSON.stringify(xml),
                    description: rootElement.description,
                    type: rootElement.modelType ? JSON.parse(rootElement.modelType) : {},
                    id: this.state.id,
                };
                request.post('/risk/flowable/flwTemplate/create', data).then(res => {
                    if (res) {
                        this.setState({
                            id: res.id,
                        });
                        message.success('保存成功');
                        // this.props.onClose();
                    }
                });
            });
        }
    };

    // 打开选人
    openAssign = () => {
        this.setState({
            visible: true,
        });
    };

    // 人岗
    handleOk = (assignList, type) => {
        // todo user. position
        const ids = _.pluck(assignList, 'id');
        this.setState({
            assignList: assignList,
        });
        this.changeField(assignList, 'checkAssignList');
        this.changeField(ids, 'candidateUsers');
        this.changeField(type, 'candtidateType');
        // todo 添加类别
        this.handleCancel();
    };

    // 人岗弹框关闭
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 删除人员
    handleDelete = id => {
        let assign = _.filter(this.state.assignList, i => i.id !== id);
        this.setState({
            assignList: assign,
        });
        const ids = _.pluck(assign, 'id');
        this.changeField(assign, 'checkAssignList');
        this.changeField(ids, 'candidateUsers');
    };

    // 设置过滤条件
    setDomain = () => {
        // 表单设置值
        let data = {};
        const { currentDomainItem, currentElement, domainIndex } = this.state;
        const obj = currentElement.gatewayObj;
        // data[currentDomainItem.id] = obj.valueExpression;
        // this.formRef.current.setFieldsValue(data);

        // 更新分支条件
        if (obj) {
            let outgoings = currentElement.outgoing;
            //网关处更新条件时要同时更新sequenceflow上的条件
            if (outgoings.length) {
                let defaultId = currentElement.default;
                currentElement.gatewayList[domainIndex].valueExpression =
                    obj.valueExpression;
                this.changeField(
                    obj.valueExpression,
                    'conditionExpression',
                    outgoings[domainIndex],
                );
                this.changeField(obj.domain, 'gatewayDomain', outgoings[domainIndex]);
                outgoings[domainIndex].gatewayObj = obj;
                this.changeField(
                    JSON.stringify(obj),
                    'expressionObj',
                    outgoings[domainIndex],
                );
                // this.changeField(defaultId,'default', currentElement.source);
                // this.changeField(defaultId,'default',this.element.source);
            }
        }
        // xml修改
        this.cancelDomain();
    };

    cancelDomain = () => {
        this.setState({ domainModal: false });
    };

    getDomainResult = ({ domain, script }) => {
        this.state.currentElement.gatewayObj = { domain, valueExpression: script };
    };

    render() {
        const {
            currentElement,
            visible,
            assignList,
            isRoot,
            typeData,
            domainModal,
            domainFields,
            fieldId,
            currentDomainItem,
        } = this.state;
        return (
            <div className={styles.designerContainer}>
                <div className={styles.leftContainer}>
                    <EditingTools
                        undo={this.undo}
                        redo={this.redo}
                        align={this.align}
                        arrange={this.arrange}
                        handleZoom={this.handleZoom}
                        importXML={this.importXML}
                        exportXML={this.exportXML}
                        checkFun={this.checkFun}
                        save={this.save}
                        cleanVerfify={this.cleanVerfify}
                    />
                    <div id="djs-overlay-info" onClick={this.closeCheck}>
                        {' '}
                    </div>
                    <div className={styles.canvas} id="canvas" />
                </div>
                <div className={styles.rightContainer}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="基本属性" key="1">
                            <Form ref={this.formRef} name="basic" labelCol={{ span: 24 }}>
                                {isRoot ? (
                                    <>
                                        <Form.Item
                                            label="流程名称"
                                            name="name"
                                            rules={[{ required: true, message: '请输入流程名称!' }]}
                                            className={styles.formItem}
                                        >
                                            <Input
                                                onChange={e => {
                                                    this.changeField(e.target.value, 'name');
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="模版类型"
                                            name="modelType"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '模版类型!',
                                                },
                                            ]}
                                            className={styles.formItem}
                                        >
                                            <Select
                                                labelInValue
                                                onChange={e => {
                                                    this.changeField(e, 'modelType');
                                                }}
                                            >
                                                {_.map(typeData, type => {
                                                    return (
                                                        <Select.Option value={type.id} key={type.id}>
                                                            {type.name}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="描述"
                                            name="description"
                                            rules={[{ required: true, message: '请输入描述!' }]}
                                            className={styles.formItem}
                                        >
                                            <Input.TextArea
                                                onChange={e => {
                                                    this.changeField(e.target.value, 'description');
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="流程属性"
                                            name="autoAttribute"
                                            rules={[{ required: false, message: '流程属性' }]}
                                            className={styles.formItem}
                                        >
                                            <Checkbox.Group
                                                onChange={e => {
                                                    this.changeField(e, 'autoAttribute');
                                                }}
                                            >
                                                <Checkbox value="autoPassSame">
                                                    匹配不到有效审批人时，自动审批通过
                        </Checkbox>
                                                <Checkbox value="autoPassEmpty">
                                                    审批人与制单人相同时，自动审批通过
                        </Checkbox>
                                                <Checkbox value="autoPassPerson">
                                                    审批人与制单人相同时，自动审批通过
                        </Checkbox>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </>
                                ) : (
                                        <>
                                            <Form.Item
                                                label="节点名称"
                                                name="name"
                                                rules={[{ required: true, message: '请输入节点名称' }]}
                                                className={styles.formItem}
                                            >
                                                <Input
                                                    onChange={e => {
                                                        this.changeField(e.target.value, 'name');
                                                    }}
                                                />
                                            </Form.Item>
                                        </>
                                    )}
                                {currentElement && currentElement.type === 'bpmn:UserTask' ? (
                                    <>
                                        <Form.Item
                                            label="审批人"
                                            name="Approver"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '审批人!',
                                                },
                                            ]}
                                            className={styles.formItem}
                                        >
                                            {
                                                <div className={styles.assignContainer}>
                                                    <div className={styles.assignItemContainer}>
                                                        {_.map(assignList, (i, index) => {
                                                            while (index < 3) {
                                                                return (
                                                                    <div className={styles.assignItem}>
                                                                        <span>{i.realName || i.name}</span>
                                                                        <span>
                                                                            <CloseCircleOutlined
                                                                                onClick={() => {
                                                                                    this.handleDelete(i.id);
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                    {(!assignList || assignList.length < 4) && (
                                                        <PlusCircleOutlined
                                                            onClick={this.openAssign}
                                                            className={styles.assignIcon}
                                                        />
                                                    )}
                                                    {assignList && assignList.length > 3 && (
                                                        <SmallDashOutlined
                                                            onClick={this.openAssign}
                                                            className={styles.assignIcon}
                                                        />
                                                    )}
                                                </div>
                                            }
                                        </Form.Item>
                                        <Form.Item
                                            label="审批类型"
                                            name="executeType"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '审批类型!',
                                                },
                                            ]}
                                            className={styles.formItem}
                                        >
                                            <Select
                                                onChange={e => {
                                                    this.changeField(e, 'executeType');
                                                }}
                                            >
                                                <Select.Option value="0">
                                                    或签(多人审批时，一人通过即可)
                        </Select.Option>
                                                <Select.Option value="1">
                                                    会签(多人审批时，需所有人通过)
                        </Select.Option>
                                                <Select.Option value="2">按比例通过</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) =>
                                                prevValues.executeType !== currentValues.executeType
                                            }
                                        >
                                            {({ getFieldValue }) => {
                                                return getFieldValue('executeType') === '2' ? (
                                                    <Form.Item
                                                        name="radio"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Please input your username!',
                                                            },
                                                        ]}
                                                        className={styles.formItem}
                                                    >
                                                        需要
                                                        <Input
                                                            onChange={e => {
                                                                this.changeField(e.target.value, 'radio');
                                                            }}
                                                            style={{ width: '20%' }}
                                                        />
                            %的人通过才算通过
                                                    </Form.Item>
                                                ) : null;
                                            }}
                                        </Form.Item>
                                        <Form.Item
                                            label="节点按钮"
                                            name="nodeButton"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your username!',
                                                },
                                            ]}
                                            className={styles.formItem}
                                        >
                                            <Checkbox.Group
                                                onChange={e => {
                                                    this.changeField(e, 'nodeButton');
                                                }}
                                            >
                                                <Checkbox value="0" disabled>
                                                    同意
                        </Checkbox>
                                                <Checkbox value="1" disabled>
                                                    退回
                        </Checkbox>
                                                <Checkbox value="2" disabled>
                                                    撤销
                        </Checkbox>
                                                <Checkbox value="3">撤回</Checkbox>
                                                <Checkbox value="4">授权</Checkbox>
                                                <Checkbox value="5">否决</Checkbox>
                                                <Checkbox value="6">加签</Checkbox>
                                                <Checkbox value="7">查看全流程</Checkbox>
                                                {/* <Checkbox value="8">传阅</Checkbox> */}
                                            </Checkbox.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="退回规则(退回时重新提交至本节点)"
                                            name="returnValue"
                                            rules={[{ required: true, message: '退回规则' }]}
                                            className={styles.formItem}
                                            valuePropName="checked"
                                        >
                                            <Switch
                                                onChange={e => {
                                                    this.changeField(e, 'returnValue');
                                                }}
                                            ></Switch>
                                        </Form.Item>
                                        <p className={styles.returnNote}>
                                            注: 存在分支和审批节点服务调用的情况下，请不要启用退回功能
                    </p>
                                    </>
                                ) : null}
                                {/* todo 并行分支条件 */}
                                {currentElement &&
                                    currentElement.type === 'bpmn:ExclusiveGateway' &&
                                    currentElement.gatewayList ? (
                                        <>
                                            <h4 className={styles.conditionTitle}>
                                                <b>分支条件</b>
                                            </h4>
                                            {/* 遍历element.gatewayList */}
                                            {_.map(currentElement.gatewayList, (way, index) => {
                                                return (
                                                    <Form.Item
                                                        key={way.id}
                                                        label={`排他分支条件-${way.targetRef.name || index}`}
                                                        name={way.id}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '分支条件',
                                                            },
                                                        ]}
                                                        className={styles.formItem}
                                                    >
                                                        <Input
                                                            disabled
                                                            // onChange={e => {
                                                            //   this.changeField(
                                                            //     e.target.value,
                                                            //     way.valueExpression,
                                                            //   );<EditFilled />
                                                            // }}
                                                            addonAfter={
                                                                <EditFilled
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            domainModal: true,
                                                                            currentDomainItem: way,
                                                                            domainIndex: index,
                                                                        });
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </Form.Item>
                                                );
                                            })}

                                            <Form.Item
                                                label="默认分支(不满足分支条件时)"
                                                name="default"
                                                rules={[{ required: true, message: '默认分支!' }]}
                                                className={styles.formItem}
                                            >
                                                <Select
                                                    onChange={e => {
                                                        this.changeField(e, 'default');
                                                    }}
                                                >
                                                    {_.map(currentElement.gatewayList, (way, index) => {
                                                        return (
                                                            <Select.Option key={way.id} value={way.id}>{`${way
                                                                .targetRef.name || index}`}</Select.Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </>
                                    ) : null}
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
                <WorkAssignSelect
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    selectedAssignList={assignList}
                    candidateUsers={_.pluck(assignList, 'id')}
                />
                <Modal
                    width={800}
                    visible={domainModal}
                    onOk={this.setDomain}
                    onCancel={this.cancelDomain}
                >
                    <WorkflowDomain
                        value={
                            currentDomainItem && currentDomainItem.expressionObj
                                ? JSON.parse(currentDomainItem.expressionObj)
                                : []
                        }
                        fields={domainFields}
                        getDomain={this.getDomainResult}
                    />
                </Modal>
            </div>
        );
    }
}

export default ProcessDesigner;
