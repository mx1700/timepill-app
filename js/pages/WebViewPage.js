import React, { Component } from 'react';
import { WebView, Linking, BackHandler } from 'react-native';
import LocalIcons from "../common/LocalIcons";

export default class WebViewPage extends Component {

    static get navigatorButtons() {
        return {
            leftButtons: [{
                id: 'back', icon: LocalIcons.navButtonBack
            },{
                id: 'close', icon: LocalIcons.navButtonClose
            }],
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
        if (event.id === 'back') {
            this.goBack();
        } else if (event.id === 'open') {
            Linking.openURL(this.webViewState.url)
        } else if (event.id === 'close') {
            this.props.navigator.pop()
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

    onShouldStartLoadWithRequest = (e) => {
        // Implement any custom loading logic here, don't forget to return!
        // 解决WebKitErrorDomain code:101的警告
        // http://leonhwa.com/blog/0014905236320002ebb3db97fe64fb3bb6f047eafb1c5de000
        //淘宝打开的时候会先加载一个空白页，不知道什么原因
        // console.log('LOAD URL:' + e.url);
        let scheme = e.url.split('://')[0];
        if (scheme === 'http' || scheme === 'https') {
            return true
        }
        return false
    };

    render() {
        return (
            <WebView
                ref={(r) => this.webView = r}
                source={{uri: this.props.uri}}
                style={{flex: 1}}
                onLoad={this.onLoad}
                onNavigationStateChange={this.onNavigationStateChange}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            />
        );
    }
}