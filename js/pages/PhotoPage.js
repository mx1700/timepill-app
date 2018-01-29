import React, { Component } from 'react';
import {StatusBar, View} from "react-native";
import navOption from "../components/NavOption";
import {colors} from "../Styles";

export default class PhotoPage extends Component {
    static navigationOptions = navOption({
        title:"照片",
        headerTitle: '照片',
        header: null,
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            progress: 0,
            hiddenStatusBar: true,
        };
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor:'black'}}>
                <StatusBar
                    hidden={this.state.hiddenStatusBar}
                    animated={true}
                    showHideTransition="fade"
                />

            </View>
        )
    }
}