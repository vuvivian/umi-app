import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react';
import { Row, Col, Cascader, InputNumber, Input } from 'antd';
import { getOperatorsFromType } from './js/domain';
import { DomainContext } from './index';
import DomainNode from './DomainNode';
import _ from 'underscore';
import styles from './index.less';

const DomainLeaf = ({
  nodeData,
  selectFieldsData,
  propData,
  isDomain = false,
  formula = false,
}) => {
  const { changeDomain } = useContext(DomainContext);
  const [fieldChain, setFieldChain] = useState([]); // 选择字段
  const [displayOperator, setDisplayOperator] = useState('=');
  const [displayType, setDisplayType] = useState('0');
  const [displayValue, setDisplayValue] = useState('');
  const [operators, setOperators] = useState({});
  const [selectField, setSelectField] = useState({ type: 'char' });
  const [operatorChain, setOperatorChain] = useState([]);

  const fieldType = useMemo(() => {
    return selectField && selectField.type;
  }, [selectField]);
  const needNumber = useMemo(() => {
    return ['float', 'integer'].includes(fieldType);
  }, [fieldType]);

  const operatorData = useMemo(() => {
    let res = [];
    for (let key in operators) {
      const item = {
        value: key,
        label: operators[key],
        children: [],
      };
      if (!['set', 'not set'].includes(key)) {
        item.children = [
          { value: '0', label: '常量' },
          { value: '1', label: '字段' },
        ];
        if (formula) {
          item.children.push({ value: '2', label: '公式' });
        }
        if (isDomain) {
          item.children.push({ value: '3', label: '变量' });
        }
      }
      res.push(item);
    }
    return res;
  }, [operators]);
  const isSetOperator = useMemo(() => {
    return ['set', 'not set'].includes(displayOperator);
  }, [displayOperator]);

  useEffect(() => {
    setOperatorChain([displayOperator, displayType]);
  }, [displayOperator, displayType]);

  useEffect(() => {
    const { chain, valueType } = nodeData;
    const field = getSelectField(chain);
    setFieldChain(_.isString(chain) ? chain.split('.') : []);
    setSelectField(field);
    setOperators(getOperatorsFromType(field.type, isDomain));
    setDisplayType(valueType);
    setDisplayOperator(_initOperator());
    setDisplayValue(_initValue());
  }, [nodeData]);

  useEffect(() => {
    let value = null;
    if (displayValue && (!displayType || displayType === '0')) {
      // 变量的情况直接赋值
      if (fieldType === 'boolean' || isSetOperator) {
        value = !!+displayValue;
      } else if (fieldType === 'date') {
        value = displayValue.format('yyyy-MM-dd');
      } else if (fieldType === 'datetime') {
        value = displayValue.format('yyyy-MM-dd hh:mm:ss');
      } else {
        value = displayValue;
      }
    }
    nodeData.value = value || displayValue;
    if (nodeData.value !== '') {
      changeDomain();
    }
  }, [displayValue]);

  //获取选择的字段
  const getSelectField = (chain, arr) => {
    chain = chain.split('.');
    arr = arr || selectFieldsData;
    let res;
    for (let ch of chain) {
      res = arr.find(item => item.value === ch);
      //   if (res && res.children) {
      if (res) {
        arr = res.children || [];
      } else {
        res = {};
        break;
      }
    }
    return res;
  };

  const _initOperator = () => {
    let { operator, value } = nodeData;
    // const fieldType = selectField && selectField.type;
    if (fieldType !== 'boolean' && value === false) {
      operator = operator === '=' ? 'not set' : 'set';
    }
    return operator;
  };

  const _initValue = () => {
    let { value, valueType } = nodeData;
    // const fieldType = selectField && selectField.type;
    const isSetOperator = ['set', 'not set'].includes(displayOperator);
    if (valueType === '0') {
      if (fieldType === 'boolean' || isSetOperator) {
        value = value ? '1' : '0';
      } else if (fieldType === 'date' || fieldType === 'datetime') {
        value = value ? new Date(value) : new Date();
      }
    }
    return value;
  };

  // 切换字段
  const changeSelectField = (val, selectedOptions) => {
    // val = val.join('.');
    const valStr = val.join('.');
    if (valStr !== nodeData.chain) {
      setSelectField(getSelectField(valStr));
      nodeData.chain = valStr;
      if (!isDomain) {
        nodeData.longKey = getSelectField(valStr)
          ? getSelectField(valStr).longKey
          : '';
      }
    }
    setFieldChain(val);
    setOperators(getOperatorsFromType(getSelectField(valStr).type, isDomain));
    _resetValue();
    setTimeout(() => {
      nodeData.operator = '=';
      nodeData.valueType = '0';
      setDisplayOperator('=');
      setDisplayType('0');
    });
  };

  // 切换操作符
  const changeOperator = ([opt, type]) => {
    const isSetOpt = ['set', 'not set'].includes(opt);
    if (isSetOpt) {
      opt = opt === 'set' ? '!=' : '=';
      setDisplayValue(opt === '=' ? '0 ' : ' 0');
    }
    nodeData.operator = opt;
    nodeData.valueType = type || '0';
    setDisplayOperator(opt);
    setDisplayType(type || '0');
    !isSetOpt && _resetValue(opt, type);
  };

  const changeFieldValue = val => {
    setDisplayValue(val);
  };

  const _resetValue = (opt, type) => {
    opt = opt || displayOperator;
    type = type || displayType;
    const isSetOpt = ['set', 'not set'].includes(opt);
    if (
      (fieldType === 'date' || fieldType === 'datetime') &&
      !isSetOpt &&
      type == 0
    ) {
      setDisplayValue(new Date());
    } else {
      setDisplayValue('');
    }
  };

  return (
    <DomainNode className={'std-domain-leaf'} nodeData={nodeData}>
      <Row gutter={8} className={styles['domain-row']}>
        <Col span={8}>
          <Cascader
            style={{ width: '100%' }}
            options={selectFieldsData}
            value={fieldChain}
            onChange={changeSelectField}
          />
        </Col>
        <Col span={8}>
          <Cascader
            style={{ width: '100%' }}
            options={operatorData}
            value={operatorChain}
            onChange={changeOperator}
          />
        </Col>
        <Col span={8}>
          {needNumber ? (
            <InputNumber
              style={{ width: '100%' }}
              value={displayValue}
              onChange={changeFieldValue}
            />
          ) : (
            <Input
              style={{ width: '100%' }}
              value={displayValue}
              onChange={e => {
                changeFieldValue(e.target.value);
              }}
            />
          )}
        </Col>
      </Row>
    </DomainNode>
  );
};

export default DomainLeaf;
