import {ShowToast} from '../utils'
import { loadToken,get,posturl,getNetConfig } from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi'
export const savesearchtext = async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
                    authorCode: user.User_ID,
                    userId: user.User_ID,
                    content:param.content,
                    num:param.num
                };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.wholesearch.savesearchtext;

        await posturl(url,body).then(async(data) => {

            //处理 请求success
            if (data &&data.data!=null&& data.requstresult == 1) {
              result=data.data;
            } else {
              // dispatch错误的原因
              ShowToast(data.reason);
            }
        }, (json) => {
          ShowToast('查询异常');
        })
        return result;
    } catch (e) {
      return e;
    } finally {
    }
}
export const loadsearchhistory = async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
                    authorCode: user.User_ID,
                    userId: user.User_ID
                };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.wholesearch.searchhistory;

        await get(url,body).then(async(data) => {

            //处理 请求success
            if (data &&data.data!=null&& data.requstresult == 1) {
              result=data.data;
            } else {
              // dispatch错误的原因
              ShowToast(data.reason);
            }
        }, (json) => {
          ShowToast('查询异常');
        })
        return result;
    } catch (e) {
      return e;
    } finally {
    }
}
export const searchfetch = async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
                    authorCode: user.User_ID,
                    serachName: param.text,
                    isLx: false,
                };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.wholesearch.fulltextsearch;

        await get(url,body).then(async(data) => {

            //处理 请求success
            if (data &&data.data!=null&& data.requstresult == 1) {
              result=data.data;
            } else {
              // dispatch错误的原因
              ShowToast(data.reason);
            }
        }, (json) => {
          ShowToast('查询异常');
        })
        return result;
    } catch (e) {
      return e;
    } finally {
    }
}
export const associatefetch = async (param) => {
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
                    authorCode: user.User_ID,
                    serachName: param.text,
                    isLx: true,
                };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.wholesearch.fulltextsearch;

        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data.data!=null && data.requstresult == 1) {
              result=data.data;
            } else {
              // dispatch错误的原因
              ShowToast(data.reason);
            }
        }, (json) => {
          ShowToast('查询异常');
        })
        return result;
    } catch (e) {
      return e;
    } finally {
    }
}
