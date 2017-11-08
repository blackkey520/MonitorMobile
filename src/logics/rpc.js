/**
 * Created by tdzl2003 on 6/18/16.
 */

import URI from 'urijs';
import { observable } from 'mobx';

class ResponseError extends Error {
  constructor(message, code, origin) {
    super(message);
    this.code = code;
    this.origin = origin;
  }
}


const KEY_TOKEN = 'accessToken';
const ROOT_URL = '';
const UPLOAD_TOKEN_URL = 'upload';

const token = observable(null);
const netconfig = observable(null);
const loginmsg = observable(null);
const storage = observable(new Array());

export function saveStorage(key, obj) {
  return global.storage.save({ key, data: obj });
}
export async function loadStorage(key) {
  const storageloadst = await storageload(key);
  return storageloadst;
}

export function saveLoginMsg(_loginmsg) {
  loginmsg.set(_loginmsg);
  return global.storage.save({ key: 'loginmsg', data: JSON.stringify(_loginmsg) });
}
export async function loadLoginMsg() {
  const storageloginmsg = await storageload('loginmsg');
  const storageloginmsgobj = storageloginmsg ? JSON.parse(storageloginmsg) : null;
  loginmsg.set(storageloginmsgobj);
  return loginmsg.get();
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
export async function clearToken() {
  await global.storage.remove({ key: KEY_TOKEN });
  token.set(null);
}

const _fetch = (requestPromise, timeout = 30000) => {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject('请求超时');
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([requestPromise, timerPromise]);
};


async function request(url, _options) {
  const uri = new URI(ROOT_URL + url);

  const options = _options || {};
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (token) {
    options.headers['x-accesstoken'] = token.get();
  }

  if (__DEV__) {
    console.log(`${options.method} ${uri}`);
    if (options.body) {
      console.log(options.body);
    }
  }
  const resp = await fetch(uri.toString(), options);
  console.log(`status${resp.status}`);
  const text = await resp.text();
  console.log('RESP:', text);

  const json = JSON.parse(text);
  // 如果请求失败
  if (resp.status !== 200) {
    if (resp.status === 401) {
      // HTTP 401 表示授权验证失败(通常是token已过期)
      emit('invalidToken');
      token.set(null);
    }

    throw new ResponseError(json.message, resp.status, json);
  }
  return json;
}

// file: {uri}
export async function upload(url, body) {
  const uri = new URI(ROOT_URL + url);
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  if (token) {
    options.headers['x-accesstoken'] = token.get();
  }

  const resp = await fetch(uri.toString(), options);
  console.log(`status${resp.status}`);

  const text = await resp.text();

  console.log('RESP:', text);

  const json = JSON.parse(text);

  // 如果请求失败
  if (resp.status !== 200) {
    throw new ResponseError(json.message, resp.status, json);
  }

  return json;
}
export function test(url, params) {
  const jsonBody = JSON.stringify(params.body);
  const myFetch = fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonBody,
  });
  return new Promise((resolve, reject) => {
    _fetch(myFetch, 5000)
      .then(response => response.json())
      .then((responseData) => {
        resolve(responseData);
        return true;
      })
      .catch((error) => {
        reject(error);
        return false;
      });
  });
}
export function get(url, params, options) {
  if (params) {
    const paramsArray = [];
        // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return request(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export function post(url, data, options) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}
export function posturl(url, params, options) {
  if (params) {
    const paramsArray = [];
        // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}
export function put(url, data, options) {
  return request(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}

export function $delete(url, data, options) {
  return request(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}
