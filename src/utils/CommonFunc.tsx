/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import React, { CSSProperties } from 'react';
import { MenuData, OptionData } from '@utils/CommonInterface';
import { Link } from 'react-router-dom';
import { Badge, Menu, message, Space, Tag, Tooltip, TreeSelect, Upload } from 'antd';
import {
  AlertFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  createFromIconfontCN, EditOutlined, ExclamationCircleOutlined,
  CloudUploadOutlined, SyncOutlined
} from '@ant-design/icons';
import dayJs, { Dayjs } from 'dayjs';
import {
  attendanceCycle,
  clockStatusOption,
  EquipmentStatus,
  ETaskStatus,
  iconUrl,
  LightStatus,
  lineBorderParams,
  MatterStatus, PerformanceStatus,
  RuleType,
  Sex, vacateCheckStatus,
  WhetherFlag
} from '@utils/CommonVars';
import { Rule } from 'antd/lib/form';
import { TableBtn } from '@components/index';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const { TreeNode } = TreeSelect;
export const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});

/**
 * 时间转为时间字符串
 * **/
export const dateTimeToDateTimeString = (dateTime: Dayjs) => {
  return dayJs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};
/**
 * 日期转为日期字符串
 * **/
export const dateToDateString = (date: Date) => {
  return dayJs(date).format('YYYY-MM-DD');
};
/**
 * 时间转为时间字符串 转换结果为该日期00:00:00
 * **/
export const dateTimeToDateTimeStringBegin = (dateTime: any) => {
  return dayJs(dateTime).format('YYYY-MM-DD 00:00:00');
};
/**
 * 时间转为时间字符串 转换结果为该日期23:59:59
 * **/
export const dateTimeToDateTimeStringEnd = (dateTime: any) => {
  return dayJs(dateTime).format('YYYY-MM-DD 23:59:59');
};
/**
 * 初始化菜单
 * @params
 * type: 来自哪个页面，如：'/components/'
 * **/
export const initMenu = (menuList: Array<MenuData>, type: string) => {
  const subMenuList = [];
  for (let i = 0, length = menuList.length; i < length; i++) {
    // @ts-ignore
    if (menuList[i].children && menuList[i].children.length > 0) {
      // @ts-ignore
      const menuHtmlList = menuList[i].children.map((item: MenuData) => (
        <MenuItem key={item.id} icon={item.icon && <IconFont type={item.icon} />}>
          <Link to={type + item.url}>
            {item.name}
          </Link>
        </MenuItem>
      ));
      subMenuList.push((
        <SubMenu
          title={menuList[i].name}
          icon={menuList[i].icon && <IconFont type={menuList[i].icon} />}
          key={menuList[i].id}
        >
          {menuHtmlList}
        </SubMenu>
      ));
    } else {
      subMenuList.push((
        <MenuItem key={menuList[i].id} icon={menuList[i].icon && <IconFont type={menuList[i].icon} />}>
          <Link to={type + menuList[i].url}>
            {menuList[i].name}
          </Link>
        </MenuItem>
      ));
    }
  }
  return subMenuList;
};
/**
 * 将 children 长度为 0 的设置为 null
 * customSet: 自定义设置数组元素的属性变化
 * **/
export const getTreeChildrenToNull = (array: Array<any>, customSet?: any) => {
  return array.map((v: any) => {
    const item = { ...v };
    if (customSet) customSet(item);
    if (v.children) item.children = getTreeChildrenToNull(v.children, customSet);
    if (item.children.length === 0) {
      item.children = null;
    }
    return item;
  });
};
/**
 * @description 从树形数组中查找某一元素
 * @param treeData 树形数组
 * @param name 依据某一属性比对查找
 * @param value 要找的值
 */
export const findInTree = (treeData: Array<any>, name: string, value: any) => {
  let findInTree;
  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node[name] === value) {
        findInTree = node;
        break;
      }
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);
  return findInTree;
};
/**
 * @description 从树形数组中查找多个元素
 * @param treeData 树形数组
 * @param name 依据某一属性比对查找
 * @param value 要找的值
 * @param valueProps 依据某一属性值查找
 */
export const findMoreInTree = (treeData: Array<any>, name: string, value: Array<any>, valueProps?: string) => {
  let findInTree: Array<any> = [];
  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (value.findIndex((item: any) => (valueProps ? item[valueProps] : item) === node[name]) > -1) {
        findInTree.push(node);
      }
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);
  return findInTree;
};
/**
 * @description 获取树形结构数据的展开map数据
 * @param tree 树形数据
 */
export const getTreeMap = (tree: Array<any>) => {
  let treeMap: any = {};
  const loopsTree = (list: Array<any>, parent: any) => {
    return (list || []).map(({ children, value, title }) => {
      const node: any = (treeMap[value] = {
        parent,
        value,
        title
      });
      node.children = loopsTree(children, node);
      return node;
    });
  };
  loopsTree(tree, '');
  return treeMap;
};
/**
 * 返回省市区对象
 */
export const getAreaNameAndCode = (provinceCityArea: Array<any>) => {
  let provinceCityAreaObject: any = {};
  if (provinceCityArea.length > 0) {
    const province = provinceCityArea[0];
    provinceCityAreaObject.provinceCode = province.split('|')[0];
    provinceCityAreaObject.province = province.split('|')[1];
    const city = provinceCityArea[1];
    provinceCityAreaObject.cityCode = city.split('|')[0];
    provinceCityAreaObject.city = city.split('|')[1];
    const area = provinceCityArea[2];
    provinceCityAreaObject.areaCode = area.split('|')[0];
    provinceCityAreaObject.area = area.split('|')[1];
  } else {
    provinceCityAreaObject.provinceCode = '';
    provinceCityAreaObject.province = '';
    provinceCityAreaObject.cityCode = '';
    provinceCityAreaObject.city = '';
    provinceCityAreaObject.areaCode = '';
    provinceCityAreaObject.area = '';
  }
  return provinceCityAreaObject;
};
/**
 * 根据省市区 code 和 name 返回省市区数组
 * **/
export const getProvinceCityArea = (data: any) => {
  let areaList = [];
  if (data.provinceCode) {
    const proStr = data.provinceCode + '|' + data.province;
    const cityStr = data.cityCode + '|' + data.city;
    const areaStr = data.areaCode + '|' + data.area;
    areaList.push(proStr);
    areaList.push(cityStr);
    areaList.push(areaStr);
  }
  return areaList;
};
/**
 * 设置 cookie
 * **/
export const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = name + '=' + value + '; max-age=' + maxAge;
};
/**
 * 删除 cookie
 * **/
export const deleteCookie = (name: string) => {
  setCookie(name, '', 0);
};
/**
 * limitType： 限制文件的 格式
 * file: 文件
 * limitSize: 文件限制大小（MB）
 * limitFileNameLength: 限制文件名长度
 * limitFileName: 文件名中不应包含字符
 **/
export const beforeUploadLimit = (limitType: Array<string>, file: any, limitSize?: number, limitFileNameLength?: number, limitFileName?: Array<string>) => {
  let fileSize = limitSize ? limitSize : 40;
  const isLtLimitSize = file.size / 1024 / 1024 < fileSize;
  // 限制文件大小
  if (!isLtLimitSize) {
    message.error({
      content: '文件不能超过 ' + fileSize + ' MB',
      key: 'fileSize'
    });
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error({
      content: '文件限' + limitType.join('、') + '格式',
      key: 'fileType'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLength = limitFileNameLength ? limitFileNameLength : 100;
  // 限制文件名长度
  if (file.name.length > nameLength) {
    message.error({
      content: '文件名长度不能超过 ' + nameLength + ' 字',
      key: 'fileLength'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLimit = limitFileName ? limitFileName : ['&', '+', '=', '#', '%'];
  // 限制文件名中不应包含字符
  for (let i = 0; i < nameLimit.length; i++) {
    const item = nameLimit[i];
    if (file.name.indexOf(item) !== -1) {
      message.error({
        content: '文件名中不应包含字符 ' + nameLimit.join(' ') + ' 字符',
        key: 'fileCode'
      });
      return Upload.LIST_IGNORE;
    }
  }
  return true;
};
/**
 * 文件 Url 转义
 **/
export const encodeFileUrl = (url: string) => {
  if (url) {
    let transformUrl: string = url.replace(/%/g, '%25')
      .replace(/\+/g, '%2B')
      .replace(/&/g, '%26')
      .replace(/#/g, '%23');
    return transformUrl;
  } else {
    return '';
  }
};
/**
 * 获取常用校验
 * @param ruleType: required | selectRequired | inputNotSpace | email | phone | idNumber | url | password
 * @param required（可选）: 是否必填（如果单独需要必填，ruleType 设置为 required 即可，如果要满足其他校验且必填，该值才设为 true）
 **/
export const getRules = (ruleType: RuleType, required?: boolean, max?: number) => {
  let commonRules: Array<Rule> = [];
  let stringCountObj: Rule = { type: 'string', max: max || 10 };
  let requiredObj: Rule = { required: true, message: '请输入' };
  switch (ruleType) {
    case RuleType.required: commonRules = [requiredObj]; break;
    case RuleType.selectRequired: commonRules = [{
      required: true,
      message: '请选择'
    }]; break;
    case RuleType.notOnlySpace: commonRules = [{
      whitespace: true,
      message: '不能只有空格'
    }]; break;
    case RuleType.inputNotSpace: commonRules = [{
      whitespace: true,
      message: '不能只有空格'
    }, {
      pattern: /^[^\s]*$/,
      message: '不能包含空格及其他空白字符'
    }]; break;
    case RuleType.email: commonRules = [{
      pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
      message: '请输入正确邮箱格式'
    }]; break;
    case RuleType.phone: commonRules = [{
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      message: '请输入正确手机号格式'
    }]; break;
    case RuleType.idNumber: commonRules = [{
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确身份证号格式'
    }]; break;
    case RuleType.url: commonRules = [{
      pattern: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
      message: '请输入合法 url'
    }]; break;
    case RuleType.password: commonRules = [{
      pattern: /^[_a-zA-Z0-9]+$/,
      message: '仅由英文字母，数字以及下划线组成'
    }]; break;
    case RuleType.stringCount: commonRules = [stringCountObj]; break;
    default: commonRules = []; break;
  }
  let returnRules: Array<Rule> = commonRules;
  if (required && ruleType !== RuleType.required) {
    // @ts-ignore
    returnRules.unshift(requiredObj);
  }
  if (max) {
    returnRules.push(stringCountObj);
  }
  return returnRules;
};
/**
 * 面包屑使用 BrowserRouter
 **/
export const itemRender = (route: any, params: any, routes: any, paths: Array<any>) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={{ pathname: route.path, state: route.state }}>{route.breadcrumbName}</Link>
  );
};
/**
 * 节流（连续大量触发的事件应该都要携带该函数）
 * @param fn: 真正要执行的函数
 * @param wait: 等待时间，默认 100 ms
 **/
export const throttle = (fn: Function, wait: number = 100) => {
  let time = Date.now();
  return () => {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
};
/**
 * @description card的配置参数
 * @param title 标题
 * @param style 样式
 * @param size 大小
 * @param bordered 是否有边框
 */
export const myCardProps = (title: string | React.ReactNode, style?: CSSProperties, size?: 'default' | 'small', bordered?: boolean) => {
  return ({
    bordered: bordered || false,
    title: title,
    style: style || { width: '100%' },
    size: size || 'small'
  });
};
/**
 * @description 网格层级状态渲染
 * @param status 是否可受理状态
 */
export const girdLevelStatus = (status: number) => {
  return status ? <Tag icon={<CheckCircleOutlined />} color="success">是</Tag> : <Tag icon={<CloseCircleOutlined />} color="error">否</Tag>;
};

export const ellipsisRender = {
  ellipsis: {
    showTitle: false,
  },
  render: (text: any) => (
    <Tooltip placement="topLeft" title={text}>
      {text}
    </Tooltip>
  )
};
// 性别的展示
export const getSexShow = (sex: Sex) => {
  if (sex === Sex.girl) {
    return '女';
  } else if (sex === Sex.boy) {
    return '男';
  } else {
    return '';
  }
};
/**
 * @description 获取区域的中心点
 * @param range 区域数据
 */
export const getTheAreaCenter = (range: any) => {
  let longitude: any = 0.0;
  let latitude: any = 0.0;
  range.forEach((item: any) => {
    longitude = longitude + item[0];
    latitude = latitude + item[1];
  });
  longitude = longitude / range.length;
  latitude = latitude / range.length;
  return [longitude, latitude];
};
/**
 * @description 地图多边形根据level层级显示不同的颜色样式
 * @param level
 */
export const getPolygonStyle = (level: number) => {
  switch (level) {
    case 1: return {
      ...lineBorderParams,
      strokeColor: '#136475', // 线颜色
      fillColor: hexToRgba('#136475', 0.58), // 填充色
    };
    case 2: return {
      ...lineBorderParams,
      strokeColor: '#00AFA6', // 线颜色
      fillColor: hexToRgba('#00AFA6', 0.58), // 填充色
    };
    case 3: return {
      ...lineBorderParams,
      strokeColor: '#11B3C2', // 线颜色
      fillColor: hexToRgba('#11B3C2', 0.58), // 填充色
    };
    case 4: return {
      ...lineBorderParams,
      strokeColor: '#30b1f6', // 线颜色
      fillColor: hexToRgba('#30b1f6', 0.68), // 填充色
    };
    case 5: return {
      ...lineBorderParams,
      strokeColor: '#B3FCFF', // 线颜色
      fillColor: hexToRgba('#B3FCFF', 0.58), // 填充色
    };
    case 6: return {
      ...lineBorderParams,
      strokeColor: '#EB9BDB', // 线颜色
      fillColor: hexToRgba('#EB9BDB', 0.58), // 填充色
    };
  }
};
/**
 * @description 十六进制颜色转换成rgba
 * @param hex 颜色
 * @param opacity 透明度
 */
export const hexToRgba = (hex: string, opacity: number) => {
  return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
    + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
};
/**
 * @description 将时间数组转换为开始和结束时间
 * @param time 时间数组
 * @param timeType 时间类型 'day' | 'month' | 'year'
 * @param formatter 格式化
 */
export const getTimeBeginAndEnd = (time: Array<any>, timeType?: 'day' | 'month' | 'year', formatter?: string): { begin: string, end: string} => {
  let myTimeType = timeType || 'day';
  let myFormat = formatter || 'YYYY-MM-DD';
  return {
    begin: dayJs(time[0]).startOf(myTimeType).format(myFormat),
    end: dayJs(time[1]).startOf(myTimeType).format(myFormat),
  };
};
/**
 * @description 获取事项状态
 * @param status 状态
 */
export const getResultCheckStatusShow = (status: number) => {
  switch (status) {
    case WhetherFlag.yes: return <Tag icon={<CheckCircleOutlined />} color="success">已核查</Tag>;
    case WhetherFlag.no: return <Tag icon={<ClockCircleOutlined />} color="default">待核查</Tag>;
    default: return null;
  }
};
/**
 * @description 获取事项状态
 * @param status 状态
 */
export const getMatterStatusShow = (status: number) => {
  switch (status) {
    case MatterStatus.audited: return <Tag color="magenta">待受理</Tag>;
    case MatterStatus.handled: return <Tag color="processing">待处办</Tag>;
    case MatterStatus.reviewed: return <Tag color="warning">待审核</Tag>;
    case MatterStatus.archive: return <Tag color="success">已归档</Tag>;
    case MatterStatus.reject: return <Tag color="default">不予受理</Tag>;
    default: return null;
  }
};
/**
 * @description 获取事项当前环节状态
 * @param status 状态
 * @param isSmall 是否展示小图标
 */
export const getCurrentMatterStatusShow = (status: number, isSmall?: boolean) => {
  switch (status) {
    case LightStatus.green: return <AlertFilled style={{ fontSize: isSmall ? 24 : 32, color: 'green' }} />;
    case LightStatus.red: return <AlertFilled style={{ fontSize: isSmall ? 24 : 32, color: 'red' }} />;
    case LightStatus.orange: return <AlertFilled style={{ fontSize: isSmall ? 24 : 32, color: 'orange' }} />;
  }
};
export const allMatterStatusShow = (
  <Space>
    <span><AlertFilled style={{ fontSize: 14, color: 'green' }} /> 正常</span>
    <span><AlertFilled style={{ fontSize: 14, color: 'orange' }} /> 预警</span>
    <span><AlertFilled style={{ fontSize: 14, color: 'red' }} /> 超时</span>
  </Space>
);
export const disableDate = (current: any) => {
  return current < dayJs();
};
// 不可选中之后的日期
export const disableDateAfter = (current: any) => {
  return current > dayJs();
};
/**
 * @description 若对应选项被禁用或删除后，则需回显之前选择的，不可继续选择 针对select
 * @param id: 当前选项id值
 * @param name:当前选项name
 * @param dataList:当前下拉框选项数据
 */
export const renderDeleteList = (id: string, name: string, dataList: Array<any>) => {
  if (id && dataList.findIndex((item) => item.value === id) === -1) {
    return [{ label: name, value: id, disabled: true }];
  } else {
    return [];
  }
};
/**
 * @description 若对应选项被禁用或删除后，则需回显之前选择的，不可继续选择 针对tree
 * @param objectArray: 当前选项数组
 * @param dataList:当前下拉框选项数据
 */
export const renderDeleteTree = (objectArray: Array<any>, dataList: Array<any>) => {
  let currentList: Array<any> = []; // 先将多维数据转为一维数组
  if (dataList.length > 0) {
    const generateList = (data: any) => {
      for (let i = 0; i < data.length; i++) {
        currentList.push(data[i]);
        if (data[i].children) {
          generateList(data[i].children);
        }
      }
    };
    generateList(dataList);
  }
  let resultDataList: Array<any> = [];
  objectArray.length > 0 && objectArray.forEach((item: any) => {
    if (currentList.length === 0 || currentList.findIndex((items) => items.key === item.id) === -1) {
      resultDataList.push({ title: item.name + '(已被移动或删除)', key: item.id, disabled: true, selectable: false, disableCheckbox: true });
    }
  });
  if (resultDataList.length > 0) {
    return resultDataList;
  } else {
    return [];
  }
};
/**
 * @description 非职能部门不可被选tree渲染
 * @param list: 当前部门选项数组
 */
export const functionDptRender = (list: Array<any>) => {
  return list.map((item: any) => (
    <TreeNode key={item.value} value={item.value} title={item.title} disabled={item.isFunction !== WhetherFlag.yes}>
      {item.children && functionDptRender(item.children)}
    </TreeNode>
  ));
};
/**
 * @description 非选择层级网格不可被选tree渲染
 * @param list: 当前基础网格数据
 * @param level: 当前网格层级
 */
export const gridDptRender = (list: Array<any>, level: number) => {
  return list.map((item: any) => (
    <TreeNode key={item.key} value={item.key} title={item.title} disabled={item.gridLevelId !== level}>
      {item.children && gridDptRender(item.children, level)}
    </TreeNode>
  ));
};
/**
 * @description 从options中获取当前value的label
 * @param options 数组
 * @param value 要查找的值
 */
export const getOptionsLabel = (options: Array<OptionData>, value: any) => {
  let index = options.findIndex(item => item.value === value);
  return index > -1 ? options[index].label : '';
};
/**
 * @description 从options中获取当前value的label
 * @param options 数组
 * @param value 要查找的值
 */
export const getOptionsLabelTag = (options: Array<any>, value: any) => {
  let index = options.findIndex(item => item.value === value);
  return index > -1 ? <Tag color={options[index].color}>{options[index].label}</Tag> : '';
};
/**
 * @description 获取任务状态
 * @param status 状态
 */
export const getTaskStatusShow = (status: number) => {
  switch (status) {
    case ETaskStatus.create: return <Tag icon={<EditOutlined />} color="magenta">待发布</Tag>;
    case ETaskStatus.ready: return <Tag icon={<ExclamationCircleOutlined />} color="magenta">未开始</Tag>;
    case ETaskStatus.execute: return <Tag icon={<CloudUploadOutlined />} color="processing">执行中</Tag>;
    case ETaskStatus.over: return <Tag icon={<CheckCircleOutlined />} color="success">已结束</Tag>;
    default: return '';
  }
};
/**
 * @description 获取网格文件的名称
 * @param url
 */
export const getFileUrlName = (url: string) => {
  return decodeURI(url.split('/').pop() as string);
};
/**
 * @description 获取设备状态
 * @param status 状态
 */
export const getEquipmentStatusShow = (status: number) => {
  switch (status) {
    case EquipmentStatus.normal: return <Tag color="success">正常</Tag>;
    case EquipmentStatus.fault: return <Tag color="warning">故障</Tag>;
    case EquipmentStatus.damage: return <Tag color="error">损坏</Tag>;
    default: return null;
  }
};
export const getTreeExpandKeyAndChild = (array: Array<any>, customSet?: any) => {
  let keys: Array<string> = [];
  let total = 0;
  const setChildren = (array: Array<any>, customSet?: any) => {
    return array.map((v: any) => {
      const item = { ...v };
      if (customSet) customSet(item);
      if (v.children) item.children = setChildren(v.children, customSet);
      if (item.children.length === 0) {
        item.children = null;
      } else {
        keys.push(item.id);
      }
      if (item.type === 1) {
        total += item.score;
      }
      return item;
    });
  };
  return {
    tree: setChildren(array, customSet),
    key: keys,
    total
  };
};
/**
 * @description 状态的渲染
 * @param status
 */
export const statusRender = (status: number) => {
  return <Badge text={status === 0 ? '禁用' : '启用'} status={status === 0 ? 'default' : 'processing'} />;
};
export const getClientWidth = () => {
  // @ts-ignore
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
/**
 * @description 获取考核项目状态
 * @param status 状态
 */
export const getAppraisalStatusShow = (status: number) => {
  switch (status) {
    case PerformanceStatus.completed: return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>;
    case PerformanceStatus.onGoing: return <Tag icon={<SyncOutlined spin />} color="processing">进行中</Tag>;
    default: return null;
  }
};
/**
 * @description 获取考核对象状态
 * @param status 状态
 */
export const getObjectStatusShow = (status: number) => {
  switch (status) {
    case PerformanceStatus.completed: return <Badge status="success" text="已完成" />;
    case PerformanceStatus.onGoing: return <Badge status="processing" text="进行中" />;
    default: return null;
  }
};
/**
 * @description 获取考勤状态
 * @param status 状态
 */
export const getAttendanceStatusShow = (status: number) => {
  switch (status) {
    case WhetherFlag.yes: return <Tag color="processing">考勤</Tag>;
    case WhetherFlag.no: return <Tag color="default">不考勤</Tag>;
    default: return '';
  }
};
/**
 * @description 阿拉伯数字转中文一周
 * @param num
 */
export const getWeekString = (num: string) => {
  return getOptionsLabel(attendanceCycle, parseInt(num, 10));
};
/**
 * @description 获取请假类型状态
 * @param status 状态
 */
export const getVacateTypeStatusShow = (status: number) => {
  switch (status) {
    case WhetherFlag.yes: return <Tag color="blue">可用</Tag>;
    case WhetherFlag.no: return <Tag color="red">不可用</Tag>;
    default: return '';
  }
};
/**
 * @description 渲染考勤周期的组件方法
 * @param cycles
 */
export const renderAttendanceCycle = (cycles: any) => {
  let arr = cycles || [];
  if (typeof cycles === 'string') {
    arr = cycles.split(',');
  }
  return (
    <TableBtn split="、">
      {arr.map((item: any) => (
        <span key={item}>{getOptionsLabel(attendanceCycle, parseInt(item, 10))}</span>
      ))}
    </TableBtn>
  );
};
/**
 * @description 渲染考勤周期的组件方法
 * @param points
 */
export const renderAttendancePoint = (points: any) => {
  let arr = points || [];
  return (
    <TableBtn split="、">
      {arr.map((item: any) => (
        <span key={item.id}>{item.name}</span>
      ))}
    </TableBtn>
  );
};
/**
 * @description 打卡状态的显示
 * @param status
 */
export const renderClockShow = (status: number) => {
  let index = clockStatusOption.findIndex(item => item.value === status);
  if (index > -1) {
    return <Tag color={clockStatusOption[index].tag}>{clockStatusOption[index].label}</Tag>;
  }
  return '';
};
/**
 * @description 获取请假审批状态
 * @param status 状态
 */
export const getCheckTypeStatusShow = (status: number) => {
  switch (status) {
    case vacateCheckStatus.pending: return <Tag color="default">待审批</Tag>;
    case vacateCheckStatus.onGoing: return <Tag color="processing">审批中</Tag>;
    case vacateCheckStatus.passed: return <Tag color="success">已通过</Tag>;
    case vacateCheckStatus.reject: return <Tag color="error">未通过</Tag>;
    default: return '';
  }
};