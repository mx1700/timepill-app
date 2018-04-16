import React, { Component } from 'react';
import {Text, View, TouchableNativeFeedback, Platform, DeviceEventEmitter} from "react-native";
import {colors} from "../Styles";
import FollowDiaryData from "../common/FollowDiaryData";
import DiaryList from "../components/DiaryList";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Events from "../Events";
import TPTouchable from "../components/TPTouchable";
import { isIphoneX } from 'react-native-iphone-x-helper'

const isIpx = isIphoneX();
const isAndroid = Platform.OS === 'android';
const HEADER_PADDING = Platform.OS === 'android' ? 20 : (isIpx ? 10 : 25);

export default class FollowDiaryPage extends React.Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        // console.log(event);
        if (event.id === 'bottomTabReselected') {
            this.list.scrollToTop();
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#FFFFFF', flex: 1, paddingTop: isIpx || isAndroid ? 44 : 20}}>
                <DiaryList
                    ref={(r) => this.list = r}
                    dataSource={new FollowDiaryData()}
                    ListHeaderComponent={() => {
                        return (
                            <View style={{
                                paddingTop: HEADER_PADDING,
                            }}>
                                <View style={{
                                    paddingLeft: 20,
                                    flexDirection: "row",
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    alignItems:"center",}}>
                                    <Text allowFontScaling={false}
                                          style={{fontSize: 30, color: '#000', flex: 1}}>关注</Text>
                                    <TPTouchable onPress={() => {
                                        this.props.navigator.push({
                                            screen: 'FollowUsers',
                                            title: '关注用户'
                                        });
                                    }}>
                                        <Ionicons name="ios-contacts"
                                                  size={30}
                                                  color={colors.primary}
                                                  style={{paddingHorizontal: 15}}/>
                                    </TPTouchable>
                                </View>
                            </View>
                        )
                    }}
                    navigator={this.props.navigator}
                    emptyMessage={"今天还没有人写日记"}
                />
            </View>
        )
    }
}