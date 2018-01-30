import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";

export default class NotificationPage extends Component {
    static navigationOptions = navOption({
        tabBarLabel: '提醒',
        headerTitle: '提醒',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
                name={focused ? 'ios-notifications' : 'ios-notifications-outline'}
                size={26}
                style={{ color: tintColor }}
            />
        )
    });

    render() {
        return (
            <View>
                <ErrorView text={"Notification"} />
            </View>
        )
    }
}