/*
 * @Author: vuvivian
 * @Date: 2020-11-12 01:56:58
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-14 15:52:50
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/custom/customModeler/index.js
 */

import Modeler from 'bpmn-js/lib/Modeler';
import inherits from 'inherits';
import CustomModule from './custom'

export default function CustomModeler(options) {
    Modeler.call(this, options);
    this._customElements = [];
}
inherits(CustomModeler, Modeler);
CustomModeler.prototype._modules = [].concat(
    CustomModeler.prototype._modules, [
        CustomModule
    ]
);
