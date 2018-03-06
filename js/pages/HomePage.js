import React, { Component } from 'react';
import {
    DeviceEventEmitter, Platform, StatusBar, Text, View, Alert, Image, Dimensions, ImageBackground,
    TouchableOpacity, StyleSheet,
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

const HEADER_PADDING = Platform.OS === 'android' ? 20 : 40;

export default class HomePage extends React.Component {

    state = {
        topic: null,
    };

    static navigatorStyle = {
        navBarHidden: true,
        // navBarHideOnScroll: true,
    };

    componentWillMount() {
        this.loginListener = DeviceEventEmitter.addListener(Events.login, () => this.list.refresh());
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillUnmount() {
        this.loginListener.remove();
    }

    componentDidMount() {
        if(Platform.OS === 'android') {
            this.updateAndroid().done()
        }
    }

    onNavigatorEvent(event) {
        // console.log(event);
        if (event.id === 'bottomTabReselected') {
            this.list.scrollToTop();
        }
    }

    async updateAndroid() {
        try {
            let info = await Api.getServerAppInfo();
            // console.log(info);
            info = info.updateInfo.android;
            const VERSION = DeviceInfo.getVersion();
            // console.log(info, VERSION);
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
            //TODO:上报异常
        }

    }

    downloadApk(url, version) {
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true,
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

    updateTopic = async () => {
        let topic = null;
        try {
            topic = await Api.getTodayTopic();
        } catch (err) {
            //
        }
        console.log(topic);
        if (topic) {
            this.setState({
                topic: topic,
            });
        }
    };

    openTopicPage = () => {
        this.props.navigator.push({
            screen: 'Topic',
            title: '话题：' + this.state.topic.title,
        });
    };

    renderHeader() {
        const {height, width} = Dimensions.get('window');
        console.log(width);
        const topic = this.state.topic;
        const topicView = topic ? (
            <TouchableOpacity onPress={this.openTopicPage} activeOpacity={0.7}>
                <ImageBackground
                    style={styles.topic_box}
                    imageStyle={{ borderRadius: 18 }}
                    source={{ uri: topic.imageUrl }} >
                    <Text style={styles.topic_title} allowFontScaling={false}># {topic.title}</Text>
                    <Text style={styles.topic_intro} allowFontScaling={false}>{topic.intro}</Text>
                </ImageBackground>
            </TouchableOpacity>
        ) : null;

        console.log(TimeHelper);
        const now = TimeHelper.now();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        return (<View style={{paddingTop: HEADER_PADDING, paddingHorizontal: 20}}>
            <Text style={{color: colors.inactiveText, fontSize: 14, height: 16}} allowFontScaling={false}>{month}月{day}日</Text>
            <Text style={{fontSize: 30, color: colors.text, height: 40}} allowFontScaling={false}>Today</Text>
            {topicView}
        </View>)
    }

    render() {

        return (
            <View style={{backgroundColor: '#FFFFFF'}}>
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
        marginBottom: 15
    },
    topic_title: {
        fontSize: 32,
        color: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        textShadowColor: '#333',
        textShadowOffset: { width: 2, height: 2 }
    },
    topic_intro: {
        fontSize: 18,
        color: '#FFF',
        paddingHorizontal: 22,
        textShadowColor: '#333',
        textShadowOffset: { width: 1, height: 1 }
    }
});