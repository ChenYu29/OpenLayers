/**
 * @description: 公共变量
 * @author: cnn
 * @createTime: 2020/7/16 16:53
 **/
// @ts-ignore
import iconfont from '@static/js/iconfont.js';
import { CardProps } from 'antd/lib/card';
import { OptionData } from '@utils/CommonInterface';
import React from 'react';
/**
 * 公共颜色
 * **/
export enum colors {
  primaryColor = '#1890ff',
  error = '#f5222d'
}
/**
 * 公共间距
**/
export enum CommonSpace {
  lg= 24,
  md = 16,
  sm = 10,
  xs = 5
}
/**
 * 服务器部署前缀路径
 * **/
const serverConfigs = require('./../../scripts/config.js');
export const { platform } = serverConfigs();
/**
 * API 接口路径
 **/
export const { serverPath } = serverConfigs();
/**
 * 图标库地址，iconfonts 库
 * **/
export const iconUrl: string = iconfont;
/**
 * 项目名称
 **/
export const projectName: string = 'OpenLayers使用Demo';

export const pageHeaderStyle: React.CSSProperties = {
  margin: '-10px -10px 10px -10px',
  backgroundColor: '#fff',
};
// 粘性PageHeader
export const stickyHeaderStyle: React.CSSProperties = {
  width: '100%',
  zIndex: 1,
  boxShadow: '0 2px 8px #f0f1f2',
  position: 'sticky', // 当有滚动条时，粘在固定位置
  top: -10
};
// 表单布局
export const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    span: 6
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    span: 18
  },
};
// 数据字典类型编号
export const IDictTypeCode = {
  abandonType: 'ZFLX', // 作废类型
  orgType: 'OrgType', // 机构类型
  dispatchWay: 'DispatchWay', // 派遣方式
  identityType: 'IdentityType', // 身份类别
  equipmentType: 'SBLX', // 设备类型
};
/**
 * 机构启用禁用状态
 * **/
export enum OrganizationEnable {
  ENABLE = 1, // 启用
  FORBID = 0 // 禁用
}
/**
 * 文件后缀
 **/
export const fileAccept = {
  doc: ['.doc', '.docx'],
  pdf: ['.pdf'],
  excel: ['.xls', '.xlsx'],
  zip: ['.rar', '.zip'],
  app: ['.apk'],
  img: ['.webp', '.tif', '.pjp', '.jfif', '.pjpeg', '.avif', '.ico', '.tiff', '.gif', '.svg', '.bmp', '.png', '.xbm', '.jxl', '.jpeg', '.svgz', '.jpg'],
  video: ['.ogm', '.wmv', '.mpeg', '.asx', '.mpg', '.ogv', '.webm', '.mov', '.mp4', '.m4v', '.avi'],
  all: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.rar', '.zip', '.jpg', '.jpeg', '.png', '.bmp']
};
/**
 * 校验类型
 * required: 必填，可空格，空白字符等
 * inputNotSpace: 不能包含空格，其他空白字符
 * email: 验证邮箱
 * phone: 验证手机
 * idNumber: 身份证号
 * url: url
 * password: 密码，仅由英文字母，数字以及下划线组成
 **/
export enum RuleType {
  required = 'required',
  inputNotSpace = 'inputNotSpace',
  email = 'email',
  phone = 'phone',
  idNumber = 'idNumber',
  url = 'url',
  password = 'password',
  selectRequired = 'selectRequired',
  notOnlySpace = 'notOnlySpace',
  stringCount = '字符数限制'
}
/**
 * 角色类型
**/
export enum RoleType {
  Admin = 0,
  User = 1
}
export enum IPageSession { // page current的类型
  demo = '-demo', // 示例
  building = '-building', // 小区楼栋管理--楼栋
  person = '-person',
}
export const PageSessionList: Array<IPageSession> = [
  IPageSession.demo
];
/**
 * echarts 颜色
**/
export const echartsColor: Array<string> = ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'];
/**
 * 搜索表单公共的 card 参数
**/
export const searchCardProps: CardProps = {
  bordered: false,
  title: '',
  style: { marginBottom: CommonSpace.sm, width: '100%' },
  size: 'small'
};
// 性别选项
export enum Sex {
  girl = 0,
  boy = 1
}
export const sexOption: Array<OptionData> = [
  { label: '女', value: Sex.girl },
  { label: '男', value: Sex.boy },
];
// 事项类型
export enum MatterLevel {
  func = 0, // 职能
  big = 1, // 事项大类
  small = 2, // 事项小类
}
// inputGroup中的input样式
export const inputStyle: React.CSSProperties = {
  width: 90, textAlign: 'center'
};
export const dividerStyle: React.CSSProperties = {
  width: 40,
  borderLeft: 0,
  borderRight: 0,
  pointerEvents: 'none',
};
export const lastDividerStyle: React.CSSProperties = {
  width: 40,
  borderLeft: 0,
  pointerEvents: 'none',
};
// 树状结构数据类型
export enum TreeDataType {
  grid = 0, // 网格
  unit = 1, // 单位
}
// 网格区域操作类型
export enum GridMapOperation {
  add = 'add', // 新增网格区域
  edit = 'edit', // 编辑网格区域
  baseLook = 'baseLook', // 查看基础网格区域
  functionLook = 'functionLook', // 查看职能网格区域
}
export const commonRules = [
  { whitespace: true, message: '不能只包含空格' },
];
// 是否
export enum WhetherFlag {
  yes = 1,
  no = 0
}
// 地图省市区(根据此数据指定地图关键字搜索范围)
export const searchRange: string = '';
// 地图默认显示中心位置 重庆center
export const defaultCenter: Array<any> = [106.544787, 29.570189];
// 地图绘制线条参数配置
export const lineBorderParams: any = {
  strokeOpacity: 0.2, // 线透明度
  strokeWeight: 3,    // 线宽
  fillOpacity: 0.35 // 填充透明度
};
export const defaultBorder: object = {
  strokeColor: '#0091ea',
  fillColor: '#80d8ff',
  ...lineBorderParams
};
export const lineParams: any = {
  strokeColor: '#ff7437', // 线颜色
  fillColor: '#ff7848', // 填充色
};
// 事项处置页面类型
export enum MatterType {
  accept = 'accept', // 事项受理
  dispatch = 'dispatch', // 事项派遣
  doMatter = 'doMatter', // 事项处办
  audit = 'audit', // 事项审核
  oversee = 'oversee', // 事项督办
  inspect = 'inspect', // 结果督查
  parameter = 'parameter', // 事项台账
}
export enum TabType {
  waitDeal = '我的待办',
  alreadyDeal = '我的经办',
}
export enum MatterTabKey {
  abandon = -3, // 废件
  archive = -2, // 归档
  all = -1, // 全部
  doWait = 0, // 处办待办
  doDeal = 1, // 处办经办
  auditWait = 2, // 审核待办
  auditDeal = 3, // 审核经办
  acceptWait = 4, // 受理待办
  acceptDeal = 5, // 受理经办
}
// 事项受理、事项审核、事项处办tab
export const TabList: Array<any> = [
  { key: TabType.waitDeal, tab: TabType.waitDeal },
  { key: TabType.alreadyDeal, tab: TabType.alreadyDeal }
];
export enum MatterSoure {
  grid = '网格上报',
  public = '公众上报',
  leader = '领导交办',
  masses = '群总反馈',
}
// 事项来源
export const matterSourceOption: Array<OptionData> = [
  { label: MatterSoure.grid, value: MatterSoure.grid },
  { label: MatterSoure.public, value: MatterSoure.public },
  // { label: MatterSoure.leader, value: MatterSoure.leader },
  // { label: MatterSoure.masses, value: MatterSoure.masses },
];
export enum MatterStatus {
  audited = 10, // 待受理
  handled = 20, // 待处办
  reviewed = 30, // 待审核
  archive = 40, // 归档
  reject = 50, // 不予受理
}
export const overSeeMatterStatusOption: Array<OptionData> = [
  { label: '全部', value: -1 },
  { label: '待受理', value: MatterStatus.audited },
  { label: '待处办', value: MatterStatus.handled },
  { label: '待审核', value: MatterStatus.reviewed },
];
export const matterStatusOption: Array<OptionData> = [
  ...overSeeMatterStatusOption,
  { label: '已归档', value: MatterStatus.archive },
  { label: '不予受理', value: MatterStatus.reject },
];
export enum LightStatus {
  green = 1,
  orange = 2,
  red = 3
}
// 环节状态 绿灯：1    橙灯  ：2   红灯 ：3
export const currentMatterOption: Array<OptionData> = [
  { label: '绿灯', value: LightStatus.green },
  { label: '橙灯', value: LightStatus.orange },
  { label: '红灯', value: LightStatus.red },
];
// 核查状态
export const checkStatusOption: Array<OptionData> = [
  { label: '已核查', value: WhetherFlag.yes },
  { label: '待核查', value: WhetherFlag.no }
];
export const checkResultOption: Array<OptionData> = [
  { label: '良好', value: '良好' },
  { label: '一般', value: '一般' },
  { label: '不合格', value: '不合格' },
];
// 处办方式
export enum HandleType {
  apply = 0, // 申请审核
  handle = 1, // 处办
  dispatch = 2, // 派遣
}
// 用户职责
export enum UserDuty {
  resGrid = 1, // 责任网格
  resUnit = 2, // 责任单位
  helpOrg = 3, // 协作部门
  others = 4, // 非关联人员
}
// 用户派遣方式
export enum DispatchWaysByUser {
  underLevel = 1,
  baseGrid = 2,
  orgGrid = 3,
}
// 用户申请方式
export enum ApplyType {
  back = 0, // 回退
  delay = 1 // 延期
}
// 是否受理
export const acceptOptions: Array<OptionData> = [
  { label: '是', value: WhetherFlag.yes },
  { label: '否', value: WhetherFlag.no }
];
export const acceptWayOptions: Array<OptionData> = [
  { label: '派遣', value: HandleType.dispatch },
  { label: '立即处办', value: HandleType.handle }
];
// 资讯类型
export enum ENewsType {
  banner = 1,
  list = 2
}
export const newsTypeOptions: Array<OptionData> = [
  { label: '轮播图展示', value: ENewsType.banner },
  { label: '资讯列表展示', value: ENewsType.list },
];
// 资讯状态
export enum ENewsStatus {
  waitCommit = 10, // 待提交
  waitAudit = 20, // 待审核
  noPass = 30, // 审核不通过
  publish = 40, // 已发布
  moved = 50, // 下架
}
export const newsStatusOption: Array<any> = [
  { label: '待提交', value: ENewsStatus.waitCommit, color: 'geekblue' },
  { label: '待审核', value: ENewsStatus.waitAudit, color: 'purple' },
  { label: '审核不通过', value: ENewsStatus.noPass, color: 'error' },
  { label: '已发布', value: ENewsStatus.publish, color: 'success' },
  { label: '下架', value: ENewsStatus.moved, color: 'default' },
];
// 重点类型
export enum EPointType {
  device = 2,
  area = 0,
  person = 1
}
export const pointTypeOption: Array<OptionData> = [
  { label: '重点设施', value: EPointType.device },
  { label: '重点区域', value: EPointType.area },
  { label: '重点人群', value: EPointType.person },
];
// 走访频次
export const inspectFrequency: Array<OptionData> = [
  { label: '次/周', value: 1 },
  { label: '次/月', value: 2 },
  { label: '次/年', value: 3 },
];
// 任务类型（临时 | 定期）
export enum ETaskType {
  regular = 0, // 定期
  temporary = 1 // 临时
}
// 任务的状态
export enum ETaskStatus {
  create = 10, // 已创建【任务未发布(定期)】
  ready = 20, // 已就绪【任务已发布，未到巡查开始时间(定期)】
  execute = 30, // 执行中【从巡查时间开始(定期)】
  over = 40,  // 已结束【巡查结束时间后(定期)】
}
export const taskStatusOption: Array<OptionData> = [
  { label: '待发布', value: ETaskStatus.create },
  { label: '未开始', value: ETaskStatus.ready },
  { label: '执行中', value: ETaskStatus.execute },
  { label: '已结束', value: ETaskStatus.over },
];
// 巡查状态
export enum InspectStatus {
  finished = 1, // 已巡查
  notFinish = 0 // 未巡查
}
// 巡查状态选项
export const inspectStatusOption: Array<OptionData> = [
  { label: '已巡查', value: InspectStatus.finished },
  { label: '未巡查', value: InspectStatus.notFinish },
];
// 巡查对象名称
export const inspectNameOption: Array<OptionData> = [
  { label: '设施设备对象', value: EPointType.device },
  { label: '区域名称', value: EPointType.area },
  { label: '巡查对象', value: EPointType.person },
];
// 设备状态
export enum EquipmentStatus {
  normal = 0, // 正常
  fault = 1, // 故障
  damage = 2, // 损坏
}
// 设备状态下拉选项
export const equipmentStatusOptions: Array<OptionData> = [
  { label: '正常', value: EquipmentStatus.normal },
  { label: '故障', value: EquipmentStatus.fault },
  { label: '损坏', value: EquipmentStatus.damage },
];
// 指标是否需要上传文件
export const uploadFileOptions: Array<OptionData> = [
  { label: '需要', value: 1 },
  { label: '不需要', value: 0 },
];
// 考核项目状态
export enum PerformanceStatus {
  onGoing = 0, // 进行中
  completed = 1, // 已完成
}
// 考核项目状态选项
export const performanceStatusOptions = [
  { label: '全部', value: null },
  { label: '进行中', value: PerformanceStatus.onGoing },
  { label: '已完成', value: PerformanceStatus.completed },
];
// 事项是否作废选项
export const isCancelOptions = [
  { label: '是', value: WhetherFlag.yes },
  { label: '否', value: WhetherFlag.no },
];
// 考核对象
export enum AppraisalObject {
  grid = 0, // 网格
  department = 1, // 职能部门
}
// 考核对象选项
export const appraisalObjectOptions: Array<OptionData> = [
  { label: '网格', value: AppraisalObject.grid },
  { label: '职能部门', value: AppraisalObject.department },
];
// 考核管理详情页面tabList
export enum appraisalDetailTab {
  baseMsg = '基本信息',
  fileCollection = '资料收集',
  evaluationIndex = '评价指标',
  assessResult = '考核结果'
}
export const appraisalDetailTabList: Array<any> = [
  { key: appraisalDetailTab.baseMsg, tab: appraisalDetailTab.baseMsg },
  { key: appraisalDetailTab.fileCollection, tab: appraisalDetailTab.fileCollection },
  { key: appraisalDetailTab.evaluationIndex, tab: appraisalDetailTab.evaluationIndex },
  { key: appraisalDetailTab.assessResult, tab: appraisalDetailTab.assessResult }
];
// 资料收集状态
export enum FileCollectionStatus {
  onGoing = 0, // 进行中
  completed = 1, // 已完成
}
export const fileCollectionOptions: Array<OptionData> = [
  { label: '进行中', value: FileCollectionStatus.onGoing },
  { label: '已完成', value: FileCollectionStatus.completed },
];
export const circleStyle = {
  borderWeight: 3,
  strokeColor: '#FF33FF',
  strokeWeight: 6,
  strokeOpacity: 0.2,
  fillOpacity: 0.4,
  strokeStyle: 'dashed',
  strokeDasharray: [10, 10],
  // 线样式还支持 'dashed'
  fillColor: '#1791fc',
};
export const attendanceCycle: Array<OptionData> = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周七', value: 7 },
];
// 考核结果--统计图样式
export const cardStyle: React.CSSProperties = { height: 340 };
// 上传资料--指标项样式
export const indicatorMsgStyle: React.CSSProperties = { paddingLeft: 100 };
// 上传资料--指标项字体样式
export const indicatorMsgLabelStyle: React.CSSProperties = { fontWeight: 'bolder' };
export const attendanceStatusOption: Array<OptionData> = [
  { label: '考勤', value: WhetherFlag.yes },
  { label: '不考勤', value: WhetherFlag.no },
];
// 请假审批状态
export enum vacateCheckStatus {
  pending = 0, // 待审批
  onGoing = 1, // 审批中
  passed = 2, // 已通过
  reject = 3, // 未通过
}
export const vacateCheckStatusOption: Array<OptionData> = [
  { label: '待审批', value: vacateCheckStatus.pending },
  { label: '审批中', value: vacateCheckStatus.onGoing },
  { label: '已通过', value: vacateCheckStatus.passed },
  { label: '未通过', value: vacateCheckStatus.reject },
];


// 打卡状态
export enum EAttendanceStatus {
  normal =5, // 正常已打卡
  delay = 1, // 迟到
  early = 2, // 早退
  timeWarn = 3, // 时间异常
  locationWarn = 4, // 地点异常
  none = 7, // 未打卡
}
export const clockStatusOption: Array<any> = [
  { label: '正常', value: EAttendanceStatus.normal, tag: 'green' },
  { label: '迟到', value: EAttendanceStatus.delay, tag: 'purple' },
  { label: '早退', value: EAttendanceStatus.early, tag: 'purple' },
  { label: '时间异常', value: EAttendanceStatus.timeWarn, tag: 'orange' },
  { label: '地点异常', value: EAttendanceStatus.locationWarn, tag: 'orange' },
  { label: '未打卡', value: EAttendanceStatus.none, tag: 'red' },
];
// 当前审批人对于请假单的操作
export enum vacateOprationStatus {
  detail = 'detail', // 查看详情
  approval = 'approval', // 审批
}
// 请假tab
export enum vacateTab {
  my = 'my', // 我的审批
  all = 'all' // 审批汇总
}
// 上传状态
export enum UploadStatus {
  wait = -1,
  uploading = 0,
  success = 1,
  fail = 2
}
// 个人中心页面tabList
export enum personCenterTab {
  myClock = '我的考勤',
  myReport = '我的上报',
  myVacate = '我的请假',
  personMsg = '信息管理'
}
export const personCenterTabList: Array<any> = [
  { key: personCenterTab.myClock, tab: personCenterTab.myClock },
  { key: personCenterTab.myReport, tab: personCenterTab.myReport },
  { key: personCenterTab.myVacate, tab: personCenterTab.myVacate },
  { key: personCenterTab.personMsg, tab: personCenterTab.personMsg }
];