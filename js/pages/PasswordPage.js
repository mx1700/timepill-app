import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    StatusBar, DeviceEventEmitter, TouchableOpacity,
} from 'react-native';
import HomePage from './HomePage'
import * as Api from '../Api'
import Toast from 'react-native-root-toast';
import PasswordInput from "../components/PasswordInput";
const dismissKeyboard = require('dismissKeyboard');
import PropTypes from 'prop-types';
import {colors as TPColors} from "../Styles";
import Events from "../Events";
import {startTabPage} from "../App";

export default class PasswordPage extends Component {
    static propTypes = {
        //login, setting
        type: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        console.log('props', props);
        if (this.props.type === 'setting') {
            this.state = {
                title: '请输入密码',
                password: null,
                step: 1,
                oldPassword: false,
            };
        } else {
            this.state = {
                title: '请输入密码',
                password: null,
                step: 1,
                oldPassword: false,
            };
        }
    }

    componentDidMount() {
        if (this.props.type === 'setting') {
            Api.getLoginPassword().then((pwd) => {
                if (pwd) {
                    this.setState({
                        title: '请输入密码',
                        password: null,
                        step: 0,
                        oldPassword: pwd,
                    });
                    this.props.navigator.setTitle({
                        title: "取消启动密码"
                    });
                } else {
                    this.setState({
                        title: '请输入新密码',
                        password: null,
                        step: 1,
                        oldPassword: null,
                    });
                    this.props.navigator.setTitle({
                        title: "设置启动密码"
                    });
                }

            })
        } else {
            Api.getLoginPassword().then((pwd) => {
                this.setState({
                    oldPassword: pwd
                });
            });
        }
    }

    _onEnd(password) {
        if (this.props.type === 'setting') {
            this._setting(password);
        } else if (this.props.type === 'login') {
            this._login(password);
        }
    }

    _login(password) {
        if (this.state.oldPassword === false) {
            Alert.alert('错误', '密码加载失败');
            return;
        }
        this.refs.input.clear();
        if (this.state.oldPassword === password) {
            startTabPage().done();
        } else {
            Alert.alert('失败', '密码错误');
        }
    }

    _setting(password) {
        setTimeout(() => {
            if (this && this.refs.input) {
                this.refs.input.clear();
            }
        }, 200);
        if (this.state.oldPassword === false) {
            Alert.alert('错误', '密码加载失败');
            return;
        }

        if (this.state.step === 0) { //取消密码
            if (this.state.oldPassword === password) {
                this._clearPassword();
            } else {
                Alert.alert('提示', '密码不正确');
            }
        } else if (this.state.step === 1) {
            this.setState({
                title: '请再次输入密码',
                password: password,
                step: 2
            });
        } else if (this.state.step === 2) {
            if (!password.match(/^\d+$/)) {
                Alert.alert('错误', '只能设置数字密码');
                this.setState({
                    title: '请输入新密码',
                    password: null,
                    step: 1
                });
                return;
            }
            if (this.state.password !== password) {
                Alert.alert('设置失败', '两次输入的密码不相同,请重新输入');
                this.setState({
                    title: '请输入新密码',
                    password: null,
                    step: 1
                });
                return;
            }
            Api.setLoginPassword(password).then(() => {
                dismissKeyboard();
                this.props.navigator.pop();
                DeviceEventEmitter.emit(Events.onUpdateStartupPassword);
                Toast.show("密码已设置", {
                    duration: 2000,
                    position: -80,
                    shadow: false,
                    hideOnPress: true,
                });
            }).catch(() => {
                Alert.alert('错误', '设置失败');
            })
        }
    }

    _clearPassword() {
        if (this.state.oldPassword === false) {
            Alert.alert('错误', '密码加载失败');
            return;
        }
        Api.setLoginPassword('').then(() => {
            dismissKeyboard();
            this.props.navigator.pop();
            DeviceEventEmitter.emit(Events.onUpdateStartupPassword);
            Toast.show("密码已清除", {
                duration: 2000,
                position: -80,
                shadow: false,
                hideOnPress: true,
            });
        }).catch(() => {
            Alert.alert('错误', '设置失败');
        })
    }

    toLogin = () => {
        this.props.navigator.push({
            screen: 'Login',
            title: '登录',
        });
    };

    render() {

        const tip = this.props.type === 'setting' && this.state.step !== 0
            ? (
                <Text style={{marginTop: 50, fontSize: 11, color: TPColors.inactiveText}}>提示: 从后台切切换前台时不需要输入密码</Text>
            ) : null;

        const resetPassword = this.props.type === 'setting' ? null : (
            <View style={{flex: 1, alignItems: "center", paddingTop: 22}}>
                <TouchableOpacity onPress={this.toLogin}>
                    <Text style={{fontSize: 14, color: TPColors.primary, padding: 10}}>
                        忘记密码？通过登录重设
                    </Text>
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
                <View style={{flex: 1, alignItems: 'center', marginTop: 60}}>
                    <Text style={{fontSize: 24}}>{this.state.title}</Text>
                    <PasswordInput ref="input" style={{marginTop: 50}} maxLength={4} onEnd={this._onEnd.bind(this)}/>
                    {tip}
                    {resetPassword}
                </View>
            </View>
        );
    }
}