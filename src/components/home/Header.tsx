/**
 * @description: Header
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Menu } from 'antd';
import { OrderedListOutlined } from '@ant-design/icons';
import { platform, projectName } from '@utils/CommonVars';
import './index.less';
import logo from '@static/images/logo.png';

const menuList = [
  {
    label: '示例', key: 'demo', icon: <OrderedListOutlined />,
    children: [
      { label: '地图默认展示', key: 'simpleMap' },
      { label: '工具栏', key: 'toolMap' },
      { label: '展示其他服务数据', key: 'serverMap' }
    ]
  }
];
const Header = () => {
  const history = useHistory();
  const [current, setCurrent] = useState<any>('');
  // 跳至主页
  const toHome = () => {
    history.push(platform);
  };
  // 点击菜单
  const menuClick = (current: any) => {
    history.push(platform + current.key);
    setCurrent(current.key);
  };
  return (
    <Row className="header header-shadow" justify="space-between" align="middle">
      <Row align="middle" justify="center" className="header-title-icon" onClick={toHome}>
        <img src={logo} alt="logo" height={28} />
        <div className="header-title">{projectName}</div>
      </Row>
      <Row>
        <Menu onClick={menuClick} items={menuList} selectedKeys={[current]} mode="horizontal" style={{ borderBottom: 'none' }} />
      </Row>
    </Row>
  );
};
export default Header;
