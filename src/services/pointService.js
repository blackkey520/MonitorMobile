import {ShowToast} from '../utils'
import { loadToken,get,posturl,getNetConfig,upload } from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi';
//uploadimage
export const uploadimage =async(param)=>{
  try {

        let user=await loadToken();
        //构建参数对象
        let body = {
              fileType:param.FileType,
              img:param.img,
              IsUploadSuccess:true,
              IsPc:false,
              code:param.code,
              fileName:'',
              fileSize:'',
              attachId:'',
              baseType:1
          };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.uploadimage+'?authorCode='+user.User_ID;

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
export const getcollectpointlist =async(param)=>{
  try {

        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            userId:user.User_ID,
            pageIndex:param.pageIndex,
            pageSize:param.pageSize
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.collectpointlist;
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

//CollectPoint
export const collectpoint =async(param)=>{
  try {

        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            userId: user.User_ID,
            dgimn:param.dgimn,
            polutantType:param.polutantType
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.CollectPoint;
        await posturl(url,body).then(async(data) => {

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

export const selectsinglepoint =async(param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            dgimn: param.dgimn,
            fileLength:param.fileLength,
            width:param.width,
            height:''
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.singlepoint;

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
export const fetchlist = async (param) => {
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            pollutantType: param.pollutantType,
            pageIndex:param.pageIndex,
            pageSize:param.pageSize
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.pointlist;

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
