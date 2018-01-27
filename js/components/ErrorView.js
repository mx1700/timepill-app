import React, { Component } from 'react';
import Touchable from "./Touchable";
import {Text, View} from "react-native";
import {colors} from '../Styles'
import Button from "./Button";


function errorView(props) {
    {/*<Touchable style={{marginTop: 15}} onPress={props.onButtonPress}>*/}
    {/*<Text style={{color: colors.primary}}>{props.button}</Text>*/}
    {/*</Touchable>*/}
    const button = props.buttonText
        ? (
            <Button fontSize={14} title={'  ' + props.buttonText + '  '} onPress={props.onButtonPress} />
        )
        : null;
    return (
        <View style={[{alignItems:'center', justifyContent: 'center' , height: '100%'}, props.style]}>
            <Text style={{paddingBottom: 15, color: colors.text}}>{props.text}</Text>
            {button}
        </View>
    )
}

export default errorView