import React, {Component} from "react";
import {ScrollView, TextInput, View} from "react-native";
import {colors} from "../Styles";

export default class TestPage extends Component {
    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor:'red'}} contentContainerStyle={{flex: 1}}>
                <TextInput style={{flex: 1, backgroundColor: 'blue'}}
                           autoCorrect={false}
                           underlineColorAndroid="transparent"
                           selectionColor={colors.primary}
                           maxLength={5000}
                           multiline={true}
                           placeholder="记录点滴生活" />
            </ScrollView>
        );
    }
}