import React, { Component } from 'react';
import Button from '../components/Button'
import Diary from '../components/Diary'
import {View} from "react-native";

export default class HomeScreen extends React.Component {
    render() {
        let diary = {
            "id": 12830949,
            "user_id": 100672440,
            "notebook_id": 908250,
            "notebook_subject": "继续跳舞",
            "content": "发1下",
            "created": "2018-01-23 15:31:18",
            "updated": "2018-01-23 15:31:18",
            "type": 2,
            "comment_count": 3,
            "photoUrl": "http://s.mt.timepill.net/s/w640/photos/2018-01-23/7g4sztvy.jpg",
            "photoThumbUrl": "http://s.mt.timepill.net/s/w240-h320/photos/2018-01-23/7g4sztvy.jpg",
            // "user": {
            //     "id": 100672440,
            //     "name": "我超凶",
            //     "iconUrl": "http://s.mt.timepill.net/user_icon/20134/s100672440.jpg?v=2"
            // }
        };
        return (
            <View>
                <Diary diary={diary} showBookSubject={true} showComment={true} editable={true}/>
            {/*<Button*/}
                {/*onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}*/}
                {/*title="Go to Lucy's profile"*/}
            {/*/>*/}
            </View>
        );
    }
}