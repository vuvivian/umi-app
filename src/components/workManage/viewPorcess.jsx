/*
 * @Author: vuvivian
 * @Date: 2020-12-12 22:57:38
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-15 21:57:50
 * @Descripttion:
 * @FilePath: /umi-app/src/components/workManage/viewPorcess.jsx
 */

import React, {
    useEffect,
    useRef,
    useState,
    Component,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { Button, Select, message, Row, Input, notification, Table } from 'antd';
import request from '@/utils/request';
import { Container, RzDrawer, RzModal, wrapperKeepAlive } from '@/components';
import { ProTable } from '@/bcompoents';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import styles from './style.less';

const columns = [
    {
        title: '流程责任人',
        dataIndex: 'people',
        width: '30%',
        valueType: 'text',
    },
    {
        title: '节点类型',
        dataIndex: 'type',
        width: '20%',
        valueType: 'text',
    },
    {
        title: '审核结果',
        dataIndex: 'result',
        width: '25%',
        valueType: 'text',
    },
    {
        title: '完成时间',
        dataIndex: 'makespan',
        width: '30%',
        valueType: 'text',
    },
    {
        title: '备注',
        dataIndex: 'remarks',
        width: '40%',
        valueType: 'text',
    },
];

class ViewProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canvas: null,
            processId: props.processId,
            proInstanceId: props.proInstanceId,
            height: props.height,
            tableData: props.tableData || [],
            xml: props.xml || '',
            oldNodeId: props.oldNodeId || null,
            currentNodeId: props.currentNodeId || null,
        };
    }

    componentDidMount() {
        this.createNewDiagram();
    };

    createNewDiagram = () => {
        // const { height } = this.state;
        // this.$refs.content.parentNode.style.height = height;
        // this.$refs.content.style.height = height;
        const that = this;
        // this.container = this.$refs.content
        const canvas = document.getElementById('canvas');
        // 先移除之前的图
        canvas.innerHTML = '';
        this.bpmnModeler = new BpmnModeler({
            container: canvas,
        });
        const bpmnXmlStr = this.state.xml;
        this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
            if (err) {
                console.error(err);
            }
            const canvas = that.bpmnModeler.get('canvas');
            canvas.zoom('fit-viewport', 'center');
            that.success(that.bpmnModeler, canvas);
        });
    };

    success = (bpmnModeler, canvas) => {
        const { oldNodeId, currentNodeId } = this.state;
        oldNodeId ? this.setDefaultColor(this.bpmnModeler, '#C9C9C9') : this.setDefaultColor(this.bpmnModeler, '#3D4584');                             //设置流程默认颜色
        oldNodeId ? this.setNodeColor(oldNodeId, '#3D4584', this.bpmnModeler) : null;       //设置已过流程颜色
        currentNodeId ? this.setCurrentNodeColor(currentNodeId, 'nodeSuccess', canvas) : null;  //设置当前节点颜色
        // this.addBpmnListener(this, bpmnModeler);
    };

    /**
     * 设置默认颜色
     * @param {*} bpmnModeler
     * @param {*} color
     */
    setDefaultColor(bpmnModeler, color) {
        const elements = bpmnModeler.get('elementRegistry')._elements;
        let nodeObj = { shape: [], end: '', start: '' }
        for (let key in elements) {
            let element = elements[key].element;
            nodeObj = this.nodeClassify(nodeObj, element);
        }
        this.colorChange(nodeObj, bpmnModeler, color);
    };

    /**
     * 已经走过的流程设置颜色
     * @param {*} nodeCodes 
     * @param {*} colorClass 
     * @param {*} canvas 
     */
    setNodeColor(nodeCodes, color, bpmnjs) {
        const elementRegistry = bpmnjs.get('elementRegistry');
        let nodeObj = { shape: [], end: '', start: '' }
        for (let i = 0; i < nodeCodes.length; i++) {
            let element = elementRegistry.get(nodeCodes[i]);
            nodeObj = this.nodeClassify(nodeObj, element)
        }
        this.colorChange(nodeObj, bpmnjs, color);
    };

    /**
    * 区分普通节点和开始、结束节点
    * @param {*} nodeObj 
    * @param {*} element 
    */
    nodeClassify(nodeObj, element) {
        if (element.type === 'bpmn:EndEvent') {
            nodeObj.end = element;
        } else if (element.type === 'bpmn:StartEvent') {
            nodeObj.start = element;
        } else {
            nodeObj.shape.push(element);
        }
        return nodeObj;
    };

    /**
     * 改变节点颜色
     * @param {*} nodeObj 
     * @param {*} bpmnjs 
     * @param {*} color 
     */
    colorChange(nodeObj, bpmnjs, color) {
        const modeling = bpmnjs.get('modeling');
        nodeObj.shape.length && modeling.setColor(nodeObj.shape, { stroke: color });                   //普通节点
        nodeObj.end ? modeling.setColor(nodeObj.end, { stroke: color }) : null;    //结束节点
        nodeObj.start ? modeling.setColor(nodeObj.start, { stroke: '#3D4584' }) : null; //开始节点
    };

    /**
     * 设置当前活动节点颜色
     * @param {*} bpmnModeler 
     */
    setCurrentNodeColor(nodeCodes, colorClass, canvas) {
        for (let i = 0; i < nodeCodes.length; i++) {
            canvas.addMarker(nodeCodes[i], colorClass)
        }
    };

    render() {
        const { tableData } = this.state;
        return (
            <div className={styles.viewContainer}>
                <div id="canvas" class="canvas" ref="canvas"></div>
                <ProTable
                    columns={columns}
                    request={null}
                    showPage={false}
                    toolBarRender={false}
                    search={false}
                    dataSource={tableData}
                />
            </div>
        );
    }
}

export default ViewProcess;
