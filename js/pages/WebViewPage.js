import React, { Component } from 'react';
import { WebView, Linking, BackHandler } from 'react-native';
import LocalIcons from "../common/LocalIcons";

export default class WebViewPage extends Component {

    static get navigatorButtons() {
        return {
            leftButtons: [{
                id: 'close', icon: LocalIcons.navButtonBack
            },],
            rightButtons: [{
                id: "open",
                icon: LocalIcons.navButtonOpen
            }]
        }
    }

    constructor(props) {
        super(props);
        this.webViewState = {
            canGoBack: false,
            canGoForward: false,
            loading: true,
            target: 0,
            url: this.props.uri,
        };

        this.props.navigator.setTitle({
            title: '加载中…'
        })
    }

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        BackHandler.addEventListener('hardwareBackPress', this.goBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    onNavigatorEvent(event) {
        console.log(this.webViewState);
        console.log("onNavigatorEvent", event);
        if (event.id === 'close') {
            this.goBack();
        } else if (event.id === 'open') {
            Linking.openURL(this.webViewState.url)
        }
    }

    goBack = () => {
        if (this.webViewState.canGoBack) {
            this.webView.injectJavaScript('window.history.back();')
        } else {
            this.props.navigator.pop();
        }
    };

    onNavigationStateChange = (event) => {
        console.log('onNavigationStateChange', event);
        this.webViewState = event;
        this.props.navigator.setTitle({
            title: event.loading ? "加载中…" : event.title
        })
    };

    render() {
        return (
            <WebView
                ref={(r) => this.webView = r}
                source={{uri: this.props.uri}}
                style={{flex: 1}}
                onLoad={this.onLoad}
                onNavigationStateChange={this.onNavigationStateChange}
            />
        );
    }
}