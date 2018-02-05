import React, { Component } from 'react';
import {DeviceEventEmitter, Platform, StatusBar, Text, View} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Events from "../Events";

const HEADER_PADDING = Platform.OS === 'android' ? 20 : 40;
export default class HomeScreen extends React.Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    componentWillMount() {
        this.loginListener = DeviceEventEmitter.addListener(Events.login, () => this.list.refresh())
    }

    componentWillUnmount() {
        this.loginListener.remove();
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