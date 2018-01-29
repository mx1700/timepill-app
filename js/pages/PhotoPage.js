import React, { Component } from 'react';
import {StatusBar, Text, View, Animated, BackHandler} from "react-native";
import navOption from "../components/NavOption";
import {colors} from "../Styles";
import TPTouchable from "../components/TPTouchable";
import PropTypes from 'prop-types';
import RootSiblings from "react-native-root-siblings";

export default class PhotoPage extends Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        onClosePress: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            progress: 0,
            hiddenStatusBar: false,
            fadeAnimOpacity: new Animated.Value(0.5),
        };
    }

    componentWillMount() {
        Animated.timing(
            this.state.fadeAnimOpacity,
            {
                toValue: 1,
                duration: 150,
            }
        ).start(() => {

        });

        this.setState({
            hiddenStatusBar: true,
        });

        BackHandler.addEventListener('hardwareBackPress', () => {
            // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
            // Typically you would use the navigator here to go to the last state.
            this.close();
            return true;
        });
    }

    static open({ url }) {
        let sibling = new RootSiblings(<PhotoPage url={url} onClosePress={() => {
            sibling.destroy();
        }} />);
    }

    close() {
        this.setState({
            hiddenStatusBar: false,
        });
        Animated.timing(
            this.state.fadeAnimOpacity,
            {
                toValue: 0,
                duration: 100,
            }
        ).start(() => {
            this.props.onClosePress();
        });
    }

    render() {
        return (
            <Animated.View style={{position: 'absolute', top: 0,right: 0,bottom: 0,left: 0,backgroundColor: 'black',
                opacity: this.state.fadeAnimOpacity}}>
                <StatusBar
                    hidden={this.state.hiddenStatusBar}
                    animated={true}
                    showHideTransition="slide"
                />
                <TPTouchable onPress={this.close.bind(this)}>
                    <Text style={{backgroundColor:'green'}}>关闭</Text>
                </TPTouchable>
            </Animated.View>
        )
    }
}