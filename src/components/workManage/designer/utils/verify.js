/*
 * @Author: vuvivian
 * @Date: 2020-12-01 00:48:19
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-02 00:23:39
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/utils/verify.js
 */
import _ from 'underscore';
// import transate from '@/views/flow/workflow/customTranslate/customTranslate';

//error数组push
const pushErrorList = (element, errorElementList, type, des, ifPush) => {
  element.errorMsgList.push({
    des: des,
    type: type,
  });
  if (ifPush) {
    return;
  }
  errorElementList.push(element);
};
const addErrorInfor = (bpmnModeler, id, option) => {
  let overlays = bpmnModeler.get('overlays');
  overlays.add(id, 'linting', option);
};
export const verifyFlow = bpmnModeler => {
  //获取当前流程中的所有element
  let _elements = bpmnModeler.get('elementRegistry')._elements;
  let errorElementList = [];
  //清空节点
  let i = 0; //process节点会出现两次，用作计数
  let errorNumber = 0; //错误个数
  let warnNumber = 0; //警告个数
  //获取所有有错的element
  _.each(_elements, ele => {
    //基本属性节点只走一次
    if (ele.element.type === 'bpmn:Process' && i < 1) {
      i++;
      ele.element.errorMsgList = [];
      //流程名为空
      if (!ele.element.name) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '流程名称不能为空',
          true,
        );
      }
      //流程描述为空
      if (!ele.element.description) {
        pushErrorList(
          ele.element,
          errorElementList,
          'warn',
          '没有填写流程描述',
          true,
        );
      }
      //开始节点个数
      let eleObj = _.countBy(_elements, ele => {
        return ele.element.type === 'bpmn:StartEvent'
          ? 'startNumber'
          : 'elseNumber';
      });
      //是否有结束节点
      let endEle = _.find(_elements, ele => {
        return ele.element.type === 'bpmn:EndEvent';
      });
      //并行分支节点个数
      let eleObj1 = _.countBy(_elements, ele => {
        return ele.element.type === 'bpmn:ParallelGateway'
          ? 'paraNumber'
          : 'elseNumber';
      });
      //若没有开始节点
      if (!eleObj.startNumber) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '没有开始节点',
          true,
        );
      }
      //开始节点个数大于1
      if (eleObj.startNumber > 1) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '多个开始节点',
          true,
        );
      }
      //没有结束节点
      if (!endEle) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '没有结束节点',
          true,
        );
      }
      //并行网关个数需大于2
      if (eleObj1.paraNumber === 1) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '并行分支需要分裂和聚合',
          true,
        );
      }
      if (ele.element.errorMsgList.length > 0) {
        errorElementList.push(ele.element);
      }
    }
    if (
      (ele.element.type === 'bpmn:UserTask' ||
        ele.element.type.includes('Gateway') ||
        ele.element.type.includes('Event')) &&
      ele.element.type !== 'bpmn:BoundaryEvent'
    ) {
      ele.element.errorMsgList = [];
      //判断各个节点是否有出入线
      if (
        ele.element.outgoing.length == 0 &&
        ele.element.incoming.length == 0
      ) {
        pushErrorList(
          ele.element,
          errorElementList,
          'error',
          '元素没有连线或者出线',
        );
      } else {
        !ele.element.type.includes('Event') && ele.element.outgoing.length == 0
          ? pushErrorList(
              ele.element,
              errorElementList,
              'error',
              'Element is not outgoing',
            )
          : null;
        !ele.element.type.includes('Event') && ele.element.incoming.length == 0
          ? pushErrorList(
              ele.element,
              errorElementList,
              'error',
              'Element is not wired',
            )
          : null;
      }

      //判断是否存在指向自己的情况
      if (ele.element.outgoing.length > 0) {
        let targetSelf = _.find(ele.element.outgoing, val => {
          //节点type一致且id一致
          return (
            val.target.type === ele.element.type &&
            val.target.id === ele.element.id
          );
        });
        if (targetSelf) {
          pushErrorList(
            ele.element,
            errorElementList,
            'error',
            '存在指向自己的节点定义',
          );
        }
      }
      //除网关节点外，其他节点只能有一个输入/输出流
      if (
        ele.element.type === 'bpmn:UserTask' ||
        ele.element.type.includes('Event')
      ) {
        if (ele.element.incoming.length > 1) {
          pushErrorList(
            ele.element,
            errorElementList,
            'warn',
            '有多个输入流，建议配合分支进行设置',
          );
        }
        if (ele.element.outgoing.length > 1) {
          pushErrorList(
            ele.element,
            errorElementList,
            'warn',
            '有多个输出流，建议配合分支进行设置',
          );
        }
      }
      //审批节点要有审批人
      if (ele.element.type === 'bpmn:UserTask') {
        //审批人需要取到businessObject节点
        if (
          !ele.element.businessObject.candidateUsers ||
          ele.element.businessObject.candidateUsers === ''
        ) {
          pushErrorList(
            ele.element,
            errorElementList,
            'error',
            '审批节点没有定义审批人',
          );
        }
      }
      //排它分支没有定义分支条件
      if (
        ele.element.type === 'bpmn:ExclusiveGateway' &&
        ele.element.outgoing.length > 1
      ) {
        let emptyExpression = _.find(ele.element.outgoing, list => {
          return (
            list.type === 'bpmn:SequenceFlow' &&
            (!list.businessObject.gatewayDomain ||
              list.businessObject.gatewayDomain == '[]')
          );
        });
        if (emptyExpression) {
          pushErrorList(
            ele.element,
            errorElementList,
            'warn',
            '排他分支没有定义分支条件',
          );
        }
      }
    }
  });
  let str;
  _.each(Array.from(new Set(errorElementList)), list => {
    str = '';
    let position;
    let errorEle;
    if (list.type === 'bpmn:Process') {
      position = {
        top: 136,
        left: 136,
      };
    } else {
      position = {
        top: -6,
        left: -6,
      };
    }
    let errorType = true;
    _.each(list.errorMsgList, err => {
      let errorIcon;
      if (err.type === 'error') {
        errorType = false;
        errorNumber++;
        errorIcon = 'iconcart_full';
      } else {
        warnNumber++;
        errorIcon = 'iconwarn3f';
      }
      str += `<li class="error1"><i class="iconfont ${errorIcon}"></i><a title="${err.des}" data-rule="fake-join" data-message="${err.des}">${err.des}</a></li>`;
    });
    errorEle = errorType ? 'iconwarn3f' : 'iconcart_full';
    let option = {
      position: position,
      scale: false,
      html: `<div class="bjsl-overlay bjsl-issues-top-right"><div class="bjsl-icon iconfont ${errorEle}"></div>
              <div class="bjsl-dropdown"><div class="bjsl-dropdown-content"><div class="bjsl-issues"><ul>${str}</ul></div></div></div></div>`,
    };
    addErrorInfor(bpmnModeler, list.id, option);
  });
  let numberClass =
    errorNumber === 0 && warnNumber === 0
      ? 'bjsl-button-success iconfont iconsuccess1'
      : 'bjsl-button-error iconcart_full';
  let numberHtml = `<button class="bjsl-button iconfont ${numberClass}"><span>${errorNumber}个错误, ${warnNumber}个警告</span></button>`;
  document.getElementById('djs-overlay-info').innerHTML = numberHtml;
  document.querySelector('.djs-overlay-container').style.display = 'block';
  document.getElementById('djs-overlay-info').style.display = 'block';
};
