import { post, upload, get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';
// feddbackalarmdetail
export const getfeddbackalarmdetail = async (param) => {
  const body = {
    verifyID: param.verifyID,
  };
  const result = await get(api.alarm.feddbackalarmdetail, body, null);
  return result;
};
export const getfeedbackdetail = async (param) => {
  const body = {
    verifyID: param.verifyID,
  };
  const result = await get(api.alarm.feedbackdetail, body, null);
  return result;
};

export const uploadimage = async (param) => {
  const body = [{
    ID: '',
    FileType: param.FileType,
    Img: param.Img,
    IsUploadSuccess: true,
    IsPc: false,
    FileName: 'uploadimage'
  }];
  const result = await upload(api.alarm.uploadimage, body, null);
  return result;
};

export const postfeedback = async (param) => {
  const body = {
    DGIMN: param.DGIMN,
    ExceptionProcessingID: param.ExceptionProcessingID,
    WarningReason: param.WarningReason,
    sceneDescription: param.sceneDescription,
    ImageID: param.ImageID,
    personalFeedback: user.User_Name,
    feedbackTime: param.feedbackTime,
    RecoveryTime: param.RecoveryTime,
    longitude: param.longitude,
    latitude: param.latitude,
  };
  const result = await post(api.alarm.postfeedback, body, null);
  return result;
};
export const loadalarmlist = async (param) => {
  const body = {
    dgimn: param.dgimn,
    starttime: param.starttime,
    endtime: param.endtime,
    pageindex: param.pageindex,
    pagesize: param.pagesize,
  };
  const result = await get(api.alarm.alarmlist, body, null);
  return result;
};

export const loadaverifiedlist = async (param) => {
  const body = {
    time: param.time
  };
  const result = await get(api.alarm.verifiedlist, body, null);
  return result;
};

export const loadawaitcheck = async (param) => {
  const body = {
    time: param.time,
  };
  const result = await get(api.alarm.awaitchecklist, body, null);
  return result;
};
