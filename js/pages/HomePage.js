import React, { Component } from 'react';
import Button from '../components/Button'
import Diary from '../components/Diary'
import {StatusBar, Text, View} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";
import HomeListData from "../common/HomeListData";

export default class HomeScreen extends React.Component {

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
                            <Text style={{color: colors.inactiveText}}>1月27日</Text>
                            <Text style={{fontSize:30 }}>Today</Text>
                        </View>)
                    }}
                />
            </View>
        );
    }
}