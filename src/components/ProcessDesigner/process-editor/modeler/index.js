/*
 * @Author: vuvivian
 * @Date: 2020-11-04 21:43:38
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-04 22:17:15
 * @Descripttion: 集成modeler
 * @FilePath: /umi-app/src/components/ProcessDesigner/process-editor/modeler/index.js
 */
import Modeler from 'bpmn-js/lib/Modeler';

import { inherits } from 'util';

import CustomPalette from './customPalette';

export default function CustomModeler(options) {
  Modeler.call(this, options);

  this.CustomElement = [];
}

CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
  // CustomTranslate,
  CustomPalette,
  // CustomContextPad
  // ColorPickerModule,
]);

inherits(CustomModeler, Modeler);