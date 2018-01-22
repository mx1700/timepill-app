import {StyleSheet} from "react-native";

const colors = {
    primary: '#007AFF',
    text: '#333333',
    warning: '#ffdd57',
    danger: '#ff3860',

    inactiveText: '#9B9B9B',
    darkText: '#032250',
    lightText: '#7F91A7',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
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