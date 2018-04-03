import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ToolbarAndroid,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Image,
    CameraRoll,
    ActionSheetIOS, DeviceEventEmitter, TextInput,
} from 'react-native';
import * as Api from '../Api'
import Events from "../Events";
import {colors as TPColors} from "../Styles";
import TPButton from "../components/TPButton";
import Toast from 'react-native-root-toast';

export default class FeedbackPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
    }

    send = async () => {
        try {
            await Api.feedback(this.state.content)
        } catch(err) {
            Toast.show("反馈失败:" + err.message, {
                duration: 2000,
                position: 120,
                shadow: false,
                hideOnPress: true,
            });
            return;
        }

        Toast.show("感谢反馈 ：）", {
            duration: 2000,
            position: -80,
            shadow: false,
            hideOnPress: true,
        });
        this.props.navigator.pop();
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: TPColors.spaceBackground}}>
                <TextInput
                    style={{padding: 10, height: 240, margin: 10, backgroundColor: '#fff', textAlignVertical:'top'}}
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    selectionColor={TPColors.light}
                    multiline={true}
                    maxLength={1000}
                    value={this.state.content}
                    onChangeText={(c) => this.setState({content: c})}
                />
                <TPButton title={"发送"} onPress={this.send}/>
            </View>
        );
    }
}