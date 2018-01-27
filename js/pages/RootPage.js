import React, { Component } from 'react';
import {Platform, StyleSheet, View} from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation';
import HomePage from './HomePage';
import FollowDiaryPage from './FollowDiaryPage';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import {colors} from "../Styles";
import navOption from "../components/NavOption";


HomePage.navigationOptions = navOption({
    tabBarLabel: '首页',
    title:"首页",
    headerTitle: '',
    headerStyle: {
        // backgroundColor: '#FFF',
        // borderWidth:0,
        // borderBottomColor: 'transparent',
        // position: 'absolute',
        // backgroundColor: 'transparent',
        // zIndex: 100, top: 0, left: 0, right: 0
        backgroundColor: '#FFF',
        borderBottomColor: 'transparent',
        height: 0,
    },
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
});

FollowDiaryPage.navigationOptions = navOption({
    tabBarLabel: '关注',
    headerTitle: '',
    headerStyle: {
        // backgroundColor: '#FFF',
        // borderWidth:0,
        // borderBottomColor: 'transparent',
        // position: 'absolute',
        // backgroundColor: 'transparent',
        // zIndex: 100, top: 0, left: 0, right: 0
        backgroundColor: '#FFF',
        borderBottomColor: 'transparent',
        height: 0,
    },
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-heart' : 'ios-heart-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
});

WritePage = () => {
    return <View />
};

WritePage.navigationOptions = {
    tabBarLabel: '写日记',
    headerTitle: '写日记',
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-create' : 'ios-create-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
    tabBarOnPress: (nav) => {
        console.log(nav);
        //TODO:打开写日记
    }
    // header: null,
};

let tabBarOptions = Platform.OS === 'android' ? {
    showIcon: true,
    showLabel: false,
    activeTintColor: colors.primary,
    inactiveTintColor: colors.inactiveText,
    pressColor: colors.primary,
    indicatorStyle: {
        backgroundColor: 'transparent'
    },
    tabStyle: {
        backgroundColor: 'transparent'
    },
    style: {
        backgroundColor: colors.navBackground,
        elevation: 4,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#dddddd'
    }
} : {
    showIcon: true,
    showLabel: false,
};

RootPage = TabNavigator({
    Home: {
        screen: HomePage,
    },
    FollowDiary: {
        screen: FollowDiaryPage
    },
    Write: {
        screen: WritePage
    }
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: tabBarOptions,
    lazy: true,
});
export default RootPage