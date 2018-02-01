import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DiaryDetail from "./pages/DiaryDetail";
import PhotoPage from "./pages/PhotoPage";
import UserPage from "./pages/UserPage";
import NotificationPage from "./pages/NotificationPage";
import FollowDiaryPage from "./pages/FollowDiaryPage";
import WritePage from "./pages/WritePage";
import {View} from "react-native";

/**
 * @return {null}
 */
function WriteTab(props) {
    let navigator = props.navigator;
    navigator.setOnNavigatorEvent(event => {
        console.log('111111111111', event);
        if (event.selectedTabIndex === 2) {
            navigator.showModal({
                screen: 'Write',
                title: "写日记",
                // overrideTabPress: true
            });

            let tabIndexToSelect = !event.unselectedTabIndex || event.unselectedTabIndex === 2 ? 0 : event.unselectedTabIndex;

            navigator.switchToTab({
                tabIndex: tabIndexToSelect
            });
        }
    });
    return <View style={{backgroundColor: 'transparent'}} />;
}

WriteTab.navigatorStyle = {
    tabBarHidden: true,
    navBarHidden: true,
};

export function registerScreens() {
    Navigation.registerComponent('Home', () => HomePage);
    Navigation.registerComponent('Follow', () => FollowDiaryPage);
    Navigation.registerComponent('Login', () => LoginPage);
    Navigation.registerComponent('DiaryDetail', () => DiaryDetail);
    Navigation.registerComponent('Photo', () => PhotoPage);
    Navigation.registerComponent('User', () => UserPage);
    Navigation.registerComponent('Notification', () => NotificationPage);
    Navigation.registerComponent('Write', () => WritePage);
    Navigation.registerComponent('WriteTab', () => WriteTab);
}