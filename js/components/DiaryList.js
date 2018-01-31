import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    InteractionManager, Platform, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Diary from "Diary";
import {Divider} from "react-native-elements";
import Toast from 'react-native-root-toast';
import {colors} from "../Styles";
import {NavigationActions, withNavigation} from "react-navigation";
import Touchable from "./TPTouchable";
import ErrorView from "./ErrorView";
import PropTypes from 'prop-types';
import PhotoPage from "../pages/PhotoPage";

export default class DiaryList extends Component {

    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        ...FlatList.propTypes
    };

    constructor(props) {
        super(props);
        this.dataSource = props.dataSource;
        this.state = {
            diaries: [],
            more: false,
            loading_more: false,
            refreshing: false,
            error: false,
        };
    }

    componentWillMount(){
        //TODO:检查token是否存在
        InteractionManager.runAfterInteractions(() => {
            this.refresh();
        });
    }

    async refresh() {
        if (this.state.refreshing) {
            //TODO:如果有 load_more, 取消 load_more 回调
            return;
        }

        this.setState({refreshing: true});
        let data = null;
        try {
            data = await this.dataSource.refresh()
        } catch (e) {
            if (e.code && e.code === 401) {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login'})
                    ]
                });
                this.props.navigation.dispatch(resetAction);
                return;
            } else {
                console.log(e);
            }
        }
        if (!data) {    //加载失败
            this.setState({
                diaries: [],
                last_id: 0,
                more: false,
                refreshing: false,
                loading_more: false,
                error: true,
            });
            return;
        }
        let diaries = data.list;
        let old = this.state.diaries;
        if (old.length > 0 && diaries.length > 0 && old[0].id === diaries[0].id) {
            this.showToast('没有新内容');
        }
        this.setState({
            diaries: diaries,
            refreshing: false,
            more: data.more,
            loading_more: false,
            errorPage: false,
            loadMoreError: false,
        });
    }

    async loadMore() {

        if (this.state.refreshing || this.state.loading_more) {
            return;
        }

        this.setState({loading_more: true, error: false});
        let data = null;
        try {
            data = await this.dataSource.load_more()
        } catch (e) {
            console.log(e);
        }
        if (!data) {    //加载失败
            this.setState({
                loading_more: false,
                error: true,
            });
            return;
        }
        let diaries = data.list;
        this.setState({
            diaries: diaries,
            refreshing: false,
            more: data.more,
            loading_more: false,
            last_id: data.last_id,
            errorPage: false,
            loadMoreError: false,
        });
    }

    onRefresh() {
        this.refresh();
    }

    showToast(msg) {
        Toast.show(msg, {
            duration: 2500,
            position: -80,
            shadow: false,
            hideOnPress: true,
        });
    }

    onPhotoPress(diary) {
        let url = diary.photoUrl.replace('w640', 'w640-q75');
        // this.props.navigation.navigate('Photo', {url: url})
        PhotoPage.open({url: url});
    }

    onDiaryPress(diary) {
        this.props.navigator.push({
            screen: 'login',
            title: '登录'
        });
    }

    onIconPress(diary) {
        this.props.navigation.navigate('User', {user: diary.user})
        //this.props.navigation.navigate('DiaryDetail', {diary: item})
    }

    onActionPress() {

    }

    render() {
        if (this.state.diaries.length === 0) {
            return this.renderEmpty();
        }
        console.log('render: ');
        // console.log(this.state);
        return (
            <FlatList
                style={{backgroundColor: 'white'}}
                data={this.state.diaries}
                keyExtractor={(item, index) => {
                    return item.id
                }}
                renderItem={({item}) => {
                    return (
                        <Touchable onPress={this.onDiaryPress.bind(this)}>
                            <Diary diary={item} showAllContent={false}
                                   onPhotoPress={this.onPhotoPress.bind(this)}
                                   onIconPress={this.onIconPress.bind(this)}
                                   onActionPress={this.onActionPress.bind(this)}
                            />
                        </Touchable>
                    )
                }}
                ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                onRefresh={this.onRefresh.bind(this)}
                refreshing={this.state.refreshing}
                ListFooterComponent={this.renderFooter()}
                automaticallyAdjustContentInsets={true}
                onEndReached={this.state.more ? this.loadMore.bind(this) : null}
                onEndReachedThreshold={0.5}
                {...this.props}
                // onEndReachedThreshold={0.1}
                // ListEmptyComponent={this.renderEmpty()}
            />
        )
    }

    renderEmpty() {
        if (this.state.refreshing) {
            return (
                <View style={{alignItems:'center', justifyContent: 'center' , height: '100%'}}>
                    <ActivityIndicator animating={true} color={colors.primary} size="large"/>
                </View>
            )
        }
        let text = this.state.error ? '出错了 :(':'今天还没有日记，马上写一篇吧';
        return (
            <ErrorView text={text} buttonText="刷新一下" onButtonPress={this.refresh.bind(this)}/>
        );
    }

    renderFooter() {
        if (this.state.refreshing || this.state.diaries.length === 0) {
            return null;
        }

        if (this.state.error) {
            return (
                <View style={{height: 60, justifyContent: "center", alignItems: "center", paddingBottom: 15}}>
                    <TouchableOpacity style={{marginTop: 15}}
                                      onPress={() => {
                                          this.loadMore();
                                      }}>
                        <Text style={{color: colors.primary}}>加载失败,请点击重试</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!this.state.more) {
            return (
                <View style={{ height: 100, justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
                    <Text style={{color: colors.inactiveText, fontSize: 12}}>——  THE END  ——</Text>
                </View>
            );
        }

        return (
            <View style={{height: 60, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator animating={true} color={colors.primary} size={Platform.OS === 'android' ? 'large' : 'small'}/>
            </View>
        );
    }
}