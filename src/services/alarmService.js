import {ShowToast} from '../utils'
import { loadToken,get,getNetConfig,post,upload } from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi'
//feddbackalarmdetail
export const getfeddbackalarmdetail=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            verifyID:param.verifyID
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.feddbackalarmdetail;
        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
//feedbackdetail
export const getfeedbackdetail=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            verifyID:param.verifyID
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.feedbackdetail;
        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
//uploadimage
export const uploadimage=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = [{
              FileType:param.FileType,
              Img:param.Img,
              IsUploadSuccess:true,
              IsPc:false,
              FileName:''
          }];
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.uploadimage+'?authorCode='+user.User_ID;
        // console.log(param.Img);
        await upload(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
//postfeedback
export const postfeedback=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            DGIMN:param.DGIMN,
            ExceptionProcessingID:param.ExceptionProcessingID,
            WarningReason:param.WarningReason,
            sceneDescription:param.sceneDescription,
            ImageID:param.ImageID,
            personalFeedback:user.User_Name,
            feedbackTime:param.feedbackTime,
            RecoveryTime:param.RecoveryTime,
            longitude:param.longitude,
            latitude:param.latitude
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.postfeedback+'?authorCode='+user.User_ID;
        await post(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
//awaitcheckdetail
export const loadalarmlist=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            dgimn:param.dgimn,
            starttime:param.starttime,
            endtime:param.endtime,
            pageindex:param.pageindex,
            pagesize:param.pagesize
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.alarmlist;
        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
//verifiedlist
export const loadaverifiedlist=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            time:param.time
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.verifiedlist;
        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
export const loadawaitcheck=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            time:param.time
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.alarm.awaitchecklist;
        await get(url,body).then(async(data) => {
            //处理 请求success
            if (data&&data!=null) {
              result=data;
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
