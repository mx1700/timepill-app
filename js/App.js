/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {registerScreens} from "./screens";
import {Navigation, NativeEventsReceiver, ScreenVisibilityListener} from 'react-native-navigation';
import {colors} from "./Styles";
import {Platform, StatusBar, Alert} from 'react-native'
import LocalIcon from "./common/LocalIcons";
import { loadIcon } from './common/LocalIcons';
import * as Api from './Api'
import Token from './TokenManager'
import { Answers, Crashlytics } from 'react-native-fabric';

registerScreens();

function registerScreenVisibilityListener() {
    new ScreenVisibilityListener({
        willAppear: ({screen}) => {
            Answers.logContentView('Route:' + screen, 'Route', screen);
        },
        // didAppear: ({screen, startTime, endTime, commandType}) => console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
        // willDisappear: ({screen}) => console.log(`Screen will disappear ${screen}`),
        // didDisappear: ({screen}) => console.log(`Screen disappeared ${screen}`)
    }).register();
}
registerScreenVisibilityListener();


async function appStart() {
    try {
        await loadIcon();
    } catch (err) {
        Alert.alert("loadIcon err: " + err.toString())
    }
    //TODO:Fabric 初始化
    //TODO:UserIntro 刷新用户信息
    //TODO:关注自己的问题

    let token = null;
    try {
        token = await Token.getToken();
    } catch(err) {
        console.error(err)
    }
    if (!token) {
        await startLoginPage();
        return;
    }

    const password = await Api.getLoginPassword();
    if (password) {
        await startPasswordPage();
        return;
    }

    await startTabPage();
}

export async function startLoginPage() {
    await Navigation.startSingleScreenApp({
        screen: {
            screen: 'Login',
            title: '登录',
        },
        appStyle: {
            navBarTranslucent: false,
            drawUnderStatusBar: false,
            statusBarTextColorScheme: 'dark',
            keepStyleAcrossPush: false,     //iOS
            navBarBackgroundColor: colors.navBackground,

            //android only
            navigationBarColor: '#FFF',
            statusBarColor: colors.navBackground,
            orientation: 'portrait',
        }
    });
}

export async function startPasswordPage() {
    await Navigation.startSingleScreenApp({
        screen: {
            screen: 'Password',
            title: '胶囊日记',
        },
        passProps: {
            type: 'login'
        },
        appStyle: {
            navBarTranslucent: false,
            drawUnderStatusBar: false,
            statusBarTextColorScheme: 'dark',
            keepStyleAcrossPush: false,     //iOS
            navBarBackgroundColor: colors.navBackground,

            //android only
            navigationBarColor: '#FFF',
            statusBarColor: colors.navBackground,
            orientation: 'portrait',
        }
    });
}

export async function startTabPage() {

    const splash = await Api.getSplashByStore();

    let insets = { // add this to change icon position (optional, iOS only).
        top: 6, // optional, default is 0.
        left: 0, // optional, default is 0.
        bottom: -6, // optional, default is 0.
        right: 0 // optional, default is 0.
    };

    await Navigation.startTabBasedApp({
        tabs: [
            {
                // label: '首页',
                screen: 'Home',
                icon: LocalIcon.homeIcon,
                selectedIcon: LocalIcon.homeSelectedIcon, // iOS only
                title: '首页',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                },
                passProps: {
                    splash: splash
                }
            },
            {
                // label: '关注',
                screen: 'Follow',
                icon: LocalIcon.followIcon,
                selectedIcon: LocalIcon.followSelectedIcon, // iOS only
                title: '关注',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                }
            },
            {
                // label: '写日记',
                screen: 'Write',
                icon: LocalIcon.writeIcon,
                selectedIcon: LocalIcon.writeSelectedIcon, // iOS only
                title: '写日记',
                iconInsets: insets,
                overrideBackPress: true,
                navigatorStyle: {
                    tabBarHidden: true,
                },
                passProps: {
                    tabOpen: true,
                }
            },
            {
                // label: '提醒',
                screen: 'Notification',
                icon: LocalIcon.tipIcon,
                selectedIcon: LocalIcon.tipSelectedIcon, // iOS only
                title: '提醒',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                }
            },
            {
                // label: '我的',
                screen: 'User',
                icon: LocalIcon.myIcon,
                selectedIcon: LocalIcon.mySelectIcon, // iOS only
                title: '我的',
                iconInsets: insets,
                navigatorStyle: {
                    tabBarHidden: false,
                },
                passProps: {
                    isMyself: true,
                    tabOpen: true,
                }
            },
        ],
        tabsStyle: {
            tabBarHidden: true,
            // tabBarButtonColor: '#abc',   //iOS
            tabBarSelectedButtonColor: colors.primary,   //iOS

            navBarTranslucent: false,
            drawUnderNavBar: true,

            initialTabIndex: 0,
        },
        appStyle: {
            tabBarHidden: true,
            // hideBackButtonTitle: true,
            // forceTitlesDisplay: true,
            tabBarBackgroundColor: colors.navBackground,
            tabBarButtonColor: '#999',   //android
            tabBarSelectedButtonColor: colors.primary,   //android

            navBarTranslucent: false,
            statusBarTextColorScheme: 'dark',
            keepStyleAcrossPush: false,     //iOS
            navBarBackgroundColor: colors.navBackground,
            // drawUnderNavBar: true,
            // topBarElevationShadowEnabled: false,

            //android only
            navigationBarColor: colors.navBackground,
            statusBarColor: colors.navBackground,
            // navBarHeight: 56,
            // navBarNoBorder: false,
            drawUnderStatusBar: false,
            topBarBorderColor: '#ddd', // Optional, set a flat border under the TopBar.
            orientation: 'portrait',
            initialTabIndex: 0,
        },
        animationType: 'fade'
    });

    //load user
    try {
        const user = await Api.getSelfInfoByStore();
        if (user && user.id) {
            Crashlytics.setUserIdentifier(user.id.toString());
            Crashlytics.setUserName(user.name);
        }
    } catch (err) {
        console.error(err);
    }

}

export default () => {
    appStart().done();
}