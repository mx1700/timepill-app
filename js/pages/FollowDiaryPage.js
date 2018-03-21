import React, { Component } from 'react';
import {Text, View, TouchableNativeFeedback, Platform, DeviceEventEmitter} from "react-native";
import {colors} from "../Styles";
import FollowDiaryData from "../common/FollowDiaryData";
import DiaryList from "../components/DiaryList";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Events from "../Events";
import TPTouchable from "../components/TPTouchable";

const HEADER_PADDING = Platform.OS === 'android' ? 20 : 40;

export default class FollowDiaryPage extends React.Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    componentWillMount() {
        this.loginListener = DeviceEventEmitter.addListener(Events.login, () => this.list.refresh());
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillUnmount() {
        this.loginListener.remove();
    }

    onNavigatorEvent(event) {
        // console.log(event);
        if (event.id === 'bottomTabReselected') {
            this.list.scrollToTop();
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#FFFFFF'}}>
                <DiaryList
                    ref={(r) => this.list = r}
                    dataSource={new FollowDiaryData()}
                    ListHeaderComponent={() => {
                        return (
                            <View style={{
                                paddingTop: HEADER_PADDING + 16,
                                paddingHorizontal: 20,
                                flexDirection: "row",
                                flexGrow: 1,
                                flexShrink: 1,
                            }}>
                                <Text style={{fontSize: 30, color: colors.text, height: 40, flex: 1}}>关注</Text>
                                <TPTouchable>
                                    <Ionicons name="ios-contacts"
                                              size={28}
                                              color={colors.primary}
                                              style={{paddingVertical: 2, paddingHorizontal: 5, marginRight: -10}}/>
                                </TPTouchable>
                            </View>
                        )
                    }}
                    navigator={this.props.navigator}
                />
            </View>
        )
    }
}