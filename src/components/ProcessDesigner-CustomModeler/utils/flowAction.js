/*
 * @Author: vuvivian
 * @Date: 2020-11-10 22:34:36
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-10 23:21:50
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/utils/flowAction.js
 */
const customFlowAction = [{ // 线
  type: 'global-connect-tool',
  action: ['bpmn:SequenceFlow', 'tools', 'icon-custom icon-custom-flow', '连接线']
}];
const customShapeAction = [ // shape
  {
    type: 'create.hand-tool',
    action: ['bpmn:HandTool', 'tools', 'icon-custom entry bpmn-icon-hand-tool', '抓手工具']
  },
  {
    type: 'create.lasso-tool',
    action: ['bpmn:LassoTool', 'tools', 'icon-custom entry bpmn-icon-lasso-tool', '套索工具']
  },
  {
    type: 'create.start-event',
    action: ['bpmn:StartEvent', 'event', 'icon-custom bpmn-icon-start-event-none', '开始节点']
  },
  {
      type: 'create.end-event',
      action: ['bpmn:EndEvent', 'event', 'icon-custom entry bpmn-icon-end-event-none', '结束节点']
  }
]

export { customShapeAction, customFlowAction }