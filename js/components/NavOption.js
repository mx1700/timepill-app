import {Platform} from "react-native";
import {colors} from "../Styles";



function navOption(option) {
    let defaultNavigationOptions = {
        headerTitleStyle: {
            fontWeight: Platform.OS === 'ios' ? '600' : '400',
        },
    };

    if (Platform.OS === 'android') {
        defaultNavigationOptions.headerStyle = {
            backgroundColor: colors.navBackground,
            shadowColor: '#777777',
            shadowOpacity: 0.1,
            elevation: 1.2,
            height: 50,
        };
        defaultNavigationOptions.headerTitleStyle.fontSize = 19;
    }
    return Object.assign({}, defaultNavigationOptions, option);
}

export default navOption