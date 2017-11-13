import URI from 'urijs';
import { getUseNetConfig, loadToken } from '../storage';
import { ShowToast } from '../../utils';

async function geturl(url, tooken) {
  const user = await loadToken();
  if (!tooken) {
    if (user != null) {
      url += `?authorCode=${user.User_ID}`;
    }
  } else if (tooken !== 'notooken') {
    url += `?authorCode=${tooken}`;
  }
  return url;
}

const fetchtimeout = (requestPromise, timeout = 30000) => {
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
  const { neturl } = await getUseNetConfig();
  const uri = new URI(neturl + url);
  const options = _options || {};
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
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
  const json = await JSON.parse(text);
  // 如果请求失败
  if (resp.status !== 200) {
    if (resp.status === 401) {
      ShowToast(`服务器故障${resp.status}`);
    }
  }
  if (json.requstresult) {
    if (json && json != null) {
      if (json.requstresult === '1') {
        return json;
      }
      ShowToast(json.reason);
      return null;
    }
    return null;
  }
}
export function test(url, params) {
  const jsonBody = JSON.stringify(params.body);
  const myFetch = fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonBody,
  });
  return new Promise((resolve, reject) => {
    fetchtimeout(myFetch, 5000)
      .then(response => response.json())
      .then((responseData) => {
        resolve(responseData);
        return responseData;
      })
      .catch((error) => {
        reject(error);
        return false;
      });
  });
}
// file: {uri}
export async function upload(url, body, optionscall, tooken) {
  const { neturl } = await getUseNetConfig();
  url = await geturl(url, tooken);
  const uri = new URI(neturl + url);
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    ...optionscall
  };

  const resp = await fetch(uri.toString(), options);
  console.log(`status${resp.status}`);

  const text = await resp.text();

  console.log('RESP:', text);

  const json = JSON.parse(text);

  // 如果请求失败
  if (resp.status !== 200) {
    if (resp.status === 401) {
      ShowToast(`服务器故障${resp.status}`);
    }
  }
  if (json.requstresult) {
    if (json && json != null) {
      if (json.requstresult === '1') {
        return json;
      }
      ShowToast(json.reason);
      return null;
    }
    return null;
  }


  return json;
}
export async function get(url, params, options, tooken) {
  if (params) {
    const paramsArray = [];
    // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    url = await geturl(url, tooken);
    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
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

export async function post(url, data, options, tooken) {
  url = await geturl(url, tooken);
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options,
  });
}
export async function posturl(url, params, options, tooken) {
  if (params) {
    const paramsArray = [];
    // encodeURIComponent
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    url = await geturl(url, tooken);
    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
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
