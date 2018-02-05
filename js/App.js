/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {registerScreens} from "./screens";
import {Navigation, ScreenVisibilityListener} from "react-native-navigation";
import {colors} from "./Styles";
import {Platform, StatusBar} from 'react-native'
import LocalIcon from "./common/LocalIcons";
import { loadIcon } from './common/LocalIcons';

registerScreens();

async function appStart() {

    await loadIcon();

    let insets = { // add this to change icon position (optional, iOS only).
        top: 6, // optional, default is 0.
        left: 0, // optional, default is 0.
        bottom: -6, // optional, default is 0.
        right: 0 // optional, default is 0.
    };

    Navigation.startTabBasedApp({
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
                }
            },
        ],
        tabsStyle: {
            tabBarHidden: true,
            tabBarButtonColor: '#bcd',
            tabBarSelectedButtonColor: colors.primary,   //iOS

            navBarTranslucent: true,
            drawUnderNavBar: true,

            initialTabIndex: 4,
        },
        appStyle: {
            tabBarHidden: true,
            // hideBackButtonTitle: true,
            // forceTitlesDisplay: true,
            tabBarButtonColor: '#bcd',   //android
            tabBarSelectedButtonColor: colors.primary,   //android

            navBarTranslucent: Platform.OS === 'ios',
            statusBarTextColorScheme: 'dark',
            keepStyleAcrossPush: false,     //iOS
            // drawUnderNavBar: true,
            // topBarElevationShadowEnabled: false,

            //android only
            navigationBarColor: '#FFF',
            statusBarColor: '#FFF',
            navBarHeight: 52,
            // navBarNoBorder: false,
            topBarBorderColor: '#ddd', // Optional, set a flat border under the TopBar.

            initialTabIndex: 4,
        },
    });

    function registerScreenVisibilityListener() {
        new ScreenVisibilityListener({
            willAppear: ({screen}) => console.log(`Displaying screen ${screen}`),
            didAppear: ({screen, startTime, endTime, commandType}) => console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
            willDisappear: ({screen}) => console.log(`Screen will disappear ${screen}`),
            didDisappear: ({screen}) => console.log(`Screen disappeared ${screen}`)
        }).register();
    }
    registerScreenVisibilityListener();
}

export default () => {
    appStart();
}