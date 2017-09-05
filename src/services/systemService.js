import {ShowToast} from '../utils'
import { loadToken,get,getNetConfig } from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi'

export const loadpollutanttype=async ()=>{
  try {
        let user=await loadToken();
        //构建参数对象
        let body = {
            authorCode: user.User_ID
        };
        let result=[];
        // NOTE: 获取网络配置信息
        const netconfig = getNetConfig();
        let url = netconfig.neturl + api.monitorpoint.monitortype;
        await get(url,body).then(async(data) => {

            //处理 请求success
            if (data&&data!=null) {
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
