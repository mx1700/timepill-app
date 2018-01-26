import {StyleSheet} from "react-native";

const colors = {
    primary: '#007AFF',
    light: '#007AFF',
    text: '#484848',
    warning: '#ffdd57',
    danger: '#ff3860',

    inactiveText: '#9B9B9B',
    darkText: '#333333',
    lightText: '#7F91A7',

    spaceBackground: '#f3f3ff', //空内容背景
    navBackground: '#F7F7F7',
    line: '#eee',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // backgroundColor: '#FFFFFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default styles;
export { colors, styles }