import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";

export default class NotificationPage extends Component {
    render() {
        return (
            <View>
                <ErrorView text={"Notification"} />
            </View>
        )
    }
}