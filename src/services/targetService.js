import {ShowToast} from '../utils'
import { loadToken,get,getNetConfig,upload} from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi'
//uploadimage
export const uploadimage=async (param)=>{
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
          baseType:param.baseType
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitortarget.uploadimage+'?authorCode='+user.User_ID;
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
export const selecttarget=async (param)=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID,
            entCode:param.targetCode,
            baseType:param.baseType,
            fileLength:param.fileLength,
            width:param.width,
            height:''
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitortarget.targetother;
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
