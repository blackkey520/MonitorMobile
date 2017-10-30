import { createAction, NavigationActions, ShowToast } from '../utils';
import { ShowResult } from '../utils';
import * as monitordataService from '../services/monitordataService';
import moment from 'moment';
export default {
  namespace: 'monitordata',
  state: {
    datafetching: false,
    lastmonitorpoint: null,
    lastmonitordata: [],
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
    monitordata: [],
    pollutant: '',
    dataType: 'realtime',
    total: 0,
    current: 1,
    pageSize: 40,
    xAxis: [],
    yAxis: [],
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, datafetching: true };
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, datafetching: false };
    },
    loadData(state, { payload }) {
      const xAxis = [];
      const yAxis = [];
      payload.monitordata.map((type, i) => {
        let formatTime = '';
        let formatValue = '';
        if (payload.dataType == 'realtime') {
          formatValue = type.MonitorValue ? type.MonitorValue : '-';
          formatTime = moment(type.MonitorTime).format('HH:mm');
        } else {
          if (payload.dataType == 'minute') {
            formatTime = moment(type.MonitorTime).format('HH:mm');
          } else if (payload.dataType == 'hour') {
            formatTime = moment(type.MonitorTime).format('MM-DD HH:mm');
          } else {
            formatTime = moment(type.MonitorTime).format('YYYY-MM-DD');
          }
          formatValue = type.AvgValue ? type.AvgValue : '-';
        }
        type.formatTime = formatTime;
        type.formatValue = formatValue;
        xAxis.push(formatTime);
        yAxis.push(formatValue);
      });
      return { ...state, ...payload, datafetching: false, xAxis, yAxis };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * searchlastdata({ payload: { dgimn } }, { call, put, select }) {
      let result = null;
      yield put(createAction('fetchStart')({ lastmonitordata: [] }));
      result = yield call(monitordataService.getLastData,
             { dgimn });
      yield put(createAction('fetchEnd')({ lastmonitorpoint: result.data.Point,
        lastmonitordata: result.data.RealtimeData != null ? result.data.RealtimeData : [] }));
    },
    * searchmore({ payload: { current } }, { call, put, select }) {
      let result = null;
      const monitor = yield select(state => state.monitordata);
      const point = yield select(state => state.point);
      const dataType = monitor.dataType;
      yield put(createAction('fetchStart')({ current }));
      result = yield call(monitordataService.searchdatalist,
        { PollutantCode: monitor.pollutant.PolluntCode,
          DGIMN: point.selectedpoint.Point.Dgimn,
          BeginTime: monitor.startDate,
          EndTime: monitor.endDate,
          pageIndex: current,
          pageSize: monitor.pageSize,
          dataType });
      let newresult = monitor.monitordata;
      if (result && result.data != null) {
        newresult = newresult.concat(result.data);
      }
      yield put(createAction('loadData')({ dataType, monitordata: newresult, total: result.total }));
    },
    * searchdata({ payload: { dataType, startDate, endDate, pollutant, dgimn } }, { call, put, select }) {
      let result = null;
      const monitor = yield select(state => state.monitordata);

      yield put(createAction('fetchStart')({ dataType, startDate, endDate, pollutant, current: 1, monitordata: [] }));
      result = yield call(monitordataService.searchdatalist,
        { PollutantCode: pollutant.PolluntCode,
          DGIMN: dgimn,
          BeginTime: startDate,
          EndTime: endDate,
          pageIndex: 1,
          pageSize: monitor.pageSize,
          dataType });
      yield put(createAction('loadData')({ dataType, monitordata: result.data != null ? result.data : [], current: 1, total: result.total }));
    },
  },
};
