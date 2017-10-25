
import {
  saveToken,
  post,
getUseNetConfig,
  loadToken,
  get,
} from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi';

export const getcontactlist = async (param) => {
  try {
    const user = await loadToken();
    // 构建参数对象
    const body = {
      authorCode: user.User_ID,
    };
    let result = null;
    // NOTE: 获取网络配置信息
    const netconfig = getUseNetConfig();
    const url = netconfig.neturl + api.system.contactlist;
    await get(url, body).then(async (data) => {
      // 处理 请求success
      if (data && data.requstresult === 1) {
        result = data.data;
        result.message = '';
      } else {
        // dispatch错误的原因
        result.message = data.reason;
      }
    }, (json) => {
      result.message = '登录异常';
    });
    return result;
  } catch (e) {
    return e;
  } finally {
  }
};

export const login = async (param) => {
  try {
    // 构建参数对象
    const body = {
      User_Name: param.username,
      User_Pwd: param.password,
    };
    let result = null;
    // NOTE: 获取网络配置信息
    const netconfig = getUseNetConfig();
    const url = netconfig.neturl + api.system.login;
    await post(url, body).then(async (data) => {
      // 处理 请求success
      if (data && data.requstresult == 1) {
        // 登陆成功则记录登陆人的对象
        await saveToken(data.data);
        result = data.data;
        result.message = '';
      } else {
        // dispatch错误的原因
        result.message = data.reason;
      }
    }, (json) => {
      result.message = '登录异常';
    });
    return result;
  } catch (e) {
    return e;
  } finally {
  }
};


export const resetPwd = async (param) => {
  try {
    // 构建参数对象
    const body = {
      authorCode: param.authorCode,
      UserPwdOld: param.userPwdOld,
      UserPwdNew: param.userPwdNew,
      UserPwdTwo: param.userPwdTwo,
    };
    let result = {};
    // NOTE: 获取网络配置信息
    const netconfig = getUseNetConfig();
    const url = `${netconfig.neturl + api.system.resetpwd}?authorCode=${body.authorCode}`;
    await post(url, body).then(async (data) => {
      // 处理 请求success
      if (data && data.requstresult == 1) {
        result = data.data;
        result.message = '';
      } else {
        // dispatch错误的原因
        result.message = data.reason;
      }
    }, (json) => {
      result.message = '修改异常';
    });
    return result;
  } catch (e) {
    return e;
  } finally {
  }
};
