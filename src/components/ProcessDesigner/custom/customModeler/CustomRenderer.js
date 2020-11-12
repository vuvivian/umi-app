/*
 * @Author: vuvivian
 * @Date: 2020-11-12 01:51:25
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-12 01:51:26
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/custom/customModeler/customRenderer.js
 */
/**
 * 继承customRenderer,修改画布上svg图案的颜色
 */
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'; // 引入默认的renderer
const HIGH_PRIORITY = 1500 ;// 最高优先级
const propertiesConfig = {
    'bpmn:StartEvent': {stroke:'#8FC887'},
    'bpmn:UserTask':{stroke:'#3D4584',strokeWidth:2,},
    'bpmn:EndEvent':{stroke:'#FF3B45'},
    'bpmn:FlowNode':{stroke:'#3D4584'},
    'bpmn:TextAnnotation':{stroke:'#3D4584'},
    'bpmn:ParallelGateway':{stroke:'#3D4584'},
    'bpmn:ExclusiveGateway':{stroke:'#3D4584'},
    'bpmn:Lane':{stroke:'#3D4584',fill:'#3D4584'},
    'bpmn:SequenceFlow':{stroke:'#3D4584'}    //连接线
};

export default class CustomRenderer extends BaseRenderer { // 继承BaseRenderer
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);
        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        return !element.labelTarget;
    }

    // 核心函数就是绘制shape
    drawShape(parentNode, element) { 
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        this.setShapeProperties(shape, element);
        return shape;
    }

    // 绘制连接线
    drawConnection(parentNode, element) { 
        const connect = this.bpmnRenderer.drawConnection(parentNode, element);
        this.setShapeProperties(connect, element);
        return connect;
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }

    setShapeProperties(shape,element){
        const type=element.type;
        if(propertiesConfig[type]){
            const properties= propertiesConfig[type];
            Object.keys(properties).forEach(prop=>{
                shape.style.setProperty(prop,properties[prop]);
            });
        }
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
