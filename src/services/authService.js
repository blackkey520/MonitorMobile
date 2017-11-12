
import { post, get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';


export const getcontactlist = async (param) => {
  const body = {
  };
  const result = await get(api.system.contactlist, body, null);
  return result;
};

export const login = async (param) => {
  const body = {
    User_Name: param.username,
    User_Pwd: param.password
  };
  const result = await post(api.system.login, body, null);
  return result;
};

export const resetPwd = async (param) => {
  const body = {
    authorCode: param.authorCode,
    UserPwdOld: param.userPwdOld,
    UserPwdNew: param.userPwdNew,
    UserPwdTwo: param.userPwdTwo,
  };
  const result = await post(api.system.resetpwd, body, null);
  return result;
};

