import React, { Component } from 'react';
import {
    DeviceEventEmitter, Platform, StatusBar, Text, View, Alert, Image, Dimensions, ImageBackground,
    TouchableOpacity, StyleSheet, PermissionsAndroid,
} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";
import Events from "../Events";
import * as Api from "../Api";
import RNFetchBlob from "react-native-fetch-blob";
import * as TimeHelper from "../common/TimeHelper";
import TPTouchable from "../components/TPTouchable";
const DeviceInfo = require('react-native-device-info');
import { isIphoneX } from 'react-native-iphone-x-helper'
import Toast from 'react-native-root-toast';

const isIpx = isIphoneX();
const HEADER_PADDING = Platform.OS === 'android' ? 20 : (isIpx ? 55 : 25);

export default class HomePage extends React.Component {

    state = {
        topic: null,
    };

    static navigatorStyle = {
        navBarHidden: true,
        statusBarBlur: true,
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        // console.log(event);
        if (event.id === 'bottomTabReselected') {
            this.list.scrollToTop();
        }
    }

    componentDidMount() {
        if (this.props.splash && this.props.splash.image_url) {
            this.props.navigator.push({
                screen: 'Splash',
                passProps: this.props.splash,
                animationType: 'fade'
            });
        }

        if(Platform.OS === 'android') {
            setTimeout(() => {
                this.updateAndroid().done()
            }, 2000);
        }
        
        try {
            Api.syncSplash().catch((err) => console.log('errrrrrrrrrrrr',err));
        } catch (err) {
            console.log(err)
        }
    }

    async updateAndroid() {
        try {
            let info = await Api.getUpdateInfo();
            const VERSION = DeviceInfo.getVersion();
            if (info.lastestVersion > VERSION) {
                Alert.alert(
                    '发现新版本 v' + info.lastestVersion,
                    info.message,
                    [
                        {text: '以后再说', onPress: () => console.log('Ask me later pressed')},
                        {text: '更新', onPress: () => this.downloadApk(info.apkUrl, info.lastestVersion)},
                    ],
                    {cancelable: false}
                )
            }
        } catch (err) {
        }

    }

    async downloadApk(url, version) {
        const toastConf = {
            duration: 2500,
            position: -50,
            shadow: false,
            hideOnPress: true,
        };

        const pass = await this.checkPermissions();
        if (!pass) {
            Toast.show("更新失败：没有写入文件的权限", toastConf);
            return;
        }
        Toast.show("开始下载更新包", toastConf);
        // console.log('updateAndroid', RNFetchBlob.fs.dirs.DownloadDir);
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    mediaScannable: true,
                    mime: 'application/vnd.android.package-archive',
                    title: '胶囊日记 v' + version,
                    description: '正在下载 ' + version + ' 版本',
                    path: `${RNFetchBlob.fs.dirs.DownloadDir}/timepill-${version}.apk`,
                }
            })
            .fetch('GET', url)
            .then((resp) => {
                Toast.show("更新包下载完成", toastConf);
                // console.log('download ok:', resp.path());
                RNFetchBlob.android.actionViewIntent(resp.path(), 'application/vnd.android.package-archive');
            })
    }

    checkPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error(err);
            return false;
        }

    };

    updateTopic = async () => {
        let topic = null;
        try {
            topic = await Api.getTodayTopic();
            this.setState({
                topic: topic,
            });
        } catch (err) {
            console.error(err);
        }
    };

    openTopicPage = () => {
        this.props.navigator.push({
            screen: 'Topic',
            title: '话题：' + this.state.topic.title,
            passProps: { topic: this.state.topic }
        });
    };

    renderHeader() {
        const topic = this.state.topic;
        const topicView = topic ? (
            <TouchableOpacity onPress={this.openTopicPage} activeOpacity={0.7}>
                <ImageBackground
                    style={styles.topic_box}
                    imageStyle={{ borderRadius: 8 }}
                    source={{ uri: topic.imageUrl }} >
                    <Text style={styles.topic_title} allowFontScaling={false}># {topic.title}</Text>
                    <Text style={styles.topic_intro} allowFontScaling={false}>{topic.intro}</Text>
                </ImageBackground>
            </TouchableOpacity>
        ) : null;

        return (<View style={{paddingTop: HEADER_PADDING}}>
            <View style={{
                paddingLeft: 20,
                flexDirection: "row",
                flexGrow: 1,
                flexShrink: 1,
                alignItems:"center",}}>
                <Text allowFontScaling={false}
                      style={{fontSize: 30, color: '#000', flex: 1}}>Today</Text>
            </View>
            {topicView}
        </View>)
    }

    render() {

        return (
            <View style={{backgroundColor: '#FFFFFF', flex: 1, paddingTop: isIpx ? 0 : 20}}>
                <DiaryList
                    ref={(r) => this.list = r}
                    dataSource={new HomeListData()}
                    openLogin={true}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    navigator={this.props.navigator}
                    onRefreshList={this.updateTopic}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    topic_box: {
        flex: 1,
        height: 240,
        marginTop: 15,
        marginBottom: 15,
        marginHorizontal: 15,
    },
    topic_title: {
        fontSize: 24,
        color: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        textShadowColor: '#333',
        textShadowOffset: { width: 1, height: 1 }
    },
    topic_intro: {
        fontSize: 16,
        color: '#FFF',
        paddingHorizontal: 22,
        textShadowColor: '#333',
        textShadowOffset: { width: 1, height: 1 }
    }
});