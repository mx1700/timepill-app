/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {registerScreens} from "./screens";
import {Navigation} from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import {colors} from "./Styles";
import {Platform, StatusBar} from 'react-native'

registerScreens();

async function appStart() {
    let [
        homeIcon, homeSelectedIcon,
        followIcon, followSelectedIcon,
        writeIcon, writeSelectedIcon,
        tipIcon, tipSelectedIcon,
        myIcon, mySelectIcon,
    ] = await Promise.all([
        Icon.getImageSource('ios-home-outline', 26), Icon.getImageSource('ios-home', 26),
        Icon.getImageSource('ios-heart-outline', 26), Icon.getImageSource('ios-heart', 26),
        Icon.getImageSource('ios-create-outline', 26), Icon.getImageSource('ios-create', 26),
        Icon.getImageSource('ios-notifications-outline', 26), Icon.getImageSource('ios-notifications', 26),
        Icon.getImageSource('ios-contact-outline', 26), Icon.getImageSource('ios-contact', 26),
    ]);

    Navigation.startTabBasedApp({
        tabs: [
            {
                label: '首页',
                screen: 'Home',
                icon: homeIcon,
                selectedIcon: homeSelectedIcon, // iOS only
                title: '首页'
            },
            {
                label: '关注',
                screen: 'Follow',
                icon: followIcon,
                selectedIcon: followSelectedIcon, // iOS only
                title: '关注'
            },
            {
                label: '写日记',
                screen: 'Write',
                icon: writeIcon,
                selectedIcon: writeSelectedIcon, // iOS only
                title: '写日记'
            },
            {
                label: '提醒',
                screen: 'Notification',
                icon: tipIcon,
                selectedIcon: tipSelectedIcon, // iOS only
                title: '提醒'
            },
            {
                label: '我的',
                screen: 'User',
                icon: myIcon,
                selectedIcon: mySelectIcon, // iOS only
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
}

export default () => {
    appStart();
}