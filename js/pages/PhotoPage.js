import React, { Component } from 'react';
import {
    StatusBar, Text, View, Animated, BackHandler, Easing, Dimensions, ActivityIndicator,
    TouchableWithoutFeedback, Platform
} from "react-native";
import navOption from "../components/NavOption";
import {colors} from "../Styles";
import TPTouchable from "../components/TPTouchable";
import PropTypes from 'prop-types';
import RootSiblings from "react-native-root-siblings";
import ImageZoom from 'react-native-image-pan-zoom';
import Image from 'react-native-image-progress';

export default class PhotoPage extends Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        onClosePress: PropTypes.func,
    };

    static navigatorStyle = {
        navBarHidden: true,
        statusBarColor: '#000000'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            progress: 0,
            hiddenStatusBar: true,
            width: 0,
            height: 0,
        };
        // let url = diary.photoUrl.replace('w640', 'w640-q75');
    }

    componentWillMount() {
    }

    close() {
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        });
    }

    savePhoto() {
        //TODO:保存照片未实现
    }

    render() {
        return (
            <View
                style={{
                    flex: 1, backgroundColor: 'black',
                }}
                onLayout={(event) => {
                    let {x, y, width, height} = event.nativeEvent.layout;
                    this.setState({
                        width: width,
                        height: height,
                    })
                }}
            >
                <ImageZoom cropWidth={this.state.width}
                           cropHeight={this.state.height}
                           imageWidth={this.state.width}
                           imageHeight={this.state.height}
                           onClick={() => this.close()}
                           doubleClickInterval={350}
                           onLongPress={this.savePhoto.bind(this)}
                >
                    <Image
                        style={{flex: 1, width: '100%', height: '100%'}}
                        source={{
                            uri: this.props.url,
                        }}
                        resizeMode="contain"
                        indicator={loadingView}
                        renderError={errorView}
                    />
                </ImageZoom>
            </View>
        )
    }
}

function loadingView(props) {
    let process = Math.floor(props.progress * 100);
    let text = process > 0 ? process + '%' : '';
    return (
        <View>
            <ActivityIndicator animating={true} color="#FFFFFF" size={Platform.OS === 'android' ? 'large' : 'small'}/>
            <Text style={{color: 'white', padding: 5, fontSize: 14}}>{text}</Text>
        </View>
    )
}

function errorView(props) {
    return (
        <Text>加载失败</Text>
    );
}

