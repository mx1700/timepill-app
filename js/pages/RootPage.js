import React, { Component } from 'react';
import {Platform, View} from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation';
import HomePage from './HomePage';
import FollowDiaryPage from './FollowDiaryPage';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import {colors} from "../Styles";

HomePage.navigationOptions = {
    tabBarLabel: '首页',
    headerTitle: '首页',
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
    // header: null,
};

FollowDiaryPage.navigationOptions = {
    tabBarLabel: '关注',
    headerTitle: '关注日记',
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-heart' : 'ios-heart-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
    // header: null,
};

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
    indicatorStyle: {
        backgroundColor: 'transparent'
    },
    tabStyle: {
        backgroundColor: '#FFFFFF'
    },
    style: {
        backgroundColor: '#FFFFFF'
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