import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react';
import { Button, Modal, Tabs, Radio, Space, Menu, Switch, Input } from 'antd';
import { DeleteOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import _ from 'underscore';
import DomainTree from './DomainTree';
import ClassDomainTree from './js/DomainTree';

export const DomainContext = createContext(null);

const WorkDomain = ({
  value = { domain: [], valueExpression: '' },
  fields,
  isDomain = false,
  getDomain,
}) => {
  const [hideAddBtn, setHideAddBtn] = useState(false);
  const [treeNode, setTreeNode] = useState({});
  const [propData, setPropData] = useState({});

  useEffect(() => {
    const domain = handleDomain(value);
    let node = new ClassDomainTree(
      domain,
      {
        defaultValue: getDomainDefaultValue(fields),
        fieldsData: fields,
        isDomain: isDomain,
      },
      [value],
    );
    setTreeNode(node);
    domain.length > 1 ? setHideAddBtn(true) : setHideAddBtn(false);
  }, [value]);

  // 处理domain
  const handleDomain = value => {
    let result = Array.isArray(value) ? value : value.domain;
    if (!result) result = [];
    if (result.length <= 1) {
      result = ['&'].concat(result);
    }
    return result;
  };

  // 获取默认
  const getDomainDefaultValue = (fields = []) => {
    let firstField = fields[0];
    while (firstField && firstField.children && firstField.children.length) {
      firstField = firstField.children[0];
    }
    return firstField && firstField.name;
  };

  //
  const onAddNode = (key, branch) => {
    treeNode.addNode(key, branch);
    setPropData({
      key: key,
    });
    setHideAddBtn(true);
  };

  //
  const changeDomain = () => {
    if (!treeNode.children.length) {
      setHideAddBtn(false);
    }
    const domain = treeNode.getDomain();
    const script = treeNode.getScript('', fields);
    // const res = Array.isArray(this.value) ? domain : {checked: this.value.checked, domain};
    // this.$emit('input', res);
    setPropData({
      key: '',
    });
    getDomain({ domain, script });
  };

  return (
    <DomainContext.Provider
      value={{ addNode: onAddNode, changeDomain: changeDomain }}
    >
      <div className={styles.domainContainer}>
        {!hideAddBtn ? (
          <div className={styles.addFilter}>
            <PlusOutlined
              onClick={() => {
                onAddNode('');
              }}
            />{' '}
            添加过滤条件 {hideAddBtn}
          </div>
        ) : (
          <div class={styles.domainSelector}>
            <DomainTree nodeData={treeNode} propData={propData} />
          </div>
        )}
      </div>
    </DomainContext.Provider>
  );
};

export default WorkDomain;
