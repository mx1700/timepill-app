import React from "react";
import {View} from "react-native";

export default class DiaryDetail extends React.Component {
    // static navigationOptions = ({ navigation }) => ({
    //     title: `Chat with ${navigation.state.params.user}`,
    // });
    static navigationOptions = {
        title: "日记详情"
    };

    render() {
        return (
            <View style={{flex: 1}}>
            </View>
        );
    }
}