import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";
import {ButtonGroup} from "react-native-elements";
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {colors} from "../Styles";
import Touchable from "../components/TPTouchable";

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

export default class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
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
            <View>
                <Text>{this.state.selectedIndex}</Text>
            </View>
        )
    }
}
