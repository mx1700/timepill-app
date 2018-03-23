import React, {Component} from "react";
import {
    Image, ImageBackground, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback,
    View
} from "react-native";
import {colors} from "../Styles";
import TPButton from "../components/TPButton";

export default class SplashPage extends Component {

    static navigatorStyle = {
        navBarHidden: true,
        // navBarHideOnScroll: true,
    };

    isClose = false;
    timer = null;

    constructor(props) {
        super(props);
        this.state = {
            time: 3,
        };
        this.startTimer()
    }

    startTimer() {
        this.timer = setTimeout(() => {
            const t = this.state.time - 1;
            this.setState({
                time: t
            });
            if (t === 0) {
                this.close()
            } else {
                this.startTimer()
            }
        }, 1000);
    }

    close = () => {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        if (this.isClose) {
            return;
        }
        this.isClose = true;
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        })
    };

    press = () => {
        this.close();
        if (this.props.link && this.props.link.screen) {
            const params = JSON.parse(JSON.stringify(this.props.link));
            this.props.navigator.push(params);
        }
    };

    render() {
        const title = "关闭 " + this.state.time + 's';
        return (
            <View style={{flex: 1}}>
                <TouchableWithoutFeedback style={{flex: 1}} onPress={this.press}>
                    <ImageBackground style={{flex: 1}} source={{uri: this.props.image_url}}>
                        <View style={{
                            position: 'absolute',
                            top: Platform.OS === 'ios' ? 30 : 20,
                            right: 0,
                            opacity: 0.65
                        }}>
                            <TPButton title={title}

                                      buttonStyle={{
                                          backgroundColor: '#FFF',
                                          width: 70,
                                          height: 28,
                                      }}
                                      onPress={this.close}
                                      textStyle={{fontWeight: 'bold', fontSize: 12, color: 'black'}}
                            />
                        </View>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}