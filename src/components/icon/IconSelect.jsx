import { createFromIconfontCN } from '@ant-design/icons';
import cs from 'classnames';
import { Modal, Button, Icon } from 'antd';
import styles from './iconSelect.less';
import React, { useEffect, useState } from 'react';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2127803_zh6ocqtjrnh.js',
});

const iconList = [
  'iconjiantoushang',
  'iconjiantoushang1',
  'iconjiantouyou',
  'iconjiantouxia',
  'iconwode',
  'iconqiehuanzhanghu',
  'iconjiajian',
  'iconjiajian-jia',

  'iconiconfontxuanzekuangyixuan',
  'iconxuankuang',
  'iconadd',
  'iconarrow-down',
  'iconashbin',
  'iconbrowse',
  'iconchart-bar',
  'iconattachment',

  'iconclose',
  'iconcomplete',
  'icondirection-right',
  'icondirection-up',
  'iconfilter',
  'iconlink',
  'iconfullscreen-shrink',
  'iconfullscreen-expand',

  'iconmenu',
  'iconloading',
  'iconminus-circle',
  'iconmore',
  'iconprint',
  'iconminus',
  'iconsave',
  'iconsetting',

  'iconsurvey',
  'icontext',
  'iconuser',
  'iconzoom-in',
  'iconadd-bold',
  'iconarrow-left-bold',
  'iconarrow-up-bold',
  'iconclose-bold',

  'iconminus-bold',
  'iconselect-bold',
  'iconarrow-left-filling',
  'iconarrow-right-filling',
  'iconfilter-filling',
  'iconnotification-filling',
  'iconuser-filling',
  'iconsetting-filling',

  'icontask-filling',
  'iconsuccess-filling',
  'iconwarning-filling',
  'iconfolder-filling',
  'iconchakan',
  'iconchakan1',
  'iconbianji',
  'iconpizhun',

  'iconpdf',
  'iconselectdownload',
  'iconPrint2',
  'iconbaocun',
  'iconweixin',
  'icona-copy',
  'iconicon4',
  'iconmubiao',

  'iconjian',
  'iconB',
  'iconbumen',
  'iconxiazai',
  'iconzhanlvezhongguo',
  'iconC-',
  'iconcaidan',
  'icond',

  'iconyouhuiquanguanli-',
  'icongangweizhize',
  'iconId',
  'iconkaohe',
  'iconjia',
  'iconbumen1',
  'iconshangchuan',
  'iconmubiao1',

  'iconzhuye',
  'iconbumen2',
  'iconjian1',
  'iconzhifubao',
  'iconjiaren-',
  'iconjiax',
  'iconadd-circle',
  'icontask',

  'iconzoom-out',
  'iconarrow-up-filling',
  'iconarrow-down-filling',
  'iconzhize',
  'iconjiagou',
  'iconrili',
  'icontubiaozhizuomoban-03',
  'icontubiaozhizuomoban-01',

  'icontubiaozhizuomoban-94',
  'icontubiaozhizuomoban-134',
  'iconall',
  'iconbussiness-man',
];

const IconSelect = ({ value, onChange, color = 'rgba(60, 57, 57)' }) => {
  const [visible, setVisible] = useState(false);
  const [currValue, setCurrValue] = useState(value);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setCurrValue(value);
  }, [value]);

  const changeIcon = val => {
    setTempValue(val);
  };

  const handleOk = () => {
    if (tempValue) {
      setCurrValue(tempValue);
      onChange(tempValue);
    }
    setVisible(false);
  };

  return (
    <div className={styles['icon-select']}>
      <div className={styles['icon-select-box']}>
        {currValue && (
          <IconFont style={{ fontSize: '18px', color }} type={currValue} />
        )}
      </div>
      <a onClick={() => setVisible(true)}>添加</a>
      <Modal
        title="选择图标"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <div className={styles['icon-list-box']}>
          {iconList.map((item, index) => {
            const iconItemClass = cs(styles['icon-item'], {
              'icon-item-select': item === tempValue,
            });
            return (
              <div onClick={() => changeIcon(item)} className={iconItemClass}>
                <IconFont
                  key={index}
                  style={{ fontSize: '20px' }}
                  type={item}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button onClick={handleOk} type="primary">
            确定
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default IconSelect;
