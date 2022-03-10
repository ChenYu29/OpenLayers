import { MenuData } from '@utils/CommonInterface';

/**
 * @description: 总体上下文
 * @author: cnn
 * @createTime: 2020/9/11 10:30
 **/
interface UserInfo {
  userId: string,
  userName: string,
  name: string,
  roleName: string,
  orgId: string
}
interface HomeInit {
  userInfo: UserInfo,
  menuList: Array<MenuData>,
  childMenu: Array<MenuData>,
  freshFlag: number, // 刷新消息通知列表
  freshSelectedMenu: boolean, // 是否刷新当前选中菜单 不刷新默认为首项子菜单
}

const homeInit: HomeInit = {
  userInfo: {
    userId: '1',
    userName: 'admin',
    name: '管理员',
    roleName: ''
  },
  menuList: [],
  childMenu: [],
  freshFlag: 0,
  freshSelectedMenu: false
};
export enum HomeDispatchType {
  setUserInfo,
  setMenuList,
  setChildMenu,
  refresh,
  refreshSelectedMenu
}
const homeReducer = (state = homeInit, action: any) => {
  switch (action.type) {
    case HomeDispatchType.setUserInfo: return { ...state, userInfo: { ...action.userInfo }};
    case HomeDispatchType.setMenuList: return { ...state, menuList: [...action.menuList] };
    case HomeDispatchType.setChildMenu: return { ...state, childMenu: [...action.childMenu] };
    case HomeDispatchType.refresh: return { ...state, freshFlag: state.freshFlag + 1 };
    case HomeDispatchType.refreshSelectedMenu: return { ...state, freshSelectedMenu: action.freshSelectedMenu };
    default: return { ...state };
  }
};
export { homeInit, homeReducer };
