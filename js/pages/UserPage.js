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
    static navigationOptions = ({navigation}) => {
        const buttons = ['简介', '日记', '日记本'];
        const { params = {} } = navigation.state;
        const selectedIndex = params.selectedIndex ? params.selectedIndex : 0;

        return navOption({
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-contact' : 'ios-contact-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
            headerTitle: (
                <ButtonGroup
                    containerStyle={{height: 30}}
                    onPress={(index) => {
                        if (params.selectTab) {
                            params.selectTab(index)
                        }
                        navigation.setParams({ selectedIndex: index });
                    }}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                />
            ),
            headerRight: (
                <Touchable style={{margin: 20}}>
                    <Ionicons
                        name={'ios-heart-outline'}
                        size={26}
                        style={{color: colors.primary, padding:15}}
                    />
                </Touchable>
            )
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ selectTab: this._selectTab.bind(this) });
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
