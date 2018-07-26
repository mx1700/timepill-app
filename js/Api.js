/**
 * @providesModule Api
 */

import TokenManager from './TokenManager'
import UpdateInfo from './UpdateInfo';
import {AsyncStorage} from "react-native";
const DeviceInfo = require('react-native-device-info');

const OS = DeviceInfo.getSystemName();
const OS_VERSION = DeviceInfo.getSystemVersion();
const DEVICE_ID = DeviceInfo.getUniqueID();
const VERSION = DeviceInfo.getVersion();

// console.log(OS, OS_VERSION, DEVICE_ID, VERSION, DeviceInfo.getBundleId());
const baseUrl = 'http://open.timepill.net/api';
// const BASE_URL_V2 = 'http://v2.timepill.net/api';
const BASE_URL_V2 = 'http://127.0.0.1:8000/api';

export async function getTodayDiaries(page = 1, page_size = 20, first_id = '') {
  return call('GET', '/diaries/today?page=' + page + '&page_size=' + page_size + `&first_id=${first_id}`)
  .then((json) => {
    json.page = Number(json.page);
    json.page_size = Number(json.page_size);
    return json;
  });
}

export async function login(username, password) {
  const token = TokenManager.generateToken(username, password);
  await TokenManager.setToken(token);
  try {
    const user_info = await getSelfInfo();
    await TokenManager.setUser(user_info);
    await setLoginPassword("");
    return user_info;
  } catch(err) {
    await TokenManager.setToken('');
      if (err.code && err.code === 401) {
          return false;
      }
      throw err;
  }
}

export async function register(nickname, username, password) {
  const result = await call('POST', '/users', {
      name: nickname,
      email: username,
      password: password,
    });

  if (result) {
    const token = TokenManager.generateToken(username, password);
    await TokenManager.setToken(token);
    const user_info = await getSelfInfo();
    await TokenManager.setUser(user_info);
  }
  return result;
}

export async function logout() {
  TokenManager.setToken('');
  TokenManager.setUser(false);
  TokenManager.setLoginPassword('');
}

export async function getSelfInfoByStore() {
  let user = await TokenManager.getUser();
  // if (!user) {
  //   user = await getSelfInfo();
  //   if (user) {
  //     TokenManager.setUser(user);
  //   }
  // }

  return user;
}

export async function updateUserInfoStore(newInfo) {
  await TokenManager.setUser(newInfo);
}

export async function getSelfInfo() {
  return call('GET', '/users/my')
}

export async function getUserInfo(id) {
  return call('GET', '/users/' + id)
}

export async function updateUserIcon(photoUri) {
  return upload('POST', '/users/icon', {
    icon: {uri: photoUri, name: 'image.jpg', type: 'image/jpg'}
  });
}

export async function updateUserInfo(name, intro) {
  return call('PUT', '/users', {
    name: name,
    intro: intro,
  });
}

export async function getSelfNotebooks() {
  return call('GET', '/notebooks/my')
}

export async function getUserNotebooks(id) {
  return call('GET', '/users/' + id + '/notebooks')
}

export async function getNotebook(id) {
  return call('POST', '/notebooks/' + id)
}

export async function createNotebook(subject, description, expired, privacy) {
  return call('POST', '/notebooks', {
    subject: subject,
    description: description,
    expired: expired,
    privacy: privacy,
  })
}

export async function updateNotebook(id, subject, description, privacy) {
  return call('PUT', '/notebooks/' + id, {
    subject: subject,
    description: description,
    privacy: privacy,
  })
}

export async function updateNotebookCover(bookId, photoUri) {
  return upload('POST', `/notebooks/${bookId}/cover`, {
    cover: {uri: photoUri, name: 'image.jpg', type: 'image/jpg'},
  })
}

export async function deleteNotebook(id) {
  return call('DELETE', '/notebooks/' + id)
}

export async function addDiary(bookId, content, photoUri = null, join_topic = null) {
  if (photoUri == null) {
    return call('POST', '/notebooks/' + bookId + '/diaries', {
      content: content,
      join_topic: join_topic,
    })
  } else {
    return upload('POST', '/notebooks/' + bookId + '/diaries', {
      content: content,
      photo: {uri: photoUri, name: 'image.jpg', type: 'image/jpg'},
      join_topic: join_topic,
    })
  }

}

export async function getFollowDiaries(page, page_size, first_id) {
  return call('GET', '/diaries/follow?page=' + page + '&page_size=' + page_size + `&first_id=${first_id}`)
    .then((json) => {
      json.page = Number(json.page)
      json.page_size = Number(json.page_size)
      return json;
    });
}

export async function getDiary(id) {
  return call('GET', '/diaries/' + id)
}

export async function deleteDiary(id) {
  return call('DELETE', '/diaries/' + id)
}

export async function updateDiary(id, bookId, content) {
  return call('PUT', '/diaries/' + id, {
    content: content,
    notebook_id: bookId,
  })
}

export async function getUserTodayDiaries(id) {
  return call('GET', '/users/' + id + '/diaries/')
}

export async function getNotebookTodayDiaries(id, page, page_size) {
  return call('GET', '/notebooks/' + id + '/diaries?page=' + page + '&page_size=' + page_size, null, 30000)
      .then((json) => {
        json.page = Number(json.page);
        json.page_size = Number(json.page_size);
        return json;
      });
}

export async function getNotebookDiaries(id, year, month, day) {
  return call('GET', '/notebooks/' + id + '/diaries/' + year + '/' + month + '/' + day)
}

export async function addComment(diaryId, content, recipient_id) {
  return call('POST', '/diaries/' + diaryId + '/comments', {
    content: content,
    recipient_id: recipient_id,
  })
}

export async function deleteComment(id) {
  return call('DELETE', '/comments/' + id)
}

export async function getDiaryComments(diaryId) {
  return call('GET', '/diaries/' + diaryId + '/comments')
}

export async function getRelationUsers(page, page_size) {
  return call('GET', `/relation?page=${page}&page_size=${page_size}`);
}

export async function getRelationReverseUsers(page, page_size) {
  return call('GET', `/relation/reverse?page=${page}&page_size=${page_size}`);
}

export async function getRelation(user_id) {
  return call('GET', '/relation/' + user_id);
}

export async function addFollow(user_id) {
  return call('POST', '/relation/' + user_id);
}

export async function deleteFollow(user_id) {
  return call('DELETE', '/relation/' + user_id);
}

export async function deleteFollowBy(user_id) {
  return call('DELETE', '/relation/reverse/' + user_id);
}

export async function getMessages(last_id = 0) {
  return call('GET', '/tip')
}

export async function getMessagesHistory() {
    return call('GET', '/tip/history')
}

export async function deleteMessage(ids) {
  return call('POST', '/tip/read/' + ids.join(','))
}

export async function getLoginPassword() {
  return TokenManager.getLoginPassword()
}

export async function setLoginPassword(password) {
  return TokenManager.setLoginPassword(password);
}

export async function report(user_id, diary_id) {
  return call('POST', '/reports/', {
    user_id: user_id,
    diary_id: diary_id,
  });
}

export async function getTodayTopic() {
  return call('GET', '/topic/');
}

export async function getTodayTopicDiaries(page, page_size, first_id) {
  return call('GET', `/topic/diaries?page=${page}&page_size=${page_size}&first_id=${first_id}`)
      .then((json) => {
        json.page = Number(json.page);
        json.page_size = Number(json.page_size);
        return json;
      });
}

export async function updatePushInfo() {
    return callV2('POST', '/push');
}

async function getSplash() {
    return callV2('GET', '/splash');
}

export async function syncSplash() {
    const info = await getSplash();
    await setStore('splash', info);
}

export async function feedback(content) {
    return callV2('POST', '/feedback', { content: content })
}

export async function getSplashByStore() {

    try {
        const info = await getStore('splash');
        if (!info) {
            return false;
        }

        // console.log('splash store:', info);

        const now = Date.parse( new Date()) / 1000;
        if ((info.start_time  && info.start_time > now) ||
            (info.end_time && now > info.end_time)) {
            return null;
        }

        const id = info.id;
        const pre_show = await getStore('splash_show');
        const today = (new Date()).getDate();

        // if (pre_show) {
        //     if (pre_show.id === id && pre_show.day === today) {
        //         return null;
        //     }
        // }

        await setStore('splash_show', {
            id: info.id,
            day: today,
        });

        return info;
    } catch (err) {
        //TODO:记录错误
        return false;
    }
}

async function getStore(item) {
    const info = await AsyncStorage.getItem(item);
    return info ? JSON.parse(info) : null;
}

async function setStore(item, data) {
    await AsyncStorage.setItem(item, JSON.stringify(data));
}

export async function hasUnreadUpdateNews() {
  const updateVersion = await TokenManager.getUpdateVersion();
  return updateVersion < UpdateInfo.version;
}

export function getUpdateNews() {
  return UpdateInfo;
}

export async function readUpdateNews() {
  return TokenManager.setUpdateVersion(UpdateInfo.version);
}

export async function saveDraft(content) {
  return TokenManager.setDraft(content)
}

export async function getDraft() {
  return TokenManager.getDraft()
}

export async function clearDraft() {
  return TokenManager.setDraft('')
}



export async function saveTempDraft(content) {
  return TokenManager.setTempDraft(content)
}

export async function getTempDraft() {
  return TokenManager.getTempDraft()
}

export async function clearTempDraft() {
  return TokenManager.setTempDraft('')
}

export async function setSetting(name, val) {
  return TokenManager.setSetting(name, val)
}

export async function getSetting(name) {
  return TokenManager.getSetting(name)
}

export async function getSettings() {
  return TokenManager.getSettings()
}

export async function getUpdateInfo() {
    return callV2('GET', '/updateInfo')
}

export async function mobileRegister(nickname, mobile, password, code) {
    const result = await callV2('POST', '/users', {
        type: 'mobile',
        name: nickname,
        mobile: mobile,
        password: password,
        code: code,
    });

    if (result) {
        const token = TokenManager.generateToken(mobile, password);
        await TokenManager.setToken(token);
        const user_info = await getSelfInfo();
        await TokenManager.setUser(user_info);
    }
    return result;
}

export async function sendRegisterVerificationCode(mobile) {
    return callV2('POST', '/verification/register', {
        'type': 'mobile',
        'sendTo': mobile,
    });
}

export async function clearAppCache() {

}

//==========================================================================

async function call(method, api, body, _timeout = 10000) {
  // console.log('request:', baseUrl + api, body);
  let token = await TokenManager.getToken();
  //console.log(token);
  // if (body) {
  //   let formData = new FormData();
  //   for (key of Object.keys(body)) {
  //
  //   }
  // }
  return timeout(fetch(baseUrl + api, {
        method: method,
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
            'X-TP-OS': OS,
            'X-TP-OS-Version': OS_VERSION,
            'X-TP-Version': VERSION,
            'X-Device-ID': DEVICE_ID,
        },
        body: body ? JSON.stringify(body) : null
      })
          .then(checkStatus)
          .then(parseJSON)
          .catch(handleCatch)
      ,
      _timeout);
}

async function callV2(method, api, body = null, _timeout = 10000) {
    // console.log('request:', BASE_URL_V2 + api, body);
    let token = await TokenManager.getToken();
    return timeout(fetch(BASE_URL_V2 + api, {
            method: method,
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-TP-OS': OS,
                'X-TP-OS-Version': OS_VERSION,
                'X-TP-Version': VERSION,
                'X-Device-ID': DEVICE_ID,
            },
            body: body ? JSON.stringify(body) : null
        })
            .then((response) => {
                // console.log(BASE_URL_V2 + api, response);
                return response;
            })
            .then(checkStatus)
            .then(parseJSON)
            .catch(handleCatch)
        ,
        _timeout);
}

async function upload(method, api, body) {
    console.log('request upload:', baseUrl + api);
    let token = await TokenManager.getToken();
    let formData = new FormData();
    for (let prop of Object.keys(body)) {
        formData.append(prop, body[prop]);
    }
    console.log(formData);
    return timeout(
        fetch(baseUrl + api, {
            method: method,
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-TP-OS': OS,
                'X-TP-OS-Version': OS_VERSION,
                'X-TP-Version': VERSION,
                'X-TP-Device-ID': DEVICE_ID,
            },
            body: formData
        })
            .then(checkStatus)
            .then(parseJSON)
            .catch(handleCatch)
        ,
        60000)
}


async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    console.log('http error: ' + response.status + ' ' + response.body);
    let errInfo;
    try {
      errInfo = await response.json();
        console.log(errInfo);
    } catch (err) {
      errInfo = {
        code: 0,
        message: '服务器开小差了 :('
      }
    }
    let error = new Error(errInfo.message, errInfo.code ? errInfo.code : errInfo.status_code);
      error.code = errInfo.code ? errInfo.code : errInfo.status_code;
    throw error
  }
}

function parseJSON(response) {
  if (response.headers.get('content-type') === 'application/json') {
    const r = response.json();
    return r;
  } else {
    return response.text();
  }
}

function timeout(promise, time) {
  return Promise.race([
    promise,
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error('request timeout')), time)
    })
  ]);
}

function handleCatch(err) {
  //console.log(err, err.id, err.message);
  if (err.message === 'Network request failed') {
    throw new Error('网络连接失败', err.id)
  } else {
    throw err;
  }
}