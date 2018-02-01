import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";
import {ButtonGroup} from "react-native-elements";
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {colors} from "../Styles";
import Touchable from "../components/TPTouchable";
import DiaryList from "../components/DiaryList";
import UserDiaryData from "../common/UserDiaryData";

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

export default class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isMyself: true,
        }
    }

    componentDidMount() {

    }

    _selectTab(selectedIndex) {
        this.setState({
            selectedIndex: selectedIndex
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DiaryList dataSource={new UserDiaryData()}
                           navigator={this.props.navigator}
                           editable={this.state.isMyself}
                />
            </View>
        )
    }
}
