import React, { Component } from 'react';
import Button from '../components/Button'
import Diary from '../components/Diary'
import {StatusBar, Text, View} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";
import navOption from "../components/NavOption";

export default class HomeScreen extends React.Component {
    static navigationOptions = navOption({
        title:"首页",
        headerTitle: '首页',
        headerStyle: {
            // backgroundColor: '#FFF',
            // borderWidth:0,
            // borderBottomColor: 'transparent',
            // position: 'absolute',
            // backgroundColor: 'transparent',
            // zIndex: 100, top: 0, left: 0, right: 0
            backgroundColor: '#FFF',
            borderBottomColor: 'transparent',
            height: 0,
        },
        headerTitleStyle: {
            color: 'transparent'
        }
    });

    render() {
        {/*<Diary diary={diary} showBookSubject={true} showComment={true} editable={true}/>*/}
        {/*<Button*/}
        {/*onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}*/}
        {/*title="Go to Lucy's profile"*/}
        {/*/>*/}

        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                <StatusBar
                    backgroundColor={colors.navBackground}
                    barStyle="dark-content"
                />
                <DiaryList
                    dataSource={new HomeListData()}
                    ListHeaderComponent={() => {
                        return (<View style={{paddingTop: 20, paddingHorizontal: 20}}>
                            <Text style={{color: colors.inactiveText, fontSize: 14, height: 16}}>1月27日</Text>
                            <Text style={{fontSize:30, color: colors.text, height: 40}}>Today</Text>
                        </View>)
                    }}
                />
            </View>
        );
    }
}