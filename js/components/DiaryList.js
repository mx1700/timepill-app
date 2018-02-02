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
        navigator: PropTypes.object.isRequired,
        showBookSubject: PropTypes.bool,
        showComment: PropTypes.bool,
        showAllContent: PropTypes.bool,
        editable: PropTypes.bool,
        ...FlatList.propTypes
    };

    static defaultProps = {
        showBookSubject: true,
        showComment: true,
        showAllContent: false,
        editable: false,
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
                this.props.navigator.resetTo({
                    screen: "Login",
                    title: "登录"
                });
                this.props.navigator.switchToTab({
                    tabIndex: 0
                });
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
        this.props.navigator.push({
            screen: 'Photo',
            title: '照片',
            passProps: { url: url },
            animationType: 'fade'
        });
    }

    onDiaryPress(diary) {
        this.props.navigator.push({
            screen: 'DiaryDetail',
            title: '日记详情',
            passProps: { diary: diary }
        });
        //TODO:只传 id 有问题
    }

    onIconPress(diary) {
        // this.props.navigation.navigate('User', {user: diary.user})
        this.props.navigator.push({
            screen: 'User',
            // title: '日记详情',
            passProps: { user: diary.user }
        });
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
                        <Touchable onPress={() => this.onDiaryPress(item)}>
                            <Diary diary={item}
                                   onPhotoPress={this.onPhotoPress.bind(this)}
                                   onIconPress={this.onIconPress.bind(this)}
                                   onActionPress={this.onActionPress.bind(this)}
                                   showBookSubject={this.props.showBookSubject}
                                   showComment={this.props.showComment}
                                   showAllContent={this.props.showAllContent}
                                   editable={this.props.editable}
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