import React, { Component } from 'react';
import { View } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation';
import HomePage from './HomePage';
import FollowDiaryPage from './FollowDiaryPage';
import Ionicons from 'react-native-vector-icons/Ionicons.js';

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
    tabBarOptions: {
        // activeTintColor: '#e91e63',
    },
    lazy: true,
});
export default RootPage