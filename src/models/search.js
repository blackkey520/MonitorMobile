import { createAction, NavigationActions,ShowToast} from '../utils'
import * as searchService from '../services/searchService'
export default {
  namespace: 'search',
  state: {
    fetching: false,
    size:20,
    total:0,
    current:0,
    result:[],
    searchText:'',
    searchscene:'history',
    associateresult:[],
    searchhistory:[]
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, fetching: true }
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false }
    },
    changeScene(state,{payload}){
      return { ...state,searchscene:payload.Scene, fetching: false }
    },
    changeState(state,{payload}){
      return { ...state, ...payload}
    }
  },
  effects: {
      *loadsearchhistory({ payload: {Num}},{call,put,select}){
        let result=[];
        const state = yield select(state => state.point);
        result = yield call(searchService.loadsearchhistory,
           {})
        yield put(createAction('changeState')({searchhistory:result}))
      },
      *associate({ payload: { searchText }},{call,put,select}){
        let result=[];
        const state = yield select(state => state.point);
        yield put(createAction('fetchStart')())
        result = yield call(searchService.associatefetch,
           {text:searchText})
        yield put(createAction('fetchEnd')({ associateresult:result}))
      },
      *search({ payload: { current,searchText} }, { call, put ,select}) {
        let result=[];
        const state = yield select(state => state.point);
        yield put(createAction('fetchStart')())
        result = yield call(searchService.searchfetch,
           {text:searchText})
         yield call(searchService.savesearchtext,
          {content:searchText,num:10})
        yield put(createAction('fetchEnd')({ result:result,searchText:searchText}))
      },
  },
}
