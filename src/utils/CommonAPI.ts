/**
 * @description: 公用后台数据（通过接口获取到的）
 * @author: cnn
 * @createTime: 2020/11/27 17:25
 **/
import { get, post } from '@utils/Ajax';
import { OptionData } from '@utils/CommonInterface';
import { message } from 'antd';
import { DispatchWaysByUser } from '@utils/CommonVars';

/**
 * 获取所有未禁用的机构列表
 * **/
export const getOrgTreeEnableList = async () => {
  return new Promise((resolve: any) => {
    get('security/organization/listAllEnableForAdmin', {}, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data.children);
      }
    });
  });
};
/**
 * 获取省市区
 * **/
export const getAllProvinceCityArea = async () => {
  return new Promise((resolve: any) => {
    get('sysmanage/provinceCityArea/getAllProvinceCityArea', {}, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data);
      }
    });
  });
};
/**
 * 获取数据字典数据
 **/
export const getDictValueList = async (module: string, number: string, valueIsId?: boolean) => {
  return new Promise((resolve: any) => {
    post('sysmanage/dictValue/getByTypeModuleNumber', { module, number }, {}, (data: any) => {
      if (data.flag === 0) {
        let optionList: Array<OptionData> = [];
        if (valueIsId) {
          optionList = data.data.map((item: any) => ({ label: item.mvalue, value: item.id }));
        } else {
          optionList = data.data.map((item: any) => ({ label: item.mvalue, value: item.mvalue }));
        }
        resolve(optionList);
      }
    });
  });
};
/**
 * 获取机构列表
 * **/
export const getOrgTreeList = async () => {
  return new Promise((resolve: any) => {
    post('security/organization/listAllInTree', {}, {}, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data.children);
      }
    });
  });
};
/**
 * @description 根据id删除数据
 * @param url 接口地址
 * @param id
 */
export const deleteById = (url: string, id: string) => {
  return new Promise((resolve: any) => {
    post(url, { id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功');
        resolve(data);
      }
    });
  });
};
/**
 * @description 获取网格层级选项
 */
export const getGridLevelOptions = () => {
  return new Promise((resolve: any) => {
    post('biz/gridLevel/queryAllLevel', {}, { dataType: 'json' }, (data: any) => {
      if (data.flag === 0) {
        let dataList: Array<OptionData> = [];
        data.data.forEach((item: any) => {
          dataList.push({
            label: item.name,
            value: item.level,
          });
        });
        resolve(dataList);
      }
    });
  });
};
/**
 * @description 获取派遣方式选项
 * @param userId 当前用户id
 */
export const getDispatchOptions = (userId: string) => {
  return new Promise((resolve: any) => {
    post('biz/gridLevel/getDispatchWaysByUser', { userId }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        let dataList: Array<OptionData> = [];
        data.data.forEach((item: string) => {
          if (item.indexOf('下级') > -1) {
            dataList.push({ label: item, value: DispatchWaysByUser.underLevel });
          } else if (item.indexOf('基础') > -1) {
            dataList.push({ label: item, value: DispatchWaysByUser.baseGrid });
          } else if (item.indexOf('职能') > -1) {
            dataList.push({ label: item, value: DispatchWaysByUser.orgGrid });
          }
        });
        resolve(dataList);
      }
    });
  });
};
/**
 * @description 获取下级网格
 * @param userId 当前用户id
 */
export const getNextLevelGridOptions = (userId: string) => {
  return new Promise((resolve: any) => {
    post('biz/baseGrid/queryGridByUserId', { userId }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data);
      }
    });
  });
};
/**
 * @description 获取基础网格
 * @param userId 当前用户id
 */
export const getBaseGridOptions = (userId: string) => {
  return new Promise((resolve: any) => {
    post('biz/baseGrid/queryBaseGridByUserId', { userId }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data);
      }
    });
  });
};
/**
 * @description 获取当前机构下所有的项目
 */
export const getAllProjectList = async () => {
  return new Promise(resolve => {
    // let user = sessionStorage.getItem('userInfo');
    let param = {
      searchConditionList: []
    };
    post('biz/engineering/listAll', param, { dataType: 'json' }, (data: any) => {
      if (data.flag === 0) {
        resolve(data.data);
      }
    });
  });
};