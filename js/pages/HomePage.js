import React, { Component } from 'react';
import Button from '../components/Button'
import Diary from '../components/Diary'
import {StatusBar, View} from "react-native";
import DiaryList from '../components/DiaryList'
import {colors} from "../Styles";

export default class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{backgroundColor:'#FFFFFF'}}>
                <StatusBar
                    backgroundColor={colors.navBackground}
                    barStyle="dark-content"
                />
                <DiaryList />
                {/*<Diary diary={diary} showBookSubject={true} showComment={true} editable={true}/>*/}
            {/*<Button*/}
                {/*onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}*/}
                {/*title="Go to Lucy's profile"*/}
            {/*/>*/}
            </View>
        );
    }
}