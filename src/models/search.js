import * as searchService from '../services/searchService';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'search',
  state: {
    size: 20,
    total: 0,
    current: 0,
    searchresult: [],
    searchText: '',
    searchscene: 'history',
    associateresult: [],
    searchhistory: [],
  },
  reducers: {
    changeScene(state, { payload }) {
      return { ...state, searchscene: payload.Scene, searchText: false };
    },
  },
  subscriptions: {
    setupSubscriber({ listen }) {
      listen('Search', { type: 'loadsearchhistory' });
    }
  },
  effects: {
    * loadsearchhistory({ payload }, { call, update, select }) {
      const searchhistory = yield call(searchService.loadsearchhistory, {});
      yield update({ searchhistory });
    },
    * associate({ payload: { searchText } }, { callWithLoading, update, select }) {
      const associateresult = yield callWithLoading(searchService.associatefetch,
        { text: searchText }, { searchscene: 'associate' });
      yield update({ associateresult });
    },
    * search({ payload: { current, searchText } }, { call, put, select }) {
      yield put('showLoading', { searchscene: 'result', result: [] });
      const searchresult = yield call(searchService.searchfetch,
        { text: searchText });
      yield call(searchService.savesearchtext, { content: searchText, num: 10 });
      yield put('hideLoading', { searchresult, searchText });
    },
  },
});
