/*
 * @Author: vuvivian
 * @Date: 2020-11-17 22:09:20
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-17 23:08:06
 * @Descripttion: 
 * @FilePath: /umi-app/src/components/AsyncTree/index.js
 */
import React from 'react';
import {Tree, Input,Icon} from 'antd';
import {getTree} from './service';

const {TreeNode} = Tree;
const Search = Input.Search;

class AsyncTree extends  React.Component {
  constructor(props) {
    super(props);
    const {treeUrl, treeParam} = props;
    this.state = {
      treeData:[], 
      // treeUrl:treeUrl || "",//接口URL
      treeParam:treeParam,//渲染目录的参数
      expandedKeys: [],
      loadedKeys: []
    }
  }
  componentDidMount(){
    this.props.onRef && this.props.onRef(this);
    this.searchData();

  };

  // 异步下拉人岗选择树形
  searchData = async function(param){
    const {callBack} = this.props;
    const res = await getTree(param);
    res.then((r)=>{
      console.log(r, 'rrr')
      this.setState({
        treeData:res.data,
        expandedKeys:[],
        loadedKeys:[]
      })
    })
  }
  // 展开
  onExpand=(e) => {
    this.setState({
      expandedKeys: e
    })
  };

  onLoadData = async function (treeNode){
    // return new Promise((resolve) => {
      if (treeNode.props.children && treeNode.props.children.length > 0) {
        resolve();
        return new Promise();
      }
      const dataRef = treeNode.props.dataRef;
      const param = {emId:dataRef.key};
      const res = await getTree(param);
      return res.then(r => {
        if(!Array.isArray(res.data)){
          return;
        }
        this.state.loadedKeys.push(dataRef.key);
        treeNode.props.dataRef.children = res.data;
        this.setState({
            loadedKeys:loadedKeys,
            treeData: [...this.state.treeData],
        });
        // resolve();
      })
    // })
  };
  
  render() {
    const {expandedKeys, loadedKeys, treeData} = this.state;

    const loop = (data, parent) => _.map(data, (item) => {
      if (item.children) {
        return (
          // todo icon title
          <TreeNode isLeaf={item.isChildren !== 'true'} key={item.key} title={item.title} parentRef={parent} dataRef={item}>
            {loop(item.children,item)}
          </TreeNode>
        )
      }
      return (<TreeNode isLeaf={item.isChildren !== 'true'} key={item.key} title={item.title} parentRef={parent} dataRef={item}/>)
    })

    return (
      <div>
        <Tree
          showLine
          showIcon
          loadData={this.onLoadData}
          onExpand={this.onExpand}
          expandedKeys = {expandedKeys}
          loadedKeys = {loadedKeys}
          {...this.props}
        >
           {loop(treeData)}
        </Tree>
      </div>
    )
  }
}

export default AsyncTree