/**
 * @description: 公共接口
 * @author: cnn
 * @createTime: 2020/7/22 9:30
 **/
import { MatterLevel, OrganizationEnable, RoleType } from '@utils/CommonVars';

/**
 * 基础实体
 * **/
export interface BaseEntity {
  id: string,
  name: string,
  code?: string
}
/**
 * 菜单
 * **/
export interface MenuData extends BaseEntity {
  icon: string,
  url: string,
  menuType: number,
  children?: Array<MenuData>
}
/**
 * 机构
 * **/
export interface Organization extends BaseEntity{
  title: string,
  value: string,
  key: string,
  enable: OrganizationEnable,
  children: Array<Organization>,
  detailAddress?: string,
  contactPerson?: string,
  contactPhone?: string,
  proOrgType: string,
  parentOrgId?: string
}
/**
 * 管理员
 * **/
export interface Admin extends BaseEntity {
  userName: string,
  phone: string,
  roleId: string,
  roleName: string,
  createTime: string,
  organizationName: string,
  organizationId: string,
  organizationCode: string
}
/**
 * 用户
 * **/
export interface User extends BaseEntity {
  phone: string,
  roleId: string,
  roleName: string,
  createTime: string,
  organizationName: string,
  organizationId: string,
  organizationCode?: string
}
/**
 * 查询条件
 * **/
export interface SearchCondition {
  name: string,
  operand: string,
  value?: string | number
}
/**
 * 数据字典选项
 * **/
export interface Dict {
  id: string,
  mkey: string,
  mvalue: string,
  isSysSet: number
}
/**
 * 选项
 * **/
export interface OptionData {
  label: string,
  value: string | number
}
/**
 * 管理员角色
 * **/
export interface Role extends BaseEntity {
  number: string,
  remark: string,
  roleType: RoleType,
  status: number,
  enable: number,
}
/**
 * 网格层级
 * **/
export interface IGridLevel extends BaseEntity {
  status: number, // 受理状态
  girdLevel: number, // 网格层级
  dispatchWays: string, // 派遣方式
}
/**
 * 网格类型
 * **/
export interface IGridType extends BaseEntity {
  isSystem: number, // 是否系统预设
  number: number, // 类型序号
}
/**
 * 网格树结构数据
 **/
export interface IGridTree {
  title: string,
  key: string,
  children?: Array<IGridTree>,
}
/**
 * 基础网格
 * **/
export interface IBaseGrid extends BaseEntity {
  gridLevelId: number, // 网格层级id
  gridLevelName: string, // 网格层级名称
  orgId: string, // 责任单位id
  orgName: string, // 责任单位
  gridMsg: string, // 网格信息
  fatherGridId?: string, // 父级网格id
  fatherGridName?: string, // 父级网格id
  leader: string, // 网格长
  leaderName: string,
  baseGridVOList: Array<any>,
  count: number, // 网格人员数
  gridTypeId: string, // 网格类型id
  remark?: string, // 备注信息
  frameJson: any, // 区域经纬度信息
}
/**
 * 职能网格
 * **/
export interface IFunctionGrid extends BaseEntity {
  gridMsg: string, // 网格信息
  count: number, // 专业网格人员数
  gridTypeId: string, // 网格类型id
  gridRegion: string, // 网格区域
  color: string, // 网格颜色
  remark?: string, // 备注信息
  majorGridVOList: Array<any>, // 网格人员
  functionGridRegionVOList: Array<any> // 基础网格
}
/**
 * 专职网格员
 * **/
export interface IFullTimeGridMember extends BaseEntity {
  username: string,
  memberId: string, // 人员id
  gridMember: string, // 网格id
  phone: string, // 联系方式
  unitId: string, // 所属单位id
  sex: number, // 性别
  password: string, // 密码
  portrait?: string, // 头像
  position: string, // 职务
  gridName: string, // 所属网格
  orgName: string, // 所属组织
}
interface IFunctionGridOfMember {
  functionGridName: string;
  functionGridCode: string;
  functionGridType: string;
}
/**
 * 专业网格员
 * **/
export interface IMajorGridMember extends BaseEntity {
  userPhone: string, // 联系方式
  userOrg: string, // 所属单位id
  functionGridTypeVOList: Array<IFunctionGridOfMember>, // 所属网格
}
export interface IMatterType extends BaseEntity {
  type: MatterLevel, // 类型等级
  disposalTime: string, // 处置时间
  children: Array<IMatterType>,
  orgId: string, // 责任单位
  score: number, // 分值
  acceptStandard: string, // 受理标准
  handleStandard: string, // 处办标准
  moveDown: number,
  moveUp: number,
}
// 事项详情
export interface IMatterDetail {
  matterTypeMerge: string,
  bigType: string,
  bigTypeId: string
  code: string
  description: string
  dutyGrid: string
  dutyGridId: string
  fileUrl: Array<any>,
  functionType: string
  functionTypeId: string
  id: string
  latitude: string
  limitDate: string
  linkStatus: string
  longitude: string
  minType: string
  minTypeId: string
  reportDate: string
  reportLocation: string
  reportName: string
  source: string
  status: number
  thresholdDate: string,
  handGridOrg: string
}
// 事项追溯
export interface IMatterTrace {
  id: string,
  operator: string,
  operatorOrg: string,
  remark: string,
  time: string,
  recordDetail: string,
  handingInformationId: string
}
// 事项催办记录
export interface IMatterUrgeRecord {
  id: string,
  code: string,
  matterId: string,
  urgeTime: string,
  status: number
}
// 小区
export interface IPlot extends BaseEntity {
  baseGridId: string,
  longitude: string,
  latitude: string
}
// 楼栋
export interface IBuilding extends BaseEntity {
  communityId: string,
  houseVOList: Array<IHouse>,
}
// 房屋
export interface IHouse extends BaseEntity {
  communityId: string,
  communityName: string,
  buildingId: string,
  buildingName: string,
  longitude: string,
  latitude: string,
  residentVOList?: Array<any>,
  ownerName: string,
  phone: string,
  type: string,
  remark: string,
}
// 居民
export interface IResident extends BaseEntity {
  phone: string,
  houseId: string,
  houseName: string,
  communityName: string,
  buildingName: string
}
// 设施设备
export interface IEquipment extends BaseEntity {
  latitude: string,
  longitude: string,
  remark: string,
  typeName: string,
  baseGrid: string
  model: string,
  code: string,
  status: number,
  company: string
}