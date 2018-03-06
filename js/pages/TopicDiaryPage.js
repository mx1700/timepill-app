import React, { Component } from 'react';
import {Text, View, TouchableNativeFeedback, Platform, DeviceEventEmitter} from "react-native";
import DiaryList from "../components/DiaryList";
import TopicDiaryData from "../common/TopicDiaryData";
import LocalIcons from "../common/LocalIcons";
import Events from "../Events";


export default class TopicDiaryPage extends React.Component {

    static navigatorStyle = {
        // navBarHidden: true,
    };

    static get navigatorButtons() {
        return {
            rightButtons: [{
                id: "write",
                icon: LocalIcons.navButtonWrite
            }]
        }
    }

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.writeDiaryListener = DeviceEventEmitter.addListener(Events.writeDiary, () => {
            this.diaryList && this.diaryList.refresh()
        });
        this.deleteListener = DeviceEventEmitter.addListener(Events.deleteDiary, () => {
            this.diaryList && this.diaryList.refresh()
        });
    }

    componentWillUnmount() {
        this.deleteListener.remove();
        this.writeDiaryListener.remove();
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'write') {
                this.props.navigator.push({
                    screen: 'Write',
                    title: '写话题日记',
                    passProps: { topic: this.props.topic },
                });
            }
        }
    }

    render() {
        return (
            <View style={{backgroundColor: '#FFFFFF'}}>
                <DiaryList
                    ref={(r) => this.diaryList = r}
                    dataSource={new TopicDiaryData()}
                    navigator={this.props.navigator}
                />
            </View>
        )
    }
}