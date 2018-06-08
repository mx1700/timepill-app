import {
    AsyncStorage
} from 'react-native';
var base64 = require('base-64');

class TokenManager {

  generateToken(username, password) {
    return 'Basic ' + base64.encode(username + ":" + password);
  }

  async setToken(token) {
    await AsyncStorage.setItem('user_token', token);
    this.token = token;
  }

  async getToken() {
    if (this.token) {
      return new Promise((resolve) => resolve(this.token));
    }
    let value = await AsyncStorage.getItem('user_token');
    this.token = value;
    return value;
  }

  async setUser(user) {
    await AsyncStorage.setItem('user_info', JSON.stringify(user));
    this.user = user;
  }

  async getUser() {
    if (this.user) {
      return new Promise((resolve) => resolve(this.user));
    }
    let value = JSON.parse(await AsyncStorage.getItem('user_info'));
    this.user = value;
    return value;
  }

  async getLoginPassword() {
    return AsyncStorage.getItem('login_password');
  }

  async setLoginPassword(password) {
    return AsyncStorage.setItem('login_password', password);
  }

  async getUpdateVersion() {
    return JSON.parse(await AsyncStorage.getItem('update_version'));
  }

  async setUpdateVersion(version) {
    return AsyncStorage.setItem('update_version', JSON.stringify(version));
  }

  async setDraft(content) {
      return AsyncStorage.setItem('draft', JSON.stringify(content));
  }

  async getDraft() {
    return JSON.parse(await AsyncStorage.getItem('draft'));
  }

  async setTempDraft(content) {
    return AsyncStorage.setItem('temp_draft', JSON.stringify(content));
  }

  async getTempDraft() {
    return JSON.parse(await AsyncStorage.getItem('temp_draft'));
  }

  async setSetting(name, val) {
    let settings = await this.getSettings();
    if (!settings) {
      settings = {}
    }
    settings[name] = val;
    return AsyncStorage.setItem('setting', JSON.stringify(settings));
  }

  async getSetting(name) {
    const settings = await this.getSettings();
    return settings ? (settings[name]) : null;
  }

  async getSettings() {
    const str = await AsyncStorage.getItem('setting');
    const settings = str && str.length > 0 ? JSON.parse(str) : { };
    if (settings['pushMessage'] === undefined) {
      settings['pushMessage'] = true;
    }
    return settings;
  }

  async getWriteNotificationTime() {
    let v = await this.getSetting('writeNotificationTime');
    if (!v) {
      v = {
        hours: 21, min: 0
      };
    }
    return v;
  }

  async setWriteNotificationTime(set) {
    return this.setSetting('writeNotificationTime', set);
  }
}

export default new TokenManager()
