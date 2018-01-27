import React, { Component } from 'react';
import Button from '../components/Button'
import Touchable from "../components/Touchable";
import {Text, View, TouchableNativeFeedback} from "react-native";
import {colors} from "../Styles";
import FollowDiaryData from "../common/FollowDiaryData";
import DiaryList from "../components/DiaryList";
import navOption from "../components/NavOption";

export default class FollowDiaryPage extends React.Component {
    static navigationOptions = navOption({
        title:"关注",
        headerTitle: '关注',
        headerStyle: {
            backgroundColor: '#FFF',
            borderBottomColor: 'transparent',
            height: 0,
        },
        headerTitleStyle: {
            color: 'transparent'
        }
    });

    render() {
        //this.props.navigation.navigate('Login', {name: 'Lucy'})
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
                />
            </View>
        )
    }
}