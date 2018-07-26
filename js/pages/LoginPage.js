import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableOpacity,
    Keyboard,
    Animated,
    LayoutAnimation,
    InteractionManager,
    Alert, StatusBar, DeviceEventEmitter, Linking,
} from 'react-native';
import * as Api from '../Api'
import { colors } from "../Styles";
import TPButton from '../components/TPButton';
import Toast from 'react-native-root-toast';
import {FormInput} from "react-native-elements";
import Events from "../Events";
import {startTabPage} from "../App";
import { Answers } from 'react-native-fabric';

export default class LoginPage extends Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    static pageLogin = 1;
    static pageRegisterMobile = 2;
    static pageRegisterEmail = 3;

    constructor() {
        super();
        this.state = ({
            username: '',
            password: '',

            nickname: '',   //注册

            email: '',      //注册-邮箱

            mobile: '',     //注册-手机
            code: '',       //注册-手机验证码

            loading: false,
            page: LoginPage.pageLogin,
            paddingAnim: new Animated.Value(100)
        });
    }

    showKeyboard = false;

    componentWillMount () {
        this.keyboardDidShowListener =
            Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener =
            Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.showKeyboard = true;
        this.showAnim = Animated.timing(
            this.state.paddingAnim,
            { toValue: 55, duration: 250 }
        );
        this.showAnim.start();
    };

    _keyboardDidHide = () => {
        this.showKeyboard = false;
        InteractionManager.runAfterInteractions(() => {
            if (!this.showKeyboard) {
                this.hideAnim = Animated.timing(
                    this.state.paddingAnim,
                    {toValue: 100, duration: 250 }
                );
                this.hideAnim.start();
            }
        });
    };


    async _click() {
        if (this.state.page === LoginPage.pageLogin) {
            this.login();
        } else if (this.state.page === LoginPage.pageRegisterMobile) {
            this.registerMobile();
        }
    }

    async login() {
        if (this.state.username.length === 0) {
            Toast.show("请输入邮箱/手机", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }
        if (this.state.password.length === 0) {
            Toast.show("请输入密码", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        let result;
        this.setState({loading: true});
        try {
            result = await Api.login(this.state.username, this.state.password);
        } catch (err) {
            console.log(err);
            Answers.logCustom('LoginError', {message: err.message});
        }

        this.setState({loading: false});

        setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                if (result) {
                    Answers.logLogin('Email', true);
                    DeviceEventEmitter.emit(Events.login, { user: result });
                    startTabPage().done();
                } else {
                    Answers.logLogin('Email', false);
                    Alert.alert(
                        '账号或密码不正确',
                        '',
                        [
                            {text: '确定', onPress: () => {}},
                        ],
                        { cancelable: false }
                    )
                }
            })
        }, 500);
    }

    async registerMobile() {
        if (this.state.nickname.length === 0) {
            Toast.show("请输入名字", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        if (this.state.mobile.length === 0) {
            Toast.show("请输入手机", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        if (this.state.code.length === 0) {
            Toast.show("请输入验证码", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        if (this.state.password.length === 0) {
            Toast.show("请输入密码", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        let result;
        let errMsg;
        this.setState({loading: true});
        try {
            result = await Api.mobileRegister(this.state.nickname, this.state.mobile, this.state.password, this.state.code)
        } catch (err) {
            Answers.logCustom('RegisterError', { type: 'mobile', message: err.message });
            errMsg = err.message;
        }

        this.setState({loading: false});

        setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                if (result) {
                    Answers.logSignUp('Email', true);
                    DeviceEventEmitter.emit(Events.login, {user: result});
                    startTabPage().done();
                } else {
                    Answers.logSignUp('Email', false);
                    Answers.logCustom('RegisterError', {message: errMsg});
                    Alert.alert(
                        errMsg ? errMsg : "注册失败",
                        '',
                        [{text: '确定', onPress: () => {}}],
                        {cancelable: false}
                    )
                }
            });
        }, 500);
    }

    async registerEmail() {
        if (this.state.nickname.length === 0) {
            Toast.show("请输入名字", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }
        if (this.state.username.length === 0) {
            Toast.show("请输入邮箱", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        if (this.state.password.length === 0) {
            Toast.show("请输入密码", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        let result;
        let errMsg;
        this.setState({loading: true});
        try {
            result = await Api.register(this.state.nickname, this.state.username, this.state.password);
        } catch (err) {
            Answers.logCustom('RegisterError', {message: err.message});
            errMsg = err.message;
        }

        this.setState({loading: false});

        setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                if (result) {
                    Answers.logSignUp('Email', true);
                    DeviceEventEmitter.emit(Events.login, {user: result});
                    startTabPage().done();
                } else {
                    Answers.logSignUp('Email', false);
                    Answers.logCustom('RegisterError', {message: errMsg});
                    Alert.alert(
                        errMsg ? errMsg : "注册失败",
                        '',
                        [{text: '确定', onPress: () => {}}],
                        {cancelable: false}
                    )
                }
            });
        }, 500);
    }

    togglePage() {
        LayoutAnimation.easeInEaseOut();
        let current = this.state.page;
        let next = null;
        if (current === LoginPage.pageLogin) {
            next = LoginPage.pageRegisterMobile;
        } else {
            next = LoginPage.pageLogin;
        }
        this.setState({
            page: next
        });
    }

    toWeb() {
        Linking.openURL("https://timepill.net/home/forgot_password");
    }

    sendRegisterVerificationCode = () => {
        if (this.state.mobile.length === 0) {
            Toast.show("请输入手机", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        (async () => {
            try {
                await Api.sendRegisterVerificationCode(this.state.mobile);
            } catch(e) {
                Toast.show("验证码发送失败：" + e.message, {
                    duration: 2500,
                    position: -50,
                    shadow: false,
                    hideOnPress: true,
                });
            }
            Toast.show("验证码已发送", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
        })();
    };

    render() {

        let content = null;
        console.log("page!!!", this.state.page);
        if (this.state.page === LoginPage.pageLogin) {
            console.log('pageLogin');
            content = this.renderLogin();
        } else if (this.state.page === LoginPage.pageRegisterMobile) {
            console.log('pageRegisterMobile');
            content = this.renderMobileRegister();
        } else {

        }

        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Modal
                    visible={this.state.loading}
                    onRequestClose={() => {}}
                    transparent={true}>
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.8)"
                    }}>
                        <ActivityIndicator animating={true} color={colors.primary} size={Platform.OS === 'android' ? 'large' : 'small'}/>
                    </View>
                </Modal>
                <Animated.View style={{flex: 1, paddingTop: this.state.paddingAnim, paddingHorizontal: 15}}>
                    <Text style={{fontSize: 26, paddingBottom: 35, color: '#222', textAlign: 'center'}}>
                        {this.state.page === this.pageLogin ? '欢迎来到胶囊日记' : '注册胶囊日记账号'}
                    </Text>

                    {content}

                    <TPButton
                        title={this.state.page === LoginPage.pageLogin ? "登录" : "注册"}
                        onPress={this._click.bind(this)}
                        type="bordered"
                        style={{ }}/>

                    <View style={{flexDirection: 'row', justifyContent: "space-between", paddingTop: 22, paddingHorizontal: 5}}>
                        <TouchableOpacity onPress={this.togglePage.bind(this)}>
                            <Text style={{fontSize: 14, color: colors.primary, padding: 10}}>
                                {this.state.page === LoginPage.pageLogin ? '没有账号？注册一个' : '已有账号？马上登录'}
                            </Text>
                        </TouchableOpacity>
                        {this.state.page === LoginPage.pageLogin && (<TouchableOpacity onPress={this.toWeb.bind(this)}>
                            <Text style={{fontSize: 14, color: colors.primary, padding: 10}}>
                                忘记密码？
                            </Text>
                        </TouchableOpacity>)}
                    </View>

                </Animated.View>
            </View>
        );
    }

    renderLogin() {
        return (
            <View style={styles.inputBox}>
                <FormInput
                    ref="inputEmail"
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    onChangeText={(text) => this.setState({username: text})}
                    value={this.state.username}
                    onSubmitEditing={() => this.refs.inputPw.focus()}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderTextColor={colors.inactiveText}
                    placeholder="邮箱/手机"/>

                <FormInput
                    ref="inputPw"
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    onSubmitEditing={this._click.bind(this)}
                    autoCorrect={false}
                    placeholder="登录密码"
                    placeholderTextColor={colors.inactiveText}
                    secureTextEntry={true}
                    returnKeyType="done"
                    selectTextOnFocus={true}/>
            </View>
        );
    }

    renderMobileRegister() {
        return (
            <View style={styles.inputBox}>
                <FormInput
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    onChangeText={(text) => this.setState({nickname: text})}
                    value={this.state.nickname}
                    onSubmitEditing={() => this.refs.inputMobile.focus()}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderTextColor={colors.inactiveText}
                    placeholder="名字"/>

                <View style={{flexDirection:"row"}}>
                    <FormInput
                        ref="inputMobile"
                        containerStyle={[styles.input, {flex: 1}]}
                        underlineColorAndroid="transparent"
                        selectionColor={colors.primary}
                        onChangeText={(text) => this.setState({mobile: text})}
                        value={this.state.mobile}
                        onSubmitEditing={() => this.refs.inputCode.focus()}
                        keyboardType="phone-pad"
                        autoCorrect={false}
                        autoFocus={false}
                        autoCapitalize="none"
                        returnKeyType="next"
                        placeholderTextColor={colors.inactiveText}
                        placeholder="手机号"/>
                    <TPButton title={"发送验证码"}
                              large={false}
                              style={{marginBottom: 5, height: 10}}
                              onPress={this.sendRegisterVerificationCode}
                    />
                </View>
                <FormInput
                    ref="inputCode"
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    onChangeText={(text) => this.setState({code: text})}
                    value={this.state.code}
                    onSubmitEditing={() => this.refs.inputPw.focus()}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderTextColor={colors.inactiveText}
                    placeholder="验证码"/>

                <FormInput
                    ref="inputPw"
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    onSubmitEditing={this._click.bind(this)}
                    autoCorrect={false}
                    placeholder="登录密码"
                    placeholderTextColor={colors.inactiveText}
                    secureTextEntry={true}
                    returnKeyType="done"
                    selectTextOnFocus={true}/>

            </View>
        );
    }

    renderEmailRegister() {

    }
}

const styles = StyleSheet.create({
    inputBox: {
        paddingBottom: 20,
    },
    line: {
        borderColor: '#ccc',
        borderTopWidth: StyleSheet.hairlineWidth,
        marginHorizontal:10,
    },
    input: {
        marginBottom: 5,
        borderColor: '#ccc',
        borderBottomWidth: 1,
    },
});