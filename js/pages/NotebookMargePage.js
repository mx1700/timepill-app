import {Component} from "react";
import UserBooks from "../components/UserBooks";
import {ActivityIndicator, Alert, Animated, DeviceEventEmitter, Easing, Modal, Platform, View} from "react-native";
import React from "react";
import * as Api from '../Api'
import {colors as TPColors} from "../Styles";
import Toast from "react-native-root-toast";
import Events from "../Events";

export default class NotebookMargePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {

    }

    onPress = (book) => {
        Alert.alert('提示', '确认将《' + book.subject + '》合并到当前日记本？',[
            {text: '确认合并', style: 'destructive', onPress: () => this.margeBooks(book)},
            {text: '取消', onPress: () => console.log('OK Pressed!')},
        ]);
    };

    margeBooks = async (book) => {
        this.setState({loading: true});
        let err = null;
        try {
            await Api.margeNotebook(book.id, this.props.notebook.id);
        } catch (e) {
            err = e.message;
        }
        this.setState({loading: false});

        if (err) {
            let msg = "合并失败" + "\n" + err;
            Toast.show(msg, {
                duration: 2000,
                position: 250,
                shadow: false,
                hideOnPress: true,
            });
        } else {
            DeviceEventEmitter.emit(Events.updateNotebooks);
            Toast.show("合并完成", {
                duration: 2000,
                position: 250,
                shadow: false,
                hideOnPress: true,
            });
            this.props.navigator.pop();
        }

    };

    closeModal() {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnimOpacity,
                {toValue: 0, duration: 350, easing: Easing.out(Easing.cubic)}
            ),
            Animated.timing(
                this.state.fadeAnimHeight,
                {toValue: 0, duration: 350, easing: Easing.out(Easing.cubic)}
            )
        ]).start(() => {
            this.setState({modalVisible: false});
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Modal
                    visible={this.state.loading}
                    transparent={true}
                    onRequestClose={() => {}}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                        <ActivityIndicator animating={true} color={TPColors.light} size={Platform.OS === 'android' ? 'large' : 'small'}/>
                    </View>
                </Modal>
                <UserBooks
                    userId={this.props.notebook.user_id}
                    mySelf={true}
                    navigator={this.props.navigator}
                    showAdd={false}
                    filter={(book) => book.isExpired && book.id !== this.props.notebook.id}
                    onPress={this.onPress}
                />
            </View>
        );
    }
}