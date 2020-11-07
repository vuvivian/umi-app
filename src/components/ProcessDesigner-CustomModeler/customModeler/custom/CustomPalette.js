/*
 * @Author: vuvivian
 * @Date: 2020-11-07 22:26:10
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-08 01:40:56
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/customModeler/custom/CustomPalette.js
 */
/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */

 import '../../index.less'
export default function PaletteProvider(palette, create, elementFactory, globalConnect, bpmnFactory) {
  this.create = create
  this.elementFactory = elementFactory
  this.globalConnect = globalConnect
  this.bpmnFactory = bpmnFactory

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect',
  'bpmnFactory'
]

PaletteProvider.prototype.getPaletteEntries = function(element) {
  const {
      create,
      elementFactory,
      bpmnFactory
  } = this;

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

  function createStratEvent() {
      return function(event) {
          const shape = elementFactory.createShape({
              type: 'bpmn:StartEvent'
          });
          create.start(event, shape);
      }
  }

  function createGateway() {
      return function(event) {
          const shape = elementFactory.createShape({
              type: 'bpmn:ExclusiveGateway'
          });
          create.start(event, shape);
      }
  }

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
    //   title: title || translate('Create {type}', { type: shortType }),
     title: title,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
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
     // 并行网关
    'create.paralleles-gateway': createAction(
      'bpmn:ParallelesGateway', 'gateway', 'bpmn-icon-gateway-none',
      'Create Gateway'
    ),
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