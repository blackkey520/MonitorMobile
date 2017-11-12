import { get, posturl, upload } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';
// legend
export const getlegend = async (param) => {
  const body = {
    pollutantType: param.pollutantType,
  };
  const result = await get(api.monitorpoint.legend, body, null);
  return result;
};
export const uploadimage = async (param) => {
  const body = {
    fileType: param.FileType,
    img: param.img,
    IsUploadSuccess: true,
    IsPc: false,
    code: param.code,
    fileName: '',
    fileSize: '',
    attachId: '',
    baseType: 1,
  };
  const result = await upload(api.monitorpoint.uploadimage, body, null);
  return result;
};
export const getcollectpointlist = async (param) => {
  const body = {
    userId: param.user.User_ID,
    pageIndex: param.pageIndex,
    pageSize: param.pageSize,
  };
  const result = await get(api.monitorpoint.collectpointlist, body, null);
  return result;
};
export const collectpoint = async (param) => {
  const body = {
    userId: param.user.User_ID,
    dgimn: param.dgimn,
  };
  const result = await posturl(api.monitorpoint.CollectPoint, body, null);
  return result;
};
export const selectsinglepoint = async (param) => {
  const body = {
    dgimn: param.dgimn,
    fileLength: param.fileLength,
    width: param.width,
    height: '',
  };
  const result = await get(api.monitorpoint.singlepoint, body, null);
  return result;
};

export const fetchlist = async (param) => {
  const body = {
    pollutantType: param.pollutantType,
    pageIndex: param.pageIndex,
    pageSize: param.pageSize,
  };
  const result = await get(api.monitorpoint.pointlist, body, null);
  return result;
};
