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

const { SubMenu } = Menu;

const Header = () => {
  const history = useHistory();
  const [current, setCurrent] = useState<any>('');
  // 跳至主页
  const toHome = () => {
    history.push(platform);
  };
  // 点击菜单
  const menuClick = (current: any) => {
    history.push(platform + 'example/' + current.key);
    setCurrent(current.key);
  };
  return (
    <Row className="header header-shadow" justify="space-between" align="middle">
      <Row align="middle" justify="center" className="header-title-icon" onClick={toHome}>
        <img src={logo} alt="logo" height={28} />
        <div className="header-title">{projectName}</div>
      </Row>
      <Row>
        <Menu onClick={menuClick} selectedKeys={[current]} mode="horizontal" style={{ borderBottom: 'none' }}>
          <SubMenu key="example" title="示例列表" icon={<OrderedListOutlined />}>
            <Menu.ItemGroup title="Core 核心">
              <Menu.Item key="bufferAttribute">流几何体属性</Menu.Item>
              <Menu.Item key="bufferGeometry">流几何体</Menu.Item>
              <Menu.Item key="interleavedBuffer">交叉存储流</Menu.Item>
              <Menu.Item key="raycaster">光线投射</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
        </Menu>
      </Row>
    </Row>
  );
};
export default Header;