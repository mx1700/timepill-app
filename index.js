import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './js/App';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './js/screens';
import Icon from 'react-native-vector-icons/Ionicons.js';
import {colors} from "./js/Styles";

// AppRegistry.registerComponent('timepill', () => App);


registerScreens();

async function app() {
    let [homeIcon, followIcon] = await Promise.all([
        Icon.getImageSource('ios-home-outline', 26),
        Icon.getImageSource('ios-heart-outline', 26),
    ]);

    console.log(homeIcon);


    Navigation.startTabBasedApp({
        tabs: [
            {
                label: 'One',
                screen: 'home', // this is a registered name for a screen
                icon: homeIcon,
                // selectedIcon: require('../img/one_selected.png'), // iOS only
                title: 'Screen One'
            },
            {
                label: 'Two',
                screen: 'login',
                icon: followIcon,
                // selectedIcon: require('../img/two_selected.png'), // iOS only
                title: 'Screen Two'
            }
        ]
    });
}

app();