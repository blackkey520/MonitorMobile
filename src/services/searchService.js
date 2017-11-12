import { get, posturl } from '../dvapack/request';
import api from '../config/globalapi';

export const savesearchtext = async (param) => {
  const body = {
    userId: param.user.User_ID,
    content: param.content,
    num: param.num,
  };
  const result = await posturl(api.wholesearch.savesearchtext, body, null);
  return result;
};
export const loadsearchhistory = async (param) => {
  const body = {
    userId: param.user.User_ID,
  };
  const result = await get(api.wholesearch.searchhistory, body, null);
  return result;
};
export const searchfetch = async (param) => {
  const body = {
    serachName: param.text,
    isLx: false,
  };
  const result = await get(api.wholesearch.fulltextsearch, body, null);
  return result;
};
export const associatefetch = async (param) => {
  const body = {
    serachName: param.text,
    isLx: true,
  };
  const result = await get(api.wholesearch.fulltextsearch, body, null);
  return result;
};
