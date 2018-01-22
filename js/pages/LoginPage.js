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
    ScrollView,
    Keyboard,
    Animated,
    LayoutAnimation,
    InteractionManager,
} from 'react-native';
import * as Api from '../Api'
import { colors } from "../Styles";
import TPButton from '../components/Button';
// import TPButton from 'TPButton'
// import HomePage from './HomePage'
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';

// var Fabric = require('react-native-fabric');
// var { Answers } = Fabric;

export default class LoginPage extends Component {

    constructor() {
        super();
        this.state = ({
            nickname: '',
            username: '',
            password: '',
            loading: false,
            isLoginPage: true,
            paddingAnim: new Animated.Value(100)
        });
    }

    showKeyboard = false;

    componentWillMount () {
        this.keyboardDidShowListener =
            Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
        this.keyboardDidHideListener =
            Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.showKeyboard = true;
        // if (this.hideAnim) this.hideAnim.stop();
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
                // if (this.showAnim) this.showAnim.stop();
                this.hideAnim = Animated.timing(
                    this.state.paddingAnim,
                    {toValue: 100, duration: 250 }
                );
                this.hideAnim.start();
            }
        });
        // setTimeout(() => {
        //
        // }, 0);

    };

    _nicknameSubmit() {
        this.refs.inputEmail.focus();
    }

    _usernameSubmit() {
        this.refs.inputPw.focus();
    }

    _passwordSubmit() {
        this._click()
    }

    async _click() {
        //邮箱@符号转换
        if(!this.state.isLoginPage && this.state.nickname.length === 0) {
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

        if(this.state.isLoginPage) {
            this.login()
        } else {
            this.register()
        }
    }

    async login() {
        let result;
        this.setState({loading: true});
        try {
            result = await Api.login(this.state.username, this.state.password);
        } catch (err) {
            // Answers.logCustom('LoginError', {message: err.message});
        }
        this.setState({loading: false});
        if (result) {
            // Answers.logLogin('Email', true);
            this.props.navigator.resetTo({
                name: 'HomePage',
                component: HomePage
            });
        } else {
            // Answers.logLogin('Email', false);
            // Answers.logCustom('LoginError', {message: 'Password error'});
            Toast.show("邮箱或密码不正确", {
                duration: 2000,
                position: 195 - TIP_TOP,
                shadow: false,
                hideOnPress: true,
            });
        }
    }

    async register() {
        let result;
        let errMsg;
        this.setState({loading: true});
        try {
            result = await Api.register(this.state.nickname, this.state.username, this.state.password);
        } catch (err) {
            // Answers.logCustom('RegisterError', {message: err.message});
            errMsg = err.message;
        }
        this.setState({loading: false});
        if (result) {
            //Answers.logLogin('Email', true);
            this.props.navigator.resetTo({
                name: 'HomePage',
                component: HomePage
            });
        } else {
            //Answers.logLogin('Email', false);
            // Answers.logCustom('RegisterError', {message: errMsg});
            Toast.show(errMsg ? errMsg : "注册失败", {
                duration: 2500,
                position: -50,
                shadow: false,
                hideOnPress: true,
            });
        }
    }

    toRegister() {
        LayoutAnimation.easeInEaseOut();
         this.setState({
             isLoginPage: !this.state.isLoginPage
         });
    }

    render() {
        const nicknameInput = !this.state.isLoginPage ? (
            <View style={{flexDirection: 'row'}}>
                <View style={styles.icon_box}>
                    <Icon name="ios-person-outline" size={22} color={colors.inactiveText}
                          style={{paddingTop: 2}}/>
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({nickname: text})}
                    value={this.state.nickname}
                    onSubmitEditing={this._nicknameSubmit.bind(this)}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoFocus={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholderTextColor={colors.inactiveText}
                    placeholder="名字"/>
            </View>
        ) : null;
        const nicknameInputLine = !this.state.isLoginPage ? (<View style={styles.line} />) : null;
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Animated.View style={{flex: 1, paddingTop: this.state.paddingAnim, paddingHorizontal: 15}}>
                    <Modal
                        visible={this.state.loading}
                        transparent={true}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)"
                        }}>
                            <ActivityIndicator animating={true} color={colors.primary}/>
                        </View>
                    </Modal>
                    <Text style={{fontSize: 26, paddingBottom: 35, color: '#222', textAlign: 'center'}}>
                        {/*{this.state.isLoginPage ? '欢迎来到胶囊日记' : '注册胶囊日记账号'}*/}
                    </Text>
                    <View style={styles.inputBox}>
                        {nicknameInput}
                        {nicknameInputLine}
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.icon_box}>
                                <Icon name="ios-mail-outline" size={20} color={colors.inactiveText}
                                      style={{paddingTop: 2}}/>
                            </View>
                            <TextInput
                                ref="inputEmail"
                                style={styles.input}
                                onChangeText={(text) => this.setState({username: text})}
                                value={this.state.username}
                                onSubmitEditing={this._usernameSubmit.bind(this)}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoFocus={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                                placeholderTextColor={colors.inactiveText}
                                placeholder="账号邮箱"/>
                        </View>
                        <View style={styles.line} />
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.icon_box}>
                                <Icon name="ios-medical-outline" size={18} color={colors.inactiveText}
                                      style={{paddingTop: 1}}/>
                            </View>
                            <TextInput
                                ref="inputPw"
                                style={styles.input}
                                onChangeText={(text) => this.setState({password: text})}
                                value={this.state.password}
                                onSubmitEditing={this._passwordSubmit.bind(this)}
                                autoCorrect={false}
                                placeholder="登录密码"
                                placeholderTextColor={colors.inactiveText}
                                secureTextEntry={true}
                                returnKeyType="done"
                                selectTextOnFocus={true}/>
                        </View>
                        <View style={styles.line} />
                    </View>

                    <TPButton
                        title={this.state.isLoginPage ? "登录" : "注册"}
                        onPress={this._passwordSubmit.bind(this)}
                        type="bordered"
                        style={{marginTop: 25, marginLeft: -5, marginRight: -5}}/>

                    <View style={{flex: 1, alignItems: "center", paddingTop: 22}}>
                        <TouchableOpacity onPress={this.toRegister.bind(this)}>
                            <Text style={{fontSize: 13, color: colors.primary, padding: 10}}>
                                {this.state.isLoginPage ? '没有账号？注册一个' : '已有账号？马上登录'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputBox: {
        // borderColor: '#ccc',
        // borderWidth: 1,
        // borderRadius: 10,
    },
    line: {
        borderColor: '#ccc',
        borderTopWidth: 1,
        marginHorizontal:10,
    },
    input: {
        flex: 1,
        height: 45,
        padding: 10,
        paddingLeft: 0,
        fontSize: 13,
    },
    icon_box: {
        width: 42,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    }
});