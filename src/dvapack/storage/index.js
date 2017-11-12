
import { observable } from 'mobx';

const KEY_TOKEN = 'accessToken';


const token = observable(null);
const netconfig = observable(null);

export function saveStorage(key, obj) {
  return global.storage.save({ key, data: JSON.stringify(obj) });
}
export async function loadStorage(key) {
  const storageloadst = await storageload(key);
  const storagejson = JSON.parse(storageloadst);
  return storagejson;
}

export function getNetConfig() {
  return netconfig.get();
}
export function getUseNetConfig() {
  const config = netconfig.get().find((value, index, arr) => value.isuse === true);
  return config;
}
export async function saveNetConfig(_netconfig) {
  netconfig.set(_netconfig);
  return global.storage.save({ key: 'netConfig', data: JSON.stringify(_netconfig) });
}
export async function loadNetConfig() {
  const storagenetconfig = await storageload('netConfig');
  const storagenetobj = storagenetconfig
    ? JSON.parse(storagenetconfig)
    : null;
  netconfig.set(storagenetobj);
  return netconfig.get();
}


export function getToken() {
  return token.get();
}
export function saveToken(_token) {
  token.set(_token);
  return global.storage.save({ key: KEY_TOKEN, data: JSON.stringify(token) });
}
export async function clearToken() {
  await global.storage.remove({ key: KEY_TOKEN });
  token.set(null);
}
export async function loadToken() {
  // let storagetoken=await global.storage.load({key: KEY_TOKEN}); //await storageload(KEY_TOKEN);
  const storagetoken = await storageload(KEY_TOKEN);
  const storagetokenobj = storagetoken ? JSON.parse(storagetoken) : null;
  token.set(storagetokenobj);
  return token.get();
}

export async function storageload(key) {
  let rtnVal = null;
  await global.storage.load({
    key,
  }).then((ret) => {
    rtnVal = ret;
  }).catch((err) => {
    rtnVal = null;
  });
  return rtnVal;
}

