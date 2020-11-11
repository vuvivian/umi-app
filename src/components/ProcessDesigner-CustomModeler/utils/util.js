/*
 * @Author: vuvivian
 * @Date: 2020-11-07 23:02:47
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-10 22:38:17
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/utils/util.js
 */
const customElements = ['bpmn:Task', 'bpmn:StartEvent'] // 自定义元素的类型
const customConfig = { // 自定义元素的配置
    'bpmn:Task': {
        'url': require('../../../assets/rules.png'),
        // 'url': 'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png',
        'attr': { x: 0, y: 0, width: 48, height: 48 }
    },
    'bpmn:StartEvent': {
        'url': 'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/start.png',
        'attr': { x: 0, y: 0, width: 40, height: 40 }
    }
}
const hasLabelElements = ['bpmn:StartEvent', 'bpmn:EndEvent'] // 一开始就有label标签的元素类型

/**
* 循环创建出一系列的元素
* @param {Array} actions 元素集合
* @param {Object} fn 处理的函数
*/
function batchCreateCustom(actions, fn) {
    const customs = {}
    actions.forEach(item => {
        customs[item['type']] = fn(...item['action'])
    })
    return customs
 }
export { customElements, customConfig, hasLabelElements, batchCreateCustom}