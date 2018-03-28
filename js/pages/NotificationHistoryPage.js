import React, { Component } from 'react';
import {
    Text, View, NativeAppEventEmitter, Platform, ListView, InteractionManager, StyleSheet, RefreshControl,
    ActivityIndicator, DeviceEventEmitter
} from "react-native";
import ErrorView from "../components/ErrorView";
import JPushModule from 'jpush-react-native';
import * as Api from "../Api";
import TPTouchable from "../components/TPTouchable";
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../Styles'
import Events from "../Events";
import Fabric, {Crashlytics} from 'react-native-fabric';
import {updatePushInfo} from "../Api";

const LOOP_TIME_SHORT = 30 * 1000;
const LOOP_TIME_LONG = 60 * 1000;

export default class NotificationHistoryPage extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = ({
            messages: [],
            messagesDataSource: ds,
            refreshing: true,
        });
    }

    componentDidMount() {
        this._loadMessages().done()
    }

    async _loadMessages() {
        let list = [];
        try {
            list = await Api.getMessagesHistory();
        } catch (err) {
        }
        this._setMsgList(list);
    }

    _setMsgList(list) {
        const rowData = list
            .reduce((ret, v) => {
                if (v.type === 2) {  //关注
                    ret.push(v);
                }
                if (v.type === 1) {  //回复
                    const items = ret.filter(x => x.type === 1 && x.link_id === v.link_id);
                    if (items.length > 0) {
                        items[0].list.push(v);
                    } else {
                        ret.push({
                            type: 1,
                            link_id: v.link_id,
                            created: v.created,
                            list: [v]
                        });
                    }
                }
                return ret;
            }, []);

        this.setState({
            messagesDataSource: this.state.messagesDataSource.cloneWithRows(rowData),
            messages: list,
            refreshing: false,
        });
    }

    _onRefresh() {
        this.setState({
            refreshing: true,
        });
        this._loadMessages().done();
    }

    _onCommentPress(msg) {
        this.props.navigator.push({
            screen: 'DiaryDetail',
            title: '日记详情',
            passProps: {
                diary_id: msg.link_id,
                new_comments: msg.list.map(it => it.content.comment_id)
            }
        });
    }

    _onFollowPress(msg) {
        this.props.navigator.push({
            screen: 'User',
            title: msg.content.user.name,
            passProps: { user: msg.content.user }
        });
    }

    render() {
        if (this.state.messages.length === 0) {
            return this.renderEmpty();
        }
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <ListView
                    dataSource={this.state.messagesDataSource}
                    renderRow={(rowData) => this.renderMessage(rowData) }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            colors={[colors.primary]}
                            tintColor={colors.primary} />
                    }
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    removeClippedSubviews={false}
                />
            </View>
        )
    }

    renderMessage(msg) {
        if (msg.type === 1) {
            return this.renderComment(msg);
        } else if (msg.type === 2) {
            return this.renderFollow(msg);
        }

        return (
            <View />
        )
    }

    renderComment(msg) {
        const users = unique(msg.list.map(it => it.content.author.name)).join('、');
        const body = `${users} 回复了你`;
        return (
            <TPTouchable key={msg.link_id} onPress={() => this._onCommentPress(msg)}>
                <View style={styles.message}>
                    <Icon name="ios-text" size={16} style={styles.icon} color={colors.light} />
                    <Text style={{flex: 1, lineHeight: 20}}>{body}</Text>
                </View>
            </TPTouchable>
        )
    }

    renderFollow(msg) {
        const body = `${msg.content.user.name} 关注了你`;
        return (
            <TPTouchable key={msg.link_id} onPress={() => this._onFollowPress(msg)}>
                <View style={styles.message}>
                    <Icon name="ios-heart" size={16} style={styles.icon} color='#d9534f' />
                    <Text key={msg.link_id} style={{flex: 1, lineHeight: 20}}>{body}</Text>
                </View>
            </TPTouchable>
        )
    }

    renderEmpty() {
        if (this.state.refreshing) {
            return (
                <View style={{alignItems:'center', justifyContent: 'center' , height: '100%'}}>
                    <ActivityIndicator animating={true} color={colors.primary} size="large"/>
                </View>
            )
        }
        let text = this.state.error ? '出错了 :(':'没有历史提醒 :)';
        return (
            <ErrorView text={text} onButtonPress={this._onRefresh.bind(this)}/>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        padding: 20,
        borderColor: colors.line,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row'
    },
    icon: {
        marginRight: 10,
        marginTop: 1,
        lineHeight: 20,
    },
    delete: {
        lineHeight: 20,
        paddingHorizontal: 8,
    }
});

function unique(array){
    let n = []; //一个新的临时数组
    //遍历当前数组
    for(let i = 0; i < array.length; i++){
        //如果当前数组的第i已经保存进了临时数组，那么跳过，
        //否则把当前项push到临时数组里面
        if (n.indexOf(array[i]) === -1) n.push(array[i]);
    }
    return n;
}