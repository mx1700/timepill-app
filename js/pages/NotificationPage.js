import React, { Component } from 'react';
import {Text, View} from "react-native";
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
        JPushModule.notifyJSDidLoad((resultCode) => {
            console.log("JPushModule.notifyJSDidLoad", resultCode);
            if (resultCode === 0) {
                this.initPush().done()
            }
        });

    }

    async initPush() {
        JPushModule.addReceiveNotificationListener((map) => {
            console.log("alertContent: " + map.alertContent);
            console.log("extras: " + map.extras);

            this.setState({
                text: 'send:' + map.alertContent
            });
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        });
        JPushModule.getRegistrationID((registrationId) => {
            console.log("Device register succeed, registrationId " + registrationId);
        });
        this.registerUser().done();
        JPushModule.addReceiveOpenNotificationListener((r) => {
            this.setState({
                text: 'click:' + r.alertContent
            });
            // JPushModule.jumpToPushActivity("Test");
            console.log('JPushModule.addReceiveOpenNotificationListener', r);
        });
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