import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";
import {colors} from "../Styles";
import LocalIcons from '../common/LocalIcons'

export default class WritePage extends Component {

    static get navigatorButtons() {
        return {
            leftButtons: [{
                id: 'cancel', icon: LocalIcons.navButtonClose
            },],
            rightButtons: [{
                id: "save",
                icon: LocalIcons.navButtonSave
            }]
        }
    }

    constructor(props) {
        super(props);
        this.tabIndexToSelect = 0;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'cancel') { // this is the same id field from the static navigatorButtons definition
                // this.props.navigator.dismissModal();
                if (this.props.tabOpen) {
                    this.props.navigator.switchToTab({
                        tabIndex: this.tabIndexToSelect
                    });
                } else {
                    this.props.navigator.pop();
                }
            }
            if(event.id === 'save') {

            }
        }
        if (event.selectedTabIndex === 2 && this.props.tabOpen) {
            this.tabIndexToSelect = !event.unselectedTabIndex || event.unselectedTabIndex === 2 ? 0 : event.unselectedTabIndex;
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <ErrorView text={"Write"} />
            </View>
        )
    }
}