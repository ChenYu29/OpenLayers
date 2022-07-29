/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Layout, Menu, Spin } from 'antd';
import { Header } from '@components/index';
import { initMenu } from '@utils/CommonFunc';
import { MenuData } from '@utils/CommonInterface';
import { PageSessionList, platform } from '@utils/CommonVars';
import { HomeContext } from '../../index';
import { post } from '@utils/Ajax';
import './index.less';
import 'ol/ol.css';
import '../../views/openLayers/layers.less';
import { HomeDispatchType } from '@views/home/HomeReducer';

const { Content, Sider } = Layout;

interface IProps {
  children?: any
}
const Home = (props: IProps) => {
  const { children } = props;
  const history = useHistory();
  // 如果跳转路由了，则清除 current
  history.listen((location, action) => {
    if (action === 'PUSH') {
      sessionStorage.removeItem('current');
      PageSessionList.forEach(item => {
        sessionStorage.removeItem(item);
      });
    }
  });
  const { homeDispatch, homeState } = useContext(HomeContext);
  const [menuList, setMenuList] = useState<Array<MenuData>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: MenuData) => menu.id));
  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    // 如果存在当前登录用户，则赋值
    if (sessionStorage.getItem('userInfo')) {
      homeDispatch({
        type: HomeDispatchType.setUserInfo,
        userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '')
      });
      getMenuList();
    }
  }, []);
  useEffect(() => {
    if (homeState.childMenu && homeState.childMenu.length > 0) {
      if (homeState.freshSelectedMenu && sessionStorage.getItem('currentMenuId')) {
        // @ts-ignore
        const currentMenuId: Array<any> = sessionStorage.getItem('currentMenuId').split(',');
        if (currentMenuId.length > 0) {
          setOpenKeys([currentMenuId[0]]);
          setSelectedKeys([currentMenuId[1]]);
        }
      } else {
        setOpenKeys([homeState.childMenu[0].key]);
        const selectedKey = getSelectedKey(homeState.childMenu);
        setSelectedKeys(selectedKey.key);
        const currentMenu: Array<string> = [selectedKey.key, homeState.childMenu[0].key];
        sessionStorage.setItem('currentMenuId', currentMenu.toString());
      }
      setMenuList(homeState.childMenu);
    }
  }, [homeState.childMenu, homeState.freshSelectedMenu]);
  // 设置当前选择菜单
  const getSelectedKey = (dataList: Array<any>) => {
    let findInList: Array<any> = [];
    const generateList = (data: any) => {
      if (data[0].children && data[0].children.length > 0) {
        generateList(data[0].children);
      } else {
        findInList = data[0];
      }
    };
    generateList(dataList);
    return findInList;
  };
  // 获取用户菜单
  const getMenuList = () => {
    setLoading(true);
    post('security/authRole/getUserHasMenuList', {}, {}, (data: any) => {
      if (data.flag === 0) {
        const dataList: any = data.data.children;
        homeDispatch({ type: HomeDispatchType.setMenuList, menuList: dataList });
        if (window.performance) {
          // 页面刷新时设置选中菜单为刷新前记录的数据
          if (performance.navigation.type === 1 && sessionStorage.getItem('childMenu') as string) {
            const childMenu: Array<any> = JSON.parse(sessionStorage.getItem('childMenu') as string);
            setMenuList(childMenu);
          } else {
            for (let i = 0; i < dataList.length; i++) { // 设置进入系统的首页，为有子菜单的第一个菜单
              if (dataList[i].children && dataList[i].children.length > 0) {
                setMenuList(dataList[i].children);
                break;
              }
            }
          }
          if (sessionStorage.getItem('currentMenuId')) {
            // @ts-ignore
            const currentMenu: Array<string> = sessionStorage.getItem('currentMenuId').split(',');
            if (currentMenu.length === 2) {
              setOpenKeys([currentMenu[1]]);
              setSelectedKeys([currentMenu[0]]);
            } else {
              setOpenKeys([]);
              setSelectedKeys([currentMenu[0]]);
            }
          }
        }
      }
      setLoading(false);
    });
  };
  // 折叠
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Spin spinning={loading}>
      <Layout>
        <Header />
        <Layout style={{ minHeight: 'calc(100vh - 68px)' }}>
          <Content className="content" id="content">
            <div>
              {!loading && children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
};
export default Home;
