/*
 * @Author: vuvivian
 * @Date: 2020-11-29 16:28:59
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-12-01 23:32:30
 * @Descripttion:
 * @FilePath: /rz_web/src/pages/system/workManage/designer/components/EditingTools/index.jsx
 */
import React, { Component, useEffect, useContext, useRef } from 'react';
import { Tooltip } from 'antd';
import styles from './index.less';

const EditingTools = ({
  undo,
  redo,
  align,
  arrange,
  handleZoom,
  importXML,
  exportXML,
  checkFun,
  save,
}) => {
  const fileRef = useRef();

  return (
    <div className={styles.container}>
      <Tooltip placement="bottom" className={styles.optionItem} title="后退">
        <span className="iconfont iconundo" onClick={undo} />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="前进">
        <span className="iconfont iconredo" onClick={redo} />
      </Tooltip>
      <span className="iconfont iconfengexian" className={styles.optionItem} />
      <Tooltip placement="bottom" className={styles.optionItem} title="左对齐">
        <span
          className="iconfont iconalign-left"
          onClick={() => {
            align('left');
          }}
        />
      </Tooltip>
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="左右居中对齐"
      >
        <span
          className="iconfont iconalign-center1"
          onClick={() => {
            align('center');
          }}
        />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="右对齐">
        <span
          className="iconfont iconalign-right"
          onClick={() => {
            align('right');
          }}
        />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="上对齐">
        <span
          className="iconfont iconborder-top"
          onClick={() => {
            align('top');
          }}
        />
      </Tooltip>
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="上下居中对齐"
      >
        <span
          className="iconfont iconborder-center"
          onClick={() => {
            align('middle');
          }}
        />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="下对齐">
        <span
          className="iconfont iconborder-bottom"
          onClick={() => {
            align('bottom');
          }}
        />
      </Tooltip>
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="一键整理"
      >
        <span className="iconfont iconundo" onClick={arrange} />
      </Tooltip>
      <span className="iconfont iconfengexian" />
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="放大"
        onClick={() => {
          handleZoom(0.1);
        }}
      >
        <span className="iconfont iconsearch-plus" />
      </Tooltip>
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="重置"
        onClick={handleZoom}
      >
        <span className="iconfont iconsearch" />
      </Tooltip>
      <Tooltip
        placement="bottom"
        className={styles.optionItem}
        title="缩小"
        onClick={() => {
          handleZoom(-0.1);
        }}
      >
        <span className="iconfont iconsearch-minus" />
      </Tooltip>
      <span className="iconfont iconfengexian" className={styles.optionItem} />
      <Tooltip placement="bottom" className={styles.optionItem} title="导入">
        <span
          className="iconfont icondaoru"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <input
          ref={fileRef}
          className={styles.openFile}
          type="file"
          onChange={e => {
            importXML(e);
          }}
        />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="导出">
        <span
          className="iconfont icondaochu"
          onClick={() => {
            exportXML();
          }}
        />
      </Tooltip>
      <span className="iconfont iconfengexian" className={styles.optionItem} />
      <Tooltip placement="bottom" className={styles.optionItem} title="验证">
        <span
          className="iconfont iconcheck"
          onClick={() => {
            checkFun();
          }}
        />
      </Tooltip>
      <Tooltip placement="bottom" className={styles.optionItem} title="保存">
        <span
          className="iconfont iconbaocun"
          onClick={() => {
            save();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default EditingTools;
