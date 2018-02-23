import React, { Component } from 'react';
import {DeviceEventEmitter, Platform, StatusBar, Text, View, Alert} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Events from "../Events";
import * as Api from "../Api";
import RNFetchBlob from "react-native-fetch-blob";
const DeviceInfo = require('react-native-device-info');

const HEADER_PADDING = Platform.OS === 'android' ? 20 : 40;

export default class HomePage extends React.Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    componentWillMount() {
        this.loginListener = DeviceEventEmitter.addListener(Events.login, () => this.list.refresh())
    }

    componentWillUnmount() {
        this.loginListener.remove();
    }

    componentDidMount() {
        this.updateAndroid().done()
    }

    async updateAndroid() {
        let info = await Api.getServerAppInfo();
        console.log(info);
        info = info.updateInfo.android;
        const VERSION = DeviceInfo.getVersion();
        console.log(info, VERSION);
        if (info.lastestVersion > VERSION) {
            Alert.alert(
                '发现新版本：v' + info.lastestVersion,
                info.message,
                [
                    {text: '以后再说', onPress: () => console.log('Ask me later pressed')},
                    {text: '更新', onPress: () => this.downloadApk(info.apkUrl,)},
                ],
                { cancelable: false }
            )
        }
    }

    downloadApk(url, version) {
        RNFetchBlob
            .config({
                addAndroidDownloads : {
                    useDownloadManager : true,
                    notification: true,
                    mediaScannable: true,
                    mime: 'application/vnd.android.package-archive',
                    title: '胶囊日记 v' + version,
                    description: '正在下载 ' + version + ' 版本',
                    path: `${RNFetchBlob.fs.dirs.DownloadDir}/timepill.apk`,
                }
            })
            .fetch('GET', url)
            .then((resp) => {
                console.log('download ok', resp.path());
                RNFetchBlob.android.actionViewIntent(resp.path(), 'application/vnd.android.package-archive');
            })
    }

    render() {
        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                <DiaryList
                    ref={(r) => this.list = r }
                    dataSource={new HomeListData()}
                    openLogin={true}
                    ListHeaderComponent={() => {
                        return (<View style={{paddingTop: HEADER_PADDING, paddingHorizontal: 20}}>
                            <Text style={{color: colors.inactiveText, fontSize: 14, height: 16}}>1月27日</Text>
                            <Text style={{fontSize:30, color: colors.text, height: 40}}>Today</Text>
                        </View>)
                    }}
                    navigator={this.props.navigator}
                />
            </View>
        );
    }
}