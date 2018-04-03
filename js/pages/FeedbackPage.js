import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ToolbarAndroid,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Image,
    CameraRoll,
    ActionSheetIOS, DeviceEventEmitter,
} from 'react-native';
import * as Api from '../Api'
import Events from "../Events";
import {colors as TPColors} from "../Styles";

export default class FeedbackPage extends Component {
    render() {
        return (
            <View>
                <Text>Hello world.</Text>
            </View>
        );
    }
}