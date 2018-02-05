import React, { Component } from 'react';
import {Text, View, StyleSheet, Animated} from "react-native";
import DiaryList from "../components/DiaryList";
import UserDiaryData from "../common/UserDiaryData";
import LocalIcons from "../common/LocalIcons";
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {colors} from "../Styles";
var ScrollableTabView = require('react-native-scrollable-tab-view');


const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

export default class UserPage extends Component {

    static navigatorStyle = {
        // navBarHidden: true,
        navBarHideOnScroll: true,
    };

    static get navigatorButtons() {
        //TODO:也可以通过 setButtons 设置
        return {
            rightButtons: [{
                id: "follow",
                icon: LocalIcons.navButtonFollowSelected,
                buttonColor: 'red'
            }],
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            isMyself: true,
            index: 0,
            routes: [
                { key: 'diary', title: '日记' },
                { key: 'notebooks', title: '日记本' },
                { key: 'user', title: '简介' }
            ],
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //     let time = Math.random();
        //     console.log("8888888888888888888888", time);
        //     this.props.navigator.setStyle({
        //         navBarCustomView: 'UserHeader',
        //         navBarComponentAlignment: 'center',
        //         navBarCustomViewInitialProps: {title: time, navigator: this.props.navigator}
        //     });
        // }, 0);
    }


    _renderScene = SceneMap({
        diary: () => <DiaryList
            tabLabel="日记"
            dataSource={new UserDiaryData()}
            navigator={this.props.navigator}
            editable={true}
        />,
        notebooks: () => <View tabLabel="简介"><Text>1</Text></View>,
        user: () => <View tabLabel="日记本"><Text>2</Text></View>
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
        // return (
        //     <TabBar
        //         {...props}
        //         pressColor={colors.textSelect}
        //         renderLabel={_renderLabel(props)}
        //         indicatorStyle={styles.indicator}
        //         tabStyle={styles.tab}
        //         style={styles.tabbar}
        //     />
        // );
        // return null;
        return <TabBar
            {...props}
            pressColor={colors.textSelect}
            indicatorStyle={styles.indicator}
            renderLabel={_renderLabel(props)}
            tabStyle={styles.tab}
            style={styles.tabbar}
        />
    };

    render() {
        return (
                <TabViewAnimated
                    style={{flex: 1, backgroundColor: '#FFFFFF'}}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
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
    },
    indicator: {
        backgroundColor: colors.primary,
    },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        margin: 8,
    },
    tabbar: {
        // flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        // borderBottomColor: colors.line,
        // borderBottomWidth: StyleSheet.hairlineWidth,
    },
    tab: {
        flex: 1,
        opacity: 1,
        // color: colors.primary
    },
    page: {
        backgroundColor: '#f9f9f9',
    },
});