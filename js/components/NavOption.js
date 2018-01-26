import {Platform} from "react-native";

let defaultNavigationOptions = {
    headerTitleStyle: {
        fontWeight: Platform.OS === 'ios' ? '600' : '400',
    },
};

if (Platform.OS === 'android') {
    defaultNavigationOptions.headerStyle = {
        backgroundColor: '#FFFFFF',
        shadowColor: '#777777',
        shadowOpacity: 0.1,
        elevation: 1.2,
        height: 50,
    };
    defaultNavigationOptions.headerTitleStyle.fontSize = 18;
}

function navOption(option) {
    return Object.assign(option, defaultNavigationOptions);
}

export default navOption