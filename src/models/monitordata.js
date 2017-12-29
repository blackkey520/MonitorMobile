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
    lineData: [],
  },
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        MonitorPoint: ({ params: { dgimn } }) => {
          dispatch({ type: 'searchlastdata',
            payload: {
              dgimn,
            },
          });
        },
        HistoryData: ({ params: { dgimn, pollutant } }) => {
          dispatch({ type: 'searchdata',
            payload: {
              dgimn,
              startDate: moment().add(-10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
              endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              pollutant,
              dataType: 'realtime',
            },
          });
        },
      });
    },
  },
  reducers: {
    loadData(state, { payload }) {
      const lineData = state.lineData;
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
        lineData.push({
          x: formatTime,
          y: formatValue,
        });
      });
      return { ...state, ...payload, monitordata, lineData, loading: false };
    },
  },
  effects: {
    * searchlastdata({ payload: { dgimn } }, { callWithSpinning, update }) {
      const { data: { Point: lastmonitorpoint, RealtimeData: lastmonitordata } } =
        yield callWithSpinning(monitordataService.getLastData, { dgimn });
      yield update({ lastmonitorpoint, lastmonitordata });
    },
    * searchmore({ payload: { current } }, { call, put, select }) {
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
      yield put('showLoading', {});
      const { data, total } = yield call(monitordataService.searchdatalist,
        { PollutantCode,
          DGIMN,
          BeginTime,
          EndTime,
          pageIndex: current,
          pageSize,
          dataType });
      yield put('loadData', { dataType, monitordata: data !== null && data.length !== 0 ? data : [], current, total, spinning: true });
    },
    * searchdata({ payload: { dataType, startDate: BeginTime,
      endDate: EndTime, pollutant,
      dgimn: DGIMN } }, { call, put, select }) {
      const { pageSize } = yield select(state => state.monitordata);
      yield put('showLoading', { dataType, BeginTime, EndTime, pollutant, current: 1, monitordata: [], xAxis: [], yAxis: [] });
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
