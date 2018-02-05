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
    Alert, StatusBar, DeviceEventEmitter,
} from 'react-native';
import * as Api from '../Api'
import { colors } from "../Styles";
import TPButton from '../components/TPButton';
import { NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import {FormInput} from "react-native-elements";
import Events from "../Events";
import {Navigation} from "react-native-navigation";

// var Fabric = require('react-native-fabric');
// var { Answers } = Fabric;

export default class LoginPage extends Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

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
        console.log("componentWillMount");
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
        console.log("_keyboardDidShow");
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
            console.log(err);
            // Answers.logCustom('LoginError', {message: err.message});
        }
        console.log("login:", result);
        this.setState({loading: false});
        setTimeout(() => {
            if (result) {
                DeviceEventEmitter.emit(Events.login, { user: result });
                Navigation.dismissAllModals();
            } else {
                Alert.alert(
                    '账号或密码不正确',
                    '',
                    [
                        {text: '确定', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                )
            }
        }, 1)
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
        setTimeout(() => {
            if (result) {
                //Answers.log注册('Email', true);
                DeviceEventEmitter.emit(Events.login, { user: result });
                Navigation.dismissAllModals();
            } else {
                //Answers.logLogin('Email', false);
                // Answers.logCustom('RegisterError', {message: errMsg});
                Alert.alert(
                    errMsg ? errMsg : "注册失败",
                    '',
                    [
                        {text: '确定', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                )
            }
        }, 1);
    }

    toRegister() {
        LayoutAnimation.easeInEaseOut();
         this.setState({
             isLoginPage: !this.state.isLoginPage
         });
    }

    render() {
        const nicknameInput = !this.state.isLoginPage ? (
                <FormInput
                    containerStyle={styles.input}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
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
        ) : null;
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <StatusBar
                    backgroundColor="#FFFFFF"
                    barStyle="dark-content"
                />
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
                        <ActivityIndicator animating={true} color={colors.primary} size="large"/>
                    </View>
                </Modal>
                <Animated.View style={{flex: 1, paddingTop: this.state.paddingAnim, paddingHorizontal: 15}}>
                    <Text style={{fontSize: 26, paddingBottom: 35, color: '#222', textAlign: 'center'}}>
                        {this.state.isLoginPage ? '欢迎来到胶囊日记' : '注册胶囊日记账号'}
                    </Text>
                    <View style={styles.inputBox}>
                        {nicknameInput}

                        <FormInput
                            ref="inputEmail"
                            containerStyle={styles.input}
                            underlineColorAndroid="transparent"
                            selectionColor={colors.primary}
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

                        <FormInput
                            ref="inputPw"
                            containerStyle={styles.input}
                            underlineColorAndroid="transparent"
                            selectionColor={colors.primary}
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

                    <TPButton
                        title={this.state.isLoginPage ? "登录" : "注册"}
                        onPress={this._passwordSubmit.bind(this)}
                        type="bordered"
                        style={{ }}/>

                    <View style={{flex: 1, alignItems: "center", paddingTop: 22}}>
                        <TouchableOpacity onPress={this.toRegister.bind(this)}>
                            <Text style={{fontSize: 14, color: colors.primary, padding: 10}}>
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