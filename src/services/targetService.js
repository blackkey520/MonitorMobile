import { get, upload } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';

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
    baseType: param.baseType,
  };
  const result = await upload(api.monitortarget.uploadimage, body, null);
  return result;
};

export const selecttarget = async (param) => {
  const body = {
    entCode: param.targetCode,
    baseType: param.baseType,
    fileLength: param.fileLength,
    width: param.width,
    height: '',
  };
  const result = await get(api.monitortarget.targetother, body, null);
  return result;
};

