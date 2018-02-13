import React, { Component } from 'react';
import {Text, View, StyleSheet, Animated, Dimensions, DeviceEventEmitter, Alert} from "react-native";
import DiaryList from "../components/DiaryList";
import UserDiaryData from "../common/UserDiaryData";
import LocalIcons from "../common/LocalIcons";
import {TabViewAnimated, TabBar, SceneMap, TabViewPagerPan, TabViewPagerScroll} from 'react-native-tab-view';
import {colors} from "../Styles";
import Events from "../Events";
import * as Api from "../Api";
import UserIntro from "../components/UserIntro";
import UserBooks from "../components/UserBooks";

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

export default class UserPage extends Component {

    static navigatorStyle = {
        navBarNoBorder: true,
        topBarElevationShadowEnabled: false,
        topBarBorderColor: '#FFF',
    };

    static appStyle = {

    };

    constructor(props) {
        super(props);
        this.state = {
            isMyself: props.isMyself,
            index: props.isMyself ? 1 : 0,
            routes: [
                { key: 'user', title: '简介' },
                { key: 'diary', title: '日记' },
                { key: 'notebooks', title: '日记本' },
            ],
            visible: true,  //用以修复tab滚动问题，tab 和 nav 组件不兼容
            tabLoad: !this.props.tabOpen, //是否加载tab页，如果是从底部 tab 打开，则默认不加载，等点击底部tab事件触发再加载
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this.setState({
                visible: true,
                tabLoad: true,
            });
            this.loadNavButtons().done();   //用以修复 android nav button 加载不上的问题
        }
        if (event.id === 'willDisappear') {
            this.setState({
                visible: false
            });
        }
        if (event.type === 'NavBarButtonPress' && event.id === 'follow') {
            this.updateRelation().done();
        }
    }

    async updateRelation() {
        try {
            if (this.followed) {
                await Api.deleteFollow(this.getId());
            } else {
                await Api.addFollow(this.getId());
            }
        } catch (err) {
            Alert.alert(this.followed ? '取消关注失败':'关注失败', err.message);
        }
        await this.loadNavButtons();
    }


    componentDidMount() {
        if (this.props.isMyself) {
            this.loginListener = DeviceEventEmitter.addListener(Events.login, () => {
                this.diaryList && this.diaryList.refresh()  //页面懒加载，可能list还没加载完成
            });
            this.deleteListener = DeviceEventEmitter.addListener(Events.diaryDelete, () => {
                this.diaryList && this.diaryList.refresh()
            });
        }
        this.loadNavButtons().done();
    }

    async loadNavButtons() {
        console.log('loadNavButtons');
        if (this.props.isMyself) {
            console.log('loadNavButtons isMyself');
            this.props.navigator.setButtons({
                rightButtons: [{ id: 'setting', icon: LocalIcons.navButtonSetting }],
                animated: false
            });
        } else {
            const uid = this.getId();
            const rel = await Api.getRelation(uid);
            this.followed = rel;
            const icon = rel ? LocalIcons.navButtonFollowSelected : LocalIcons.navButtonFollow;
            this.props.navigator.setButtons({
                rightButtons: [{ id: 'follow', icon: icon, disableIconTint: true }],
                animated: true
            });
        }
    }

    getId() {
        return this.props.user != null ? this.props.user.id : this.props.user_id;
    }

    componentWillUnmount() {
        if (this.loginListener) {
            this.loginListener.remove();
            this.deleteListener.remove();
        }
    }


    _renderScene = SceneMap({
        user: () => <UserIntro
            user={this.props.user}
            userId={this.getId()}
            mySelf={this.props.isMyself}
        />,
        diary: () => <DiaryList
            ref={(r) => this.diaryList = r }
            tabLabel="日记"
            dataSource={new UserDiaryData(this.getId())}
            navigator={this.props.navigator}
            editable={this.props.isMyself}
        />,
        notebooks: () => <UserBooks
            ref={(r) => this.notebooks = r }
            userId={this.getId()}
            mySelf={this.props.isMyself}
            navigator={this.props.navigator}
        />,
    });

    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => {
        // this.props.navigator.setStyle({
        //     navBarCustomView: 'TabBar',
        //     navBarComponentAlignment: 'center',
        //     navBarCustomViewInitialProps: {
        //         navigator: this.props.navigator,
        //         ...props,
        //         pressColor: colors.textSelect,
        //         // onTabPress={this._handleTabItemPress}
        //         renderLabel: _renderLabel(props),
        //         indicatorStyle: styles.indicator,
        //         tabStyle: styles.tab,
        //         style: styles.tabbar
        //     }
        // });
        // return null;
        return <TabBar
            {...props}
            pressColor="transparent"
            indicatorStyle={styles.indicator}
            renderLabel={_renderLabel(props)}
            tabStyle={styles.tab}
            style={styles.tabbar}
        />
    };

    _renderPager = props => <TabViewPagerPan {...props} />;

    render() {
        if (!this.state.tabLoad) return <View />;
        return (
                <TabViewAnimated
                    style={[styles.container, {flex: this.state.visible ? 1 : 0}]}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={initialLayout}
                />
        )
    }
}

_renderLabel = props => ({ route, index }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
        inputIndex => (inputIndex === index ? colors.primary : '#222')
    );
    const color = props.position.interpolate({
        inputRange,
        outputRange,
    });

    return (
        <Animated.Text style={[styles.label, { color }]}>
            {route.title}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    indicator: {
        backgroundColor: colors.primary,
    },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        margin: 8,
        marginTop: -6,
    },
    tabbar: {
        backgroundColor: colors.navBackground,
        justifyContent: 'center',
    },
    tab: {
        flex: 1,
        opacity: 1,
    },
    page: {
        backgroundColor: '#f9f9f9',
    },
});