import React, { Component } from 'react';
import start from './js/App'
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';
Navigation.isAppLaunched()
    .then(appLaunched => {
        if (appLaunched) {
            start();
        }
        new NativeEventsReceiver().appLaunched(start);
    });
