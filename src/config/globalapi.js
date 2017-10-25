

/**
 * 全局api
 * liz
 * 2016.12.19
 */
const api = {
  crawlerapi: 'http://172.16.12.35/WebApi/api/Values/',
    // NOTE：用户相关api
  system: {
    login: '/rest/Author/IsLogins', // 登陆
    resetpwd: '/rest/Author/ResetPwd', // 修改密码
    contactlist: '/rest/DirectoriesApi/getDirectories/',
    nettest: '/rest/Author/SwitchNewWork/',
  },
    // NOTE: 全文检索相关api
  monitorpoint: {
    monitortype: '/rest/MenuInfo/GetPolluntType/',
    pointlist: '/rest/OutputAsPointApi/GetPointsByPollutantType/',
    singlepoint: '/rest/OutputAsPointApi/GetPointBaseInfo/', // 单个监测点查询
    CollectPoint: '/rest/OutputAsPointApi/CollectPointInfo/',
    collectpointlist: '/rest/OutputAsPointApi/GetCollectInfo/',
    uploadimage: '/rest/OutputAsPointApi/AddPointImg/',
    legend: '/rest/OutputAsPointApi/GetWaterLevels/',
  },
  wholesearch: {
    fulltextsearch: '/rest/OutputAsPointApi/GetLxSearchResult/', // 全文检索
    searchhistory: '/rest/OutputAsPointApi/GetSearchContent/',
    savesearchtext: '/rest/OutputAsPointApi/AddSearchContent/',
  },
  monitortarget: {
      // targetbase:'/rest/OutputAsPointApi/GetEntBaseInfo/',
    targetother: '/rest/OutputAsPointApi/GetEntOtherInfo/',
    uploadimage: '/rest/OutputAsPointApi/AddEntImg/',
  },
    // NOTE: 监控相关api
  monitordata: {
    lastData: '/rest/OutputAsPointApi/GetPointNewRealTimeData/',
    realtimeData: '/rest/RealTime/GetRealTimeData/',
    minuteData: '/rest/Minute/GetMinuteData/',
    hourData: '/rest/Hour/GetHourSinglePollutantData/',
    dayData: '/rest/Day/GetDaySinglePollutantData/',
  },
  alarm: {
    awaitchecklist: '/rest/AlarmDealInfoApi/GetAllPointExceptionInfo/',
    verifiedlist: '/rest/AlarmDealInfoApi/GetVerifiedExceptionInfo/',
    alarmlist: '/rest/AlarmDealInfoApi/GetAllExceptionInfo/',
    postfeedback: '/rest/AlarmDealInfoApi/AddEarlyWarningFeedback/',
    uploadimage: '/rest/AlarmDealInfoApi/UploadImage/',
    feedbackdetail: '/rest/AlarmDealInfoApi/GetEarlyWarningByVerify/',
    feddbackalarmdetail: '/rest/AlarmDealInfoApi/GetVerifyInfoByVerifyID/',
  },
};

export default api;
