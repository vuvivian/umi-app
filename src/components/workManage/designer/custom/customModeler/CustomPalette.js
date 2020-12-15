/*
 * @Author: vuvivian
 * @Date: 2020-11-29 13:18:36
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-29 16:13:58
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/custom/customModeler/CustomPalette.js
 */
import { assign } from 'min-dash';

export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  spaceTool,
  lassoTool,
  handTool,
  globalConnect,
  translate,
) {
  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate',
];

PaletteProvider.prototype.getPaletteEntries = function() {
  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    // spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      let shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    let shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title,
      // title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }
  /**
   * 创建子节点按钮功能
   */
  function createSubprocess(event) {
    let subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true,
    });

    let startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess,
    });

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [startEvent],
      },
    });
  }

  // function createParticipant(event) {
  //   create.start(event, elementFactory.createParticipantShape());
  // }

  assign(actions, {
    // 创建手形拖拽工具
    'hand-tool': {
      group: 'tools',
      className: 'iconfont iconzhuashou entry-modifier',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        },
      },
    },

    // 创建选择工具
    'lasso-tool': {
      group: 'tools',
      className: 'iconfont iconkuangxuan entry-modifier',
      title: 'Activate the lasso tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        },
      },
    },

    // 创建开始节点
    'create.start-event': createAction(
      'bpmn:StartEvent',
      'event',
      'bpmn-icon-start-event-none entry-modifier',
      'Create StartEvent',
    ),

    // 创建结束节点
    'create.end-event': createAction(
      'bpmn:EndEvent',
      'event',
      'bpmn-icon-end-event-none entry-modifier',
      'Create EndEvent',
    ),

    // 创建互斥网关
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway',
      'gateway',
      'iconfont iconhuchiwangguan entry-modifier',
      'Create ExclusiveGateway',
    ),

    // 创建并行网关
    'create.parallel-gateway': createAction(
      'bpmn:ParallelGateway',
      'gateway',
      'iconfont iconbinghangwangguan entry-modifier',
      'Create ParallelGateway',
    ),

    // 创建用户节点
    'create.user-task': createAction(
      'bpmn:UserTask',
      'activity',
      'iconfont iconshenpijiedian1 entry-modifier',
      'Create UserTask',
    ),
    // 创建子流程
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'iconfont iconziliucheng-2 entry-modifier',
      title: translate('Create expanded SubProcess'),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess,
      },
    },
    // 创建连接线
    'global-connect-tool': {
      // group: 'tools',
      className: 'iconfont iconbianzu4 entry-modifier',
      title: translate('Activate the global connect tool'),
      action: {
        click: function(event) {
          globalConnect.toggle(event);
        },
      },
    },
  });

  return actions;
};
