/*
 * @Author: vuvivian
 * @Date: 2020-11-12 01:53:55
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-14 17:21:30
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/custom/customModeler/CustomContextPad.js
 */
import {
  assign,
  forEach,
  isArray
} from 'min-dash';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil.js';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';


/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
    config, injector, eventBus,
    contextPad, modeling, elementFactory,
    connect, create, popupMenu,
    canvas, rules, translate) {

  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, function(event) {
    let context = event.context,
        shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    let entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  let contextPad = this._contextPad,
      modeling = this._modeling,

      elementFactory = this._elementFactory,
      connect = this._connect,
      create = this._create,
      popupMenu = this._popupMenu,
      canvas = this._canvas,
      rules = this._rules,
      autoPlace = this._autoPlace,
      translate = this._translate;

  let actions = {};

  if (element.type === 'label') {
    return actions;
  }

  let businessObject = element.businessObject;

  function startConnect(event, element) {
    connect.start(event, element);
  }

  function removeElement() {
    modeling.removeElements([ element ]);
  }

  function getReplaceMenuPosition(element) {

    const Y_OFFSET = 5;

    let diagramContainer = canvas.getContainer(),
        pad = contextPad.getPad(element).html;

    let diagramRect = diagramContainer.getBoundingClientRect(),
        padRect = pad.getBoundingClientRect();

    let top = padRect.top - diagramRect.top;
    let left = padRect.left - diagramRect.left;

    let pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    };

    return pos;
  }


  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
    }

    function appendStart(event, element) {

      let shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element
      });
    }


    let append = autoPlace ? function(event, element) {
      let shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape);
    } : appendStart;


    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }


  if (is(businessObject, 'bpmn:FlowNode')) {

    if (is(businessObject, 'bpmn:EventBasedGateway')) {
      assign(actions, {});
    } else

    if (isEventType(businessObject, 'bpmn:BoundaryEvent', 'bpmn:CompensateEventDefinition')) {
      assign(actions, {});
    } else if (!is(businessObject, 'bpmn:EndEvent') &&
      //符合条件的这些节点点击时不展示右侧pannel
      !is(businessObject, 'bpmn:BoundaryEvent') &&
      !businessObject.isForCompensation &&
      !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
      !isEventSubProcess(businessObject)) {

      assign(actions, {
        // 创建结束事件
        'append.end-event': appendAction(
          'bpmn:EndEvent',
          'bpmn-icon-end-event-none',
          translate('Append EndEvent')
        ),
        // 创建用户任务
        'append.user-task': appendAction(
            'bpmn:UserTask',
            'iconfont iconshenpijiedian1',
            translate('Append UserTask')
          ),
        // 创建互斥网关
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'iconfont iconhuchiwangguan',
          translate('Append ExclusiveGateway')
        ),
        // 创建并行网关
        'append.parallel-gateway': appendAction(
          'bpmn:ParallelGateway',
          'iconfont iconbinghangwangguan',
          translate('Append ParallelGateway')
        ),
      });
    }
  }
  
  /** 
   * 是否展示小扳手图标
   * 审批节点小扳手暂时不允许出现（不展示子流程）
   */
  if (!popupMenu.isEmpty(element, 'bpmn-replace') 
      && element.type !== 'bpmn:SequenceFlow' 
      && element.type !== 'bpmn:StartEvent'
      && element.type !== 'bpmn:EndEvent' 
      && element.type !== 'bpmn:BoundaryEvent' 
      && element.type !== 'bpmn:UserTask' 
      ) {
    // Replace menu entry
    assign(actions, {
      'replace': {
        group: 'connect',
        className: 'bpmn-icon-screw-wrench',
        title: translate('Change type'),
        action: {
          click: function(event, element) {
            //节点切换时，将name清掉
            element.businessObject.name='';
            let position = assign(getReplaceMenuPosition(element), {
              cursor: { x: event.x, y: event.y }
            });

            popupMenu.open(element, 'bpmn-replace', position);
          }
        }
      }
    });
  }

  if (isAny(businessObject, [
    'bpmn:FlowNode',
    'bpmn:InteractionNode',
    'bpmn:DataObjectReference',
    'bpmn:DataStoreReference'
  ]) && element.type !== 'bpmn:BoundaryEvent') {

    assign(actions, {
      // 创建文本框 暂时注掉
      // 'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation',translate('Append TextAnnotation')),

      'connect': {
        group: 'connect',
        className: 'iconfont iconbianzu4',
        title: translate('Connect using ' +
                  (businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or ') +
                  'Association'),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  if (isAny(businessObject, [ 'bpmn:DataObjectReference', 'bpmn:DataStoreReference' ])) {
    assign(actions, {
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using DataInputAssociation'),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  // delete element entry, only show if allowed by rules
  var deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

  if (isArray(deleteAllowed)) {

    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element;
  }

  if (deleteAllowed && element.type !== 'bpmn:BoundaryEvent') {
    assign(actions, {
      'delete': {
        group: 'connect',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    });
  }

  return actions;
};


// helpers /////////

function isEventType(eventBo, type, definition) {

  var isType = eventBo.$instanceOf(type);
  var isDefinition = false;

  var definitions = eventBo.eventDefinitions || [];
  forEach(definitions, function(def) {
    if (def.$type === definition) {
      isDefinition = true;
    }
  });

  return isType && isDefinition;
}
