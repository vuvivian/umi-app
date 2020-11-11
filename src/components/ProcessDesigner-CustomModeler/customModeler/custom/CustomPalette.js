/*
 * @Author: vuvivian
 * @Date: 2020-11-07 22:26:10
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-10 23:27:17
 * @Descripttion: A palette that allows you to create BPMN _and_ custom elements.
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/customModeler/custom/CustomPalette.js
 */

import '../../index.less'
import { batchCreateCustom } from '../../utils/util'
import { customShapeAction, customFlowAction } from '../../utils/flowAction'
export default function PaletteProvider(palette, create, elementFactory, globalConnect, bpmnFactory, handTool, lassoTool) {
  this.create = create
  this.elementFactory = elementFactory
  this.globalConnect = globalConnect
  this.bpmnFactory = bpmnFactory
  this.lassoTool = lassoTool
  this.handTool = handTool

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect',
  'bpmnFactory',
  'handTool',
  'lassoTool'
]

PaletteProvider.prototype.getPaletteEntries = function(element) {
  const {create, elementFactory, bpmnFactory,globalConnect, lassoTool, handTool} = this;
  let actions = {};

  // 创建元素
  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(Object.assign({ type }, options));
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }
      create.start(event, shape);
    }

    const shortType = type.replace(/^bpmn:/, '');
    return {
      group,
      className,
    //   title: title || translate('Create {type}', { type: shortType }),
      title: title,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  // 创建线条
  function createConnect (type, group, className, title, options) {
    return {
      group,
      className,
      title: title,
      action: {
        click: function (event) {
          globalConnect.toggle(event)
        }
      }
    }
  }

  // demo节点的⌚事件
  function createTask() {
    return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task', { custom: 2 });
        // businessObject['custom'] = 1 // 这样不行
        const shape = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject
        });
        const label = elementFactory.createLabel();
        console.log(shape) // 只在拖动或者点击时触发
        console.log(label) // 只在拖动或者点击时触发
        create.start(event, shape);
        // create.start(event, label);
    }
  }

  // 开始节点事件
  function createStratEvent() {
    return function(event) {
        const shape = elementFactory.createShape({
            type: 'bpmn:StartEvent'
        });
        create.start(event, shape);
    }
  }
  // 
  function createGateway() {
      return function(event) {
          const shape = elementFactory.createShape({
              type: 'bpmn:ExclusiveGateway'
          });
          create.start(event, shape);
      }
  }

  
  return {
    'hand-tool': {
        group: 'tools',
        className: 'bpmn-icon-hand-tool',
        title: '激活抓手工具',
        action: {
          click: function(event) {
            handTool.activateHand(event);
          }
        }
      },
    'lasso-tool': {
        group: 'tools',
        className: 'bpmn-icon-lasso-tool',
        title: '激活套索工具',
        action: {
          click: function(event) {
            lassoTool.activateSelection(event);
          }
        }
      },
    'create.start-event': {
        group: 'event',
        className: 'icon-custom icon-custom-start',
        title: '创建开始节点',
        action: {
            dragstart: createStratEvent(),
            click: createStratEvent()
        }
    },
    'create.end-event': {
        group: 'event',
        className: 'icon-custom bpmn-icon-end-event-none',
        title: '创建结束节点',
        action: {
            dragstart: createStratEvent(),
            click: createStratEvent()
        }
     },
     'global-connect-tool':  {
        group: 'tools',
        className: 'icon-custom icon-custom-flow',
        title: '新增线',
        action: {
          click: function (event) {
            globalConnect.toggle(event)
          }
        }
      },
     // 并行网关
     'create.paralleles-gateway': {
        group: 'event',
        className: 'icon-custom bpmn-icon-gateway-none',
        title: '并行网关',
        action: {
            dragstart: createStratEvent(),
            click: createStratEvent()
        }
     },
     // 排他分支
     'create.exclusive-gateway': createAction(
        'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
        'Create Gateway'
      ),
      // 审核人
      'assignee': {
        group: 'tools',
        className: 'bpmn-icon-connection-multi',
        title: 'Assignees',
        action: {
          click: function(event) {
            globalConnect.toggle(event);
          }
        }
      },
      // 联结
      'global-connect-tool': {
        group: 'tools',
        className: 'bpmn-icon-connection-multi',
        title: 'Activate the global connect tool',
        action: {
          click: function(event) {
            globalConnect.toggle(event);
          }
        }
      },
      'create.lindaidai-task': {
          group: 'model',
          className: 'icon-custom lindaidai-task',
          title: '创建一个类型为lindaidai-task的任务节点',
          action: {
              dragstart: createTask(),
              click: createTask()
          }
      },
     
  }
}