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

registerScreens();

async function appStart() {

    await LocalIcon.aLoad();

    Navigation.startTabBasedApp({
        tabs: [
            {
                label: '首页',
                screen: 'Home',
                icon: LocalIcon.homeIcon,
                selectedIcon: LocalIcon.homeSelectedIcon, // iOS only
                title: '首页'
            },
            {
                label: '关注',
                screen: 'Follow',
                icon: LocalIcon.followIcon,
                selectedIcon: LocalIcon.followSelectedIcon, // iOS only
                title: '关注'
            },
            {
                label: '写日记',
                screen: 'Write',
                icon: LocalIcon.writeIcon,
                selectedIcon: LocalIcon.writeSelectedIcon, // iOS only
                title: '写日记'
            },
            {
                label: '提醒',
                screen: 'Notification',
                icon: LocalIcon.tipIcon,
                selectedIcon: LocalIcon.tipSelectedIcon, // iOS only
                title: '提醒'
            },
            {
                label: '我的',
                screen: 'User',
                icon: LocalIcon.myIcon,
                selectedIcon: LocalIcon.mySelectIcon, // iOS only
                title: '我的'
            },
        ],
        tabsStyle: {
            // tabBarHidden: true,
            tabBarSelectedButtonColor: colors.primary,   //iOS
            forceTitlesDisplay: false,
            navBarTranslucent: true,
            drawUnderNavBar: true,
        },
        appStyle: {
            // tabBarHidden: true,
            // hideBackButtonTitle: true,
            tabBarSelectedButtonColor: colors.primary,   //android
            forceTitlesDisplay: false,      //不起作用
            navBarTranslucent: Platform.OS === 'ios',
            // drawUnderNavBar: true,
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