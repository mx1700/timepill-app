import React, { Component } from 'react';
import Touchable from "./Touchable";
import {Text, View} from "react-native";
import {colors} from '../Styles'


function errorView(props) {
    const button = props.button
        ? (
            <Touchable style={{marginTop: 15}} onPress={props.onButtonPress}>
                <Text style={{color: colors.primary}}>{props.button}</Text>
            </Touchable>
        )
        : null;
    return (
        <View style={[{flex: 1, paddingTop: 180, alignItems:'center'}, props.style]}>
            <Text style={{color: colors.inactive}}>{props.text}</Text>
            {button}
        </View>
    )
}

export default errorView