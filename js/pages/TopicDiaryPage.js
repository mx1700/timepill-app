import React, { Component } from 'react';
import {Text, View, TouchableNativeFeedback, Platform, DeviceEventEmitter} from "react-native";
import DiaryList from "../components/DiaryList";
import TopicDiaryData from "../common/TopicDiaryData";


export default class TopicDiaryPage extends React.Component {

    static navigatorStyle = {
        // navBarHidden: true,
    };

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillUnmount() {
    }

    onNavigatorEvent(event) {
        // console.log(event);
    }

    render() {
        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                <DiaryList
                    ref={(r) => this.list = r }
                    dataSource={new TopicDiaryData()}
                    navigator={this.props.navigator}
                />
            </View>
        )
    }
}