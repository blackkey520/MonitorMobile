import moment from 'moment';
import * as monitordataService from '../services/monitordataService';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'monitordata',
  state: {
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
    loadData(state, { payload }) {
      const xAxis = state.xAxis;
      const yAxis = state.yAxis;
      const monitordata = state.monitordata;
      payload.monitordata.map((type, i) => {
        let formatTime = '';
        let formatValue = '';
        if (payload.dataType === 'realtime') {
          formatValue = type.MonitorValue ? type.MonitorValue : '-';
          formatTime = moment(type.MonitorTime).format('HH:mm');
        } else {
          if (payload.dataType === 'minute') {
            formatTime = moment(type.MonitorTime).format('HH:mm');
          } else if (payload.dataType === 'hour') {
            formatTime = moment(type.MonitorTime).format('MM-DD HH:mm');
          } else {
            formatTime = moment(type.MonitorTime).format('YYYY-MM-DD');
          }
          formatValue = type.AvgValue ? type.AvgValue : '-';
        }
        type.formatTime = formatTime;
        type.formatValue = formatValue;
        monitordata.push(type);
        xAxis.push(formatTime);
        yAxis.push(formatValue);
      });
      return { ...state, ...payload, monitordata, xAxis, yAxis, spinning: false };
    },
  },
  effects: {
    * searchlastdata({ payload: { dgimn } }, { callWithSpinning, update }) {
      let result = null;
      result = yield callWithSpinning(monitordataService.getLastData,
        { dgimn });
      const lastmonitorpoint = result.data.Point;
      const lastmonitordata = result.data.RealtimeData;
      yield update({ lastmonitorpoint, lastmonitordata });
    },
    * searchmore({ payload: { current } }, { call, put, select }) {
      let result = null;
      const monitor = yield select(state => state.monitordata);
      const point = yield select(state => state.point);
      yield put('showSpinning', {});

      result = yield call(monitordataService.searchdatalist,
        { PollutantCode: monitor.pollutant.PolluntCode,
          DGIMN: point.selectedpoint.Point.Dgimn,
          BeginTime: monitor.startDate,
          EndTime: monitor.endDate,
          pageIndex: current,
          pageSize: monitor.pageSize,
          dataType: monitor.dataType });
      yield put('loadData', { dataType: monitor.dataType, monitordata: result.data != null ? result.data : [], current, total: result.total, spinning: true });
    },
    * searchdata({ payload: { dataType, startDate, endDate,
      pollutant, dgimn } }, { call, put, select }) {
      let result = null;
      const monitor = yield select(state => state.monitordata);
      yield put('showSpinning', { dataType, startDate, endDate, pollutant, current: 1, monitordata: [], xAxis: [], yAxis: [] });
      result = yield call(monitordataService.searchdatalist,
        { PollutantCode: pollutant.PolluntCode,
          DGIMN: dgimn,
          BeginTime: startDate,
          EndTime: endDate,
          pageIndex: 1,
          pageSize: monitor.pageSize,
          dataType });
      yield put('loadData', { dataType, monitordata: result.data != null ? result.data : [], current: 1, total: result.total });
    },
  },
});
