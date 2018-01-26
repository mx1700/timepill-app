import React, { Component } from 'react';
import Button from '../components/Button'
import Touchable from "../components/Touchable";
import {Text, View, TouchableNativeFeedback} from "react-native";
import {colors} from "../Styles";

export default class FollowDiaryPage extends React.Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Touchable onPress={() => console.log(111)}>
                    <Text style={{padding: 50}}>aaaa</Text>
                </Touchable>
            <Button
                onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}
                title="登录"
            />
            </View>
        );
    }
}