import React, { Component } from 'react';
import {StatusBar, Text, View, Animated, BackHandler, Easing, Dimensions} from "react-native";
import navOption from "../components/NavOption";
import {colors} from "../Styles";
import TPTouchable from "../components/TPTouchable";
import PropTypes from 'prop-types';
import RootSiblings from "react-native-root-siblings";
import FastImage from "react-native-fast-image";
import ImageZoom from 'react-native-image-pan-zoom';

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
            hiddenStatusBar: true,
            fadeAnimOpacity: new Animated.Value(0),
            width: 0,
            height: 0,
        };
    }

    componentWillMount() {
        Animated.timing(
            this.state.fadeAnimOpacity,
            {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.cubic)
            }
        ).start(() => {

        });

        // this.setState({
        //     hiddenStatusBar: true,
        // });

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
        this.props.onClosePress();
        // Animated.timing(
        //     this.state.fadeAnimOpacity,
        //     {
        //         toValue: 0,
        //         duration: 0,
        //     }
        // ).start(() => {
        //     this.props.onClosePress();
        // });
    }

    savePhoto() {

    }

    render() {
        return (
            <Animated.View
                style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'black',
                    opacity: this.state.fadeAnimOpacity
                }}
                onLayout={(event) => {
                    let {x, y, width, height} = event.nativeEvent.layout;
                    this.setState({
                        width: width,
                        height: height,
                    })
                }}
            >
                <StatusBar
                    hidden={this.state.hiddenStatusBar}
                    animated={true}
                    showHideTransition="slide"
                />
                {/*<TPTouchable onPress={this.close.bind(this)}>*/}
                {/*<Text style={{backgroundColor:'green'}}>关闭-{this.state.progress}</Text>*/}
                {/*</TPTouchable>*/}
                <ImageZoom cropWidth={this.state.width}
                           cropHeight={this.state.height}
                           imageWidth={this.state.width}
                           imageHeight={this.state.height}
                           onClick={() => this.close()}
                           doubleClickInterval={350}
                           onLongPress={this.savePhoto.bind(this)}
                >
                    <FastImage
                        style={{flex: 1, width: '100%', height: '100%'}}
                        source={{
                            uri: this.props.url,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        onProgress={(e) => {
                            this.setState({
                                progress: e.nativeEvent.loaded / e.nativeEvent.total
                            })
                        }}
                    />
                </ImageZoom>
            </Animated.View>
        )
    }
}