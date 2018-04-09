/**
 * @providesModule ErrorView
 */

import React, { Component } from 'react';
import Touchable from "./TPTouchable";
import {Text, View} from "react-native";
import {colors} from '../Styles'
import Button from "./TPButton";
import PropTypes from 'prop-types';


function errorView(props) {
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

errorView.propTypes = {
    text: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    onButtonPress: PropTypes.func,
    // style: View.propTypes.style,
};

errorView.defaultProps = {
    buttonText: '刷新一下',
};

export default errorView