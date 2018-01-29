/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import LoginPage from "./pages/LoginPage";
import RootPage from './pages/RootPage';
import navOption from "./components/NavOption";
import DiaryDetail from "./pages/DiaryDetail";
import PhotoPage from "./pages/PhotoPage";


const RootNavigator = StackNavigator({
    Root: {
        screen: RootPage
    },
    Login: {
        screen: LoginPage,
        navigationOptions: navOption({
            headerTitle: '登录',
            header: null,
        })
    },
    DiaryDetail: {
        screen: DiaryDetail,
        navigationOptions: navOption({
            headerTitle: '日记详情',
        })
    },
    Photo: {
        screen: PhotoPage
    }
}, {
    initialRouteName: "Root"
});

export default RootNavigator;



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: '#F5FCFF',
//       backgroundColor: '#FFFFFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
