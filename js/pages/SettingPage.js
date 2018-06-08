import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ToolbarAndroid,
    Platform,
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    Linking,
    Switch, DeviceEventEmitter
} from 'react-native';
import * as Api from '../Api'
import Icon from 'react-native-vector-icons/Ionicons';
import JPushModule from 'jpush-react-native'
import {colors as TPColors} from "../Styles";
import {startLoginPage} from "../App";
import TokenManager from "../TokenManager";
import * as LocalPush from "../LocalPush";

export default class SettingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasUpdateNews: false,
            hasPassword: false,
            settings: {}
        };
    }

    onReadUpdateNews = () => {
        this.setState({
            hasUpdateNews: false
        })
    };

    onUpdateStartupPassword = () => {
        Api.getLoginPassword()
            .then((v) => this.setState({hasPassword: v != null && v.length > 0}));
    };

    componentDidMount() {
        this._loadUpdateState().done();
        this._loadSettings().done();
        this.onUpdateStartupPassword();

        this.onReadUpdateNewsListener = DeviceEventEmitter.addListener('onReadUpdateNews', this.onReadUpdateNews);
        this.onUpdateStartupPasswordListener = DeviceEventEmitter.addListener('onUpdateStartupPassword', this.onUpdateStartupPassword);
    }

    componentWillUnmount() {
        if (this.onReadUpdateNewsListener) {
            this.onReadUpdateNewsListener.remove()
        }
        if (this.onUpdateStartupPasswordListener) {
            this.onUpdateStartupPasswordListener.remove()
        }
    }

    logout() {
        Alert.alert('提示','确认退出登录?',[
            {text: '退出', style: 'destructive', onPress: () => {
                Api.logout().done();
                startLoginPage().done();
            }},
            {text: '取消', onPress: () => console.log('OK Pressed!')},
        ]);

    }

    async _loadSettings() {
        const settings = await Api.getSettings();
        this.setState({
            settings: settings
        })
    }

    async _loadUpdateState() {
        const hasNews = await Api.hasUnreadUpdateNews();
        if (!hasNews) return;

        this.setState({
            hasUpdateNews: hasNews
        });
    }

    changePassword = () => {
        this.props.navigator.push({
            screen: 'Password',
            title: '修改启动密码',
            passProps: {
                type: 'setting'
            }
        })
    };

    changePush = (val) => {
        let settings = this.state.settings;
        settings['pushMessage'] = val;
        this.setState({
            settings: settings
        });
        Api.getSelfInfoByStore()
            .then(user => {
                if (!user || !user.id) {
                    return;
                }
                const alias = val ? user.id.toString() : user.id.toString() + '_close';
                console.log(alias);
                JPushModule.setAlias(alias, (resultCode) => {
                    Api.setSetting('pushMessage', val).done();
                    console.log('setAlias ok ')
                }, (f) => {
                    console.log(f);   //Toast 提示
                    settings['pushMessage'] = !val;
                    this.setState({
                        settings: settings
                    });
                })
            })
            .catch(err => {
                console.log(err);   //Toast 提示
                settings['pushMessage'] = !val;
                this.setState({
                    settings: settings
                });
            })
    };

    changeWriteNotification = (val) => {
        let run = async () => {
            await TokenManager.setSetting('writeNotification', val);
            let settings = this.state.settings;
            settings['writeNotification'] = val;
            this.setState({
                settings: settings
            });
            LocalPush.register();
            //register
        };
        run().done();
        if (val) {
            this.props.navigator.push({
                screen: 'WriteNotification',
                title: '每日提醒时间设置',
            })
        }
    };

    render() {
        const badge = this.state.hasUpdateNews
            ? (
            <View style={styles.badge}>
                <Text style={styles.badge_text}>1</Text>
            </View>
            )
            : null;

        const appStoreLink = Platform.OS == 'ios' ? (
            <View>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() =>
                        Linking.openURL("https://itunes.apple.com/us/app/jiao-nang-ri-ji/id1142102323?l=zh&ls=1&mt=8")}
                >
                    <Text style={styles.title}>去 App Store 评价</Text>
                    <Icon name="ios-arrow-forward" style={styles.arrow} size={18}/>
                </TouchableOpacity>
                <View style={styles.line} />
            </View>
        ) : null;
        return (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
                <View style={styles.group}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.props.navigator.push({
                            screen: 'UserEdit',
                            title: '修改信息',
                        })}
                    >
                        <Text style={styles.title}>修改个人信息</Text>
                        <Icon name="ios-arrow-forward" style={styles.arrow} size={18} color='#0076FF'/>
                    </TouchableOpacity>
                    <View style={styles.line} />

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.props.navigator.push({
                            screen: 'FollowUsers',
                            title: '关注用户',
                        })}
                    >
                        <Text style={styles.title}>关注用户</Text>
                        <Icon name="ios-arrow-forward" style={styles.arrow} size={18} color='#0076FF'/>
                    </TouchableOpacity>
                    <View style={styles.line} />

                    <View style={styles.item}>
                        <Text style={styles.title}>启动密码</Text>
                        <Switch value={this.state.hasPassword}
                                onTintColor={Platform.OS === 'android' ? TPColors.textSelect : null}
                                thumbTintColor={Platform.OS === 'android' && this.state.hasPassword ? TPColors.light : null}
                                onValueChange={this.changePassword} />
                    </View>
                    <View style={styles.line} />

                    <View style={styles.item}>
                        <Text style={styles.title}>关注&回复提醒推送</Text>
                        <Switch value={this.state.settings['pushMessage']}
                                onTintColor={Platform.OS === 'android' ? TPColors.textSelect : null}
                                thumbTintColor={Platform.OS === 'android' && this.state.settings['pushMessage'] ? TPColors.light : null}
                                onValueChange={this.changePush} />
                    </View>
                    <View style={styles.line} />

                    <View style={styles.item}>
                        <Text style={styles.title}>每天写日记提醒</Text>
                        <Switch value={this.state.settings['writeNotification']}
                                onTintColor={Platform.OS === 'android' ? TPColors.textSelect : null}
                                thumbTintColor={Platform.OS === 'android' && this.state.settings['writeNotification'] ? TPColors.light : null}
                                onValueChange={this.changeWriteNotification} />
                    </View>

                </View>

                <View style={[styles.group]}>
                    {appStoreLink}
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            this.props.navigator.push({
                                screen: 'Feedback',
                                title: '意见反馈',
                            })
                        }>
                        <Text style={styles.title}>意见反馈</Text>
                        <Icon name="ios-arrow-forward" style={styles.arrow} size={18}/>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            this.props.navigator.push({
                                screen: 'About',
                                title: '关于',
                            })
                        }>
                        <Text style={styles.title}>关于</Text>
                        {badge}
                        <Icon name="ios-arrow-forward" style={styles.arrow} size={18}/>
                    </TouchableOpacity>
                </View>

                <View style={[styles.group, { marginTop: 45 }]}>
                    <TouchableOpacity onPress={this.logout.bind(this)} style={styles.item}>
                        <Text style={styles.button}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    group: {
        marginTop: 30,
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 45,
    },
    title: {
        fontSize: 16,
        color: '#222222',
        flex: 1,
    },
    line: {
        marginLeft: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc'
    },
    arrow: {
        paddingTop: 1,
        color: TPColors.inactiveText,
    },
    button: {
        flex: 1,
        textAlign: 'center',
        color: '#d9534f',
        fontSize: 16,
    },
    badge: {
        backgroundColor: 'red',
        paddingHorizontal:8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 10
    },
    badge_text: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Arial'
    }
});