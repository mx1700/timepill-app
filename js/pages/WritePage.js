import React, { Component } from 'react';
import {Text, View} from "react-native";
import ErrorView from "../components/ErrorView";
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import navOption from "../components/NavOption";

export default class WritePage extends Component {

    static navigatorButtons = {
        rightButtons: [
            {
                title: '取消', // for a textual button, provide the button title (label)
                id: 'cancel', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            },
            // {
            //     icon: require('../../img/navicon_add.png'), // for icon button, provide the local image asset name
            //     id: 'add' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            // }
        ]
    };

    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'cancel') { // this is the same id field from the static navigatorButtons definition
                this.props.navigator.dismissModal();
            }
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