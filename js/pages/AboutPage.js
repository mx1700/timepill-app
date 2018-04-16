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
let DeviceInfo = require('react-native-device-info');
import * as Api from '../Api'
import Events from "../Events";
import {colors as TPColors} from "../Styles";

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            news: Api.getUpdateNews()
        };
    }

    componentDidMount() {
        // CodePush.getUpdateMetadata()
        //     .then((update) => {
        //         if (update) {
        //             this.setState({info: update})
        //         }
        //         console.log(update);
        //     });

        Api.readUpdateNews().done();
        DeviceEventEmitter.emit(Events.onReadUpdateNews);
    }

    render() {
        const label = this.state.info ? ` (${this.state.info.label})` : null;

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{flex: 1, padding: 15,alignItems: 'center', paddingTop: 80}}>
                    <Image source={require('../img/Icon.png')}
                           style={{width: 128, height: 128, borderRadius: 28, borderWidth: 1, borderColor:"#d9d9d9"}} />
                    <Text style={{paddingTop: 20, paddingBottom: 60}}>版本: {DeviceInfo.getVersion()}{label}</Text>
                    <Text style={{color: TPColors.inactiveText}}>{this.state.news.date} 更新日志</Text>
                    <Text style={{lineHeight: 20}}>{this.state.news.info}</Text>
                </View>
            </View>
        );
    }
}