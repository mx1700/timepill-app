import React, { Component } from 'react';
import {
    StatusBar, Text, View, Animated, BackHandler, Easing, Dimensions, ActivityIndicator,
    TouchableWithoutFeedback, Platform, CameraRoll
} from "react-native";
import {colors} from "../Styles";
import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';
import Image from 'react-native-image-progress';
import ActionSheet from 'react-native-actionsheet-api';
import Toast from 'react-native-root-toast';
import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";

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

    close() {
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        });
    }

    onLongPress() {
        ActionSheet.showActionSheetWithOptions({
            options:['保存照片', '取消'],
            cancelButtonIndex:1,
        }, (index) => {
            if(index === 0) {
                this.savePhoto().done();
            }
        });

    }

    async savePhoto() {
        let url = this.props.url;

        try {

            if(Platform.OS === 'android') {
                let dirs = RNFetchBlob.fs.dirs;
                let path = dirs.DownloadDir + '/timepill/' + moment().format('YYYYMMDD-hhmmss') + '.jpg';
                let res = await RNFetchBlob.config({ path : path, }).fetch('GET', this.props.url, { });
                await RNFetchBlob.fs.scanFile([{ path: res.path() }]);
                // url = res.path();
                // console.log('savePhoto url:' + url);
            } else {
                await CameraRoll.saveToCameraRoll(url);
            }

            Toast.show('照片已保存', {
                duration: 2000,
                position: Toast.positions.BOTTOM,
                shadow: false,
                hideOnPress: true,
            })
        } catch (err) {
            Toast.show('照片保存失败:' + err.message, {
                duration: 2000,
                position: Toast.positions.BOTTOM,
                shadow: false,
                hideOnPress: true,
            })
        }
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
                           doubleClickInterval={250}
                           onLongPress={this.onLongPress.bind(this)}
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

