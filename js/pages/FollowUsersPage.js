import React, { Component } from 'react';
import {
    View,
    Platform,
    ListView,
    InteractionManager,
    RefreshControl,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    SegmentedControlIOS, StyleSheet, Dimensions, Alert
} from 'react-native';
import * as Api from '../Api'
import UserPage from './UserPage'
import {colors as TPColors} from "../Styles";
import errorView from "../components/ErrorView";
import PropTypes from 'prop-types';
import TPTouchable from "../components/TPTouchable";
import {SceneMap, TabBar, TabViewAnimated, TabViewPagerPan} from "react-native-tab-view";
import UserDiaryData from "../common/UserDiaryData";
import Ionicons from 'react-native-vector-icons/Ionicons.js';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

export default class FollowUsersPage extends Component {

    static navigatorStyle = {
        navBarNoBorder: true,
        topBarElevationShadowEnabled: false,
        topBarBorderColor: '#FFF',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: true,  //用以修复tab滚动问题，tab 和 nav 组件不兼容
            loadedFollow: true,
            loadedFollowReverse: false,
            index: 0,
            routes: [
                { key: 'list1', title: '我关注的' },
                { key: 'list2', title: '关注我的' },
            ],
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this.setState({
                visible: true,
                tabLoad: true,
            });
        }
        if (event.id === 'willDisappear') {
            this.setState({
                visible: false
            });
        }
    }

    _renderScene = SceneMap({
        list1: () => <FollowList
            navigator={this.props.navigator}
            onLoadDate={(page, pageSize) => {
                return Api.getRelationUsers(page, pageSize);
            }}
            onDeletePress={(user) => {
                Api.deleteFollow(user.id)
            }}
        />,
        list2: () => <FollowList
            navigator={this.props.navigator}
            onLoadDate={(page, pageSize) => {
                return Api.getRelationReverseUsers(page, pageSize);
            }}
            onDeletePress={(user) => {
                Api.deleteFollowBy(user.id)
            }}
        />,
    });

    _renderHeader = props => {
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

    _handleIndexChange = index => this.setState({ index });

    render() {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    indicator: {
        backgroundColor: TPColors.primary,
    },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        margin: 8,
        marginTop: -6,
    },
    tabbar: {
        backgroundColor: TPColors.navBackground,
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

class FollowList extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            users: [],
            usersDateSource: ds,
            page: 1,
            page_size: 20,
            more: false,
            loading_more: false,
            refreshing: false,
            emptyList: false,
            errorPage: false,
            loadMoreError: false,
        };
    }

    componentWillMount(){
        InteractionManager.runAfterInteractions(() => {
            this._loadUsers(this.state.page);
        });
    }

    _onRefresh() {
        this._loadUsers(1);
    }

    async _loadUsers(page) {
        if (page === 1 && this.state.refreshing === false) {
            this.setState({refreshing: true});
        }
        if (page > 1) {
            this.setState({ loading_more: true });
        }

        let data;
        try {
            data = await this.props.onLoadDate(page, this.state.page_size)
        } catch (err) {
            //Alert.alert('加载失败', err.message);
        }

        //console.log(data);

        if (data) {
            let users;
            if (page === 1) {
                users = data.users;
            } else {
                users = this.state.users.concat(data.users);
            }
            const ids = users.map(it => it.id);

            this.setState({
                users: users,
                usersDateSource: this.state.usersDateSource.cloneWithRows(this.arrayToMap(users, it => it.id), ids),
                page: page,
                page_size: this.state.page_size,
                more: data.users.length === this.state.page_size,
                loading_more: false,
                refreshing: false,
                emptyList: false,
                errorPage: false,
                loadMoreError: false,
            });
        }else {
            if (page === 1) {
                const users = [];
                const ids = [];
                this.setState({
                    users: users,
                    usersDateSource: this.state.usersDateSource.cloneWithRows(this.arrayToMap(users, it => it.id), ids),
                    page: 1,
                    more: false,
                    refreshing: false,
                    loading_more: false,
                    emptyList: false,
                    errorPage: true,
                    loadMoreError: false,
                });
            } else {
                this.setState({
                    refreshing: false,
                    loading_more: false,
                    loadMoreError: true,
                });
            }
        }
    }

    arrayToMap(array, keyGet) {
        let ret = {};
        array.forEach(it => ret[keyGet(it)] = it);
        return ret;
    }

    _onEndReached(ignoreError = false) {
        if(this.state.refreshing || this.state.loading_more || !this.state.more) {
            return;
        }
        if (!ignoreError && this.state.loadMoreError) {
            return;
        }
        this._loadUsers(this.state.page + 1)
    }

    _onUserPress(user) {
        this.props.navigator.push({
            screen: 'User',
            title: user.name,
            passProps: {
                user: user
            }
        })
    }

    _onDeletePress(user) {
        Alert.alert('提示', '确定删除关注?',[
            {text: '删除', style: 'destructive', onPress: () => {
                    const users = this.state.users.filter((it) => it.id !== user.id);
                    const ids = users.map(it => it.id);
                    this.setState({
                        users: users,
                        usersDateSource: this.state.usersDateSource.cloneWithRows(this.arrayToMap(users, it => it.id), ids),
                    });
                    this.props.onDeletePress(user);
            }},
            {text: '取消', onPress: () => console.log('OK Pressed!')},
        ]);
    }

    render() {
        return (
            <ListView
                ref="list"
                dataSource={this.state.usersDateSource}
                renderRow={this.renderUser.bind(this)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={[TPColors.refreshColor]}
                        tintColor={TPColors.refreshColor} />
                }
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={50}
                renderFooter={this.renderFooter.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                style={this.props.style}
                rightOpenValue={-60}
                disableRightSwipe={true}
            />
        )
    }

    renderUser(user) {
        return (
            <TPTouchable
                onPress={() => this._onUserPress(user)}
                underlayColor="#efefef"
                key={user.id}
            >
                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: TPColors.line, alignItems: 'center', backgroundColor: 'white'}}>
                    <Image source={{uri: user.iconUrl}} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 15, marginLeft: 20 }} />
                    <Text style={{flex: 1}}>{user.name}</Text>
                    <TPTouchable onPress={this._onDeletePress.bind(this, user)}>
                        <Ionicons name="md-close"
                                size={20}
                                  style={{padding: 22}}
                                color={TPColors.inactiveText}/>
                    </TPTouchable>
                </View>
            </TPTouchable>
        );
    }

    renderFooter() {
        //todo:按照日记列表更改
        if (this.state.errorPage) {
            return <ErrorView text="加载失败了 :(" />
        }

        if (this.state.emptyList) {
            return (<ErrorView text="还没有关注任何人" />)
        }

        if(!this.state.loading_more && this.state.loadMoreError) {
            return (
                <View style={{ height: 60, justifyContent: "center", alignItems: "center", paddingBottom: 15}}>
                    <TouchableOpacity style={{marginTop: 15}} onPress={this._onEndReached.bind(this, true)}>
                        <Text style={{color: TPColors.light}}>加载失败,请重试</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (this.state.refreshing || this.state.users.length === 0) {
            return null;
        }

        if (this.state.more) {
            return (
                <View style={{ height: 60, justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator animating={true} color={TPColors.light} size={Platform.OS === 'android' ? 'large' : 'small'} />
                </View>
            )
        } else {
            return (
                <View style={{ height: 100, justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
                    <Text style={{color: TPColors.inactiveText, fontSize: 12}}>——  THE END  ——</Text>
                </View>
            )
        }
    }
}

FollowList.propTypes = {
    onLoadDate: PropTypes.func,
    onDeletePress: PropTypes.func,
};