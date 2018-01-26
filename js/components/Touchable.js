import React from "react";
import {Platform, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";

let TouchableIOS = (props) => {
    return <TouchableOpacity {...props} />
};

let TouchableAndroid = (props) => {
    return (<
        TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} {...props}>
            <View>
                {props.children}
            </View>
        </TouchableNativeFeedback>
        )
};

const Touchable = Platform.OS === 'android'
    ? TouchableAndroid
    : TouchableIOS;

export default Touchable