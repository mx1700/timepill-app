import React, { Component } from 'react';
import start from './js/App'
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';
import {Platform} from "react-native";

// if (Platform.OS === 'android') {
//     Navigation.isAppLaunched()
//         .then(appLaunched => {
//             if (appLaunched) {
//                 start();
//             }
//             new NativeEventsReceiver().appLaunched(start);
//         });
// } else {
//     start();
// }

start();
