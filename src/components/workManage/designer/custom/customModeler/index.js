/*
 * @Author: vuvivian
 * @Date: 2020-11-29 13:05:26
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-29 13:49:34
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/custom/customModeler/index.js
 */
import Modeler from 'bpmn-js/lib/Modeler';
import inherits from 'inherits';
import CustomModule from './custom';
import './index.less';

export default function CustomModeler(options) {
  Modeler.call(this, options);
  this.customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
  CustomModule,
]);
