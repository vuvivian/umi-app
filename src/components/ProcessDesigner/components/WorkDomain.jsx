/*
 * @Author: vuvivian
 * @Date: 2020-11-12 21:48:20
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 01:46:15
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/ProcessDesigner/components/WorkDomain.jsx
 */

import React, { Component } from 'react';
import { Button } from 'antd';

class WorkDomain extends Component{
  constructor (props) {
    super(props);
    this.state = {
      fieldList: props.fieldList
    }
  }

  onAddNode = (key, branch) => {
    // this.treeNode.addNode(key, branch);
  };

  render() {
    return (
      <div>
        <Button type="link" onClick={()=>{this.onAddNode('')}}>+ 添加过滤条件</Button>
      </div>
    )
  }
}

export default WorkDomain;