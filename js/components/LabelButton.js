/**
 * @providesModule LabelButton
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from "../Styles";
import { Button } from 'react-native-elements';

function LabelButton(props) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.button}>
                <Icon name={props.icon} size={16} color={colors.text} style={styles.button_icon} />
                <Text style={{fontSize: 13, color: colors.text }}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

module.exports = LabelButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        // borderWidth: 1,
        // borderColor: colors.light,
        borderRadius: 99,
        paddingHorizontal: 15,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.warning
    },
    button_icon: {
        marginTop: 2, marginRight: 6
    }
});
