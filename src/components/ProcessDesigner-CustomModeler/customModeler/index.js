/*
 * @Author: vuvivian
 * @Date: 2020-11-07 22:25:41
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-07 23:33:36
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner-CustomModeler/customModeler/index.js
 */
import Modeler from 'bpmn-js/lib/Modeler'

import inherits from 'inherits'

import CustomModule from './custom'

import './index.less'

export default function CustomModeler(options) {
    Modeler.call(this, options)

    this._customElements = []
}

inherits(CustomModeler, Modeler)

CustomModeler.prototype._modules = [].concat(
    CustomModeler.prototype._modules, [
        CustomModule
    ]
)