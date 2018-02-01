import React, { Component } from 'react';
import {Text, View, TouchableNativeFeedback} from "react-native";
import {colors} from "../Styles";
import FollowDiaryData from "../common/FollowDiaryData";
import DiaryList from "../components/DiaryList";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';

export default class FollowDiaryPage extends React.Component {
    render() {
        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                <DiaryList
                    dataSource={new FollowDiaryData()}
                    ListHeaderComponent={() => {
                        return (<View style={{paddingTop: 20, paddingHorizontal: 20}}>
                            <Text style={{color: '#FFFFFF', fontSize: 14, height: 16}}>1月27日</Text>
                            <Text style={{fontSize:30, color: colors.text, height: 40}}>关注</Text>
                        </View>)
                    }}
                    navigator={this.props.navigator}
                />
            </View>
        )
    }
}