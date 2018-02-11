import React, { Component } from 'react';
import {Text, View, NativeAppEventEmitter, Platform} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";
import JPushModule from 'jpush-react-native';
import * as Api from "../Api";

export default class NotificationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'Notification'
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.initAndroid().done()
        } else {
            this.initIOS().done()
        }
    }

    async initAndroid() {
        let resultCode = await JPushModule.notifyJSDidLoad();
        console.log('JPushModule.notifyJSDidLoad:' + resultCode);

        if (resultCode !== 0) {
            return;
        }

        this.registerUser().done();

        JPushModule.addReceiveNotificationListener((map) => {
            console.log("alertContent: " + map.alertContent);
            console.log("extras: " + map.extras);

            this.setState({
                text: 'send:' + map.alertContent
            });
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        });

        JPushModule.addReceiveOpenNotificationListener((r) => {
            this.setState({
                text: 'click:' + r.alertContent
            });
            // JPushModule.jumpToPushActivity("Test");
            console.log('JPushModule.addReceiveOpenNotificationListener', r);
        });
    }

    async initIOS() {
        JPushModule.getRegistrationID((registrationId) => {
            console.log("Device register succeed, registrationId " + registrationId);
        });

        let subscription1 = NativeAppEventEmitter.addListener(
            'ReceiveNotification',
            (notification) => console.log('ReceiveNotification', notification)
        );

        let subscription2 = NativeAppEventEmitter.addListener(
            'OpenNotification',
            (notification) => console.log('OpenNotification', notification)
        );

        let subscription3 = NativeAppEventEmitter.addListener(
            'networkDidReceiveMessage',
            (message) => console.log('networkDidReceiveMessage', message)
        );
    }

    async registerUser() {
        const user = await Api.getSelfInfoByStore();
        const settings = await Api.getSettings();
        const push = settings['pushMessage'];
        const alias = push ? user.id.toString() : user.id.toString() + '_close';
        JPushModule.setAlias(alias, success => {
            console.log('JPushModule.setAlias ' + alias + '  ' + success);
        })
    }

    render() {
        return (
            <View>
                <ErrorView text={this.state.text}/>
            </View>
        )
    }
}