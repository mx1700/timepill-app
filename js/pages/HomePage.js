import React, { Component } from 'react';
import {StatusBar, Text, View} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";
import navOption from "../components/NavOption";
import Ionicons from 'react-native-vector-icons/Ionicons.js';

export default class HomeScreen extends React.Component {

    static navigatorStyle = {
        navBarHidden: true,
    };

    componentWillMount() {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(colors.navBackground);
    }
    render() {
        // this.props.navigator.setSubTitle({
        //     subtitle: '1月27日'
        // });

        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                {/*<StatusBar*/}
                    {/*backgroundColor={colors.navBackground}*/}
                    {/*barStyle="dark-content"*/}
                {/*/>*/}
                <DiaryList
                    dataSource={new HomeListData()}
                    ListHeaderComponent={() => {
                        return (<View style={{paddingTop: 40, paddingHorizontal: 20}}>
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