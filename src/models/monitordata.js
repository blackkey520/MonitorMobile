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
      const { data: { Point: lastmonitorpoint, RealtimeData: lastmonitordata } } =
        yield callWithSpinning(monitordataService.getLastData, { dgimn });
      yield update({ lastmonitorpoint, lastmonitordata });
    },
    * searchmore({ payload: { current: pageIndex } }, { call, put, select }) {
      const {
        dataType,
        pageSize,
        endDate: EndTime,
        startDate: BeginTime,
        pollutant: {
          PolluntCode: PollutantCode,
        },
      } = yield select(state => state.monitordata);
      const {
        selectedpoint: {
          Point: {
            Dgimn: DGIMN,
          },
        },
      } = yield select(state => state.point);
      yield put('showSpinning', {});
      const { data, total } = yield call(monitordataService.searchdatalist,
        { PollutantCode,
          DGIMN,
          BeginTime,
          EndTime,
          pageIndex,
          pageSize,
          dataType });
      yield put('loadData', { dataType, monitordata: data !== null && data.length !== 0 ? data : [], current, total, spinning: true });
    },
    * searchdata({ payload: { dataType, startDate: BeginTime,
      endDate: EndTime, pollutant,
      dgimn: DGIMN } }, { call, put, select }) {
      const { pageSize } = yield select(state => state.monitordata);
      yield put('showSpinning', { dataType, BeginTime, EndTime, pollutant, current: 1, monitordata: [], xAxis: [], yAxis: [] });
      const { data, total } = yield call(monitordataService.searchdatalist,
        { PollutantCode: pollutant.PolluntCode,
          DGIMN,
          BeginTime,
          EndTime,
          pageIndex: 1,
          pageSize,
          dataType });
      yield put('loadData', { dataType, monitordata: data !== null && data.length !== 0 ? data : [], current: 1, total });
    },
  },
});
