import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    InteractionManager, Platform, StyleSheet, Text, TouchableOpacity, View,
    Alert,
} from 'react-native';
import Diary from "Diary";
import {Divider} from "react-native-elements";
import Toast from 'react-native-root-toast';
import {colors} from "../Styles";
import Touchable from "./TPTouchable";
import ErrorView from "./ErrorView";
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet-api';
import * as Api from "../Api";

export default class DiaryList extends Component {

    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired,
        showBookSubject: PropTypes.bool,
        showComment: PropTypes.bool,
        showAllContent: PropTypes.bool,
        editable: PropTypes.bool,
        openLogin: PropTypes.bool,  //如果接口返回没有登录，是否打开登录页
        autoLoad: PropTypes.bool,   //是否自动加载数据
        onRefreshList: PropTypes.func,
        emptyMessage: PropTypes.string,
        isRefresh: PropTypes.bool,
        ...FlatList.propTypes
    };

    static defaultProps = {
        showBookSubject: true,
        showComment: true,
        showAllContent: false,
        editable: false,
        openLogin: false,
        autoLoad: true,
        emptyMessage: '今天还没有日记，马上写一篇吧',
        isRefresh: true,
    };

    scrollY = 0;

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

    componentDidMount(){
        if (this.props.autoLoad) {
            InteractionManager.runAfterInteractions(() => {
                this.refresh().done();
            });
        }
    }

    scrollToTop() {
        if (!this.list) return;

        if (this.scrollY <= 10) {
            this.refresh();
            return;
        }

        this.list.scrollToOffset({
            offset: 0,
            animated: true,
        });
    }

    async refresh() {
        if (this.state.refreshing) {
            return;
        }

        this.setState({refreshing: true});

        if (this.props.onRefreshList) {
            this.props.onRefreshList();
        }

        let data = null;
        try {
            //const start = new Date().getTime();
            data = await this.dataSource.refresh();
            // const end = new Date().getTime();
            // const timer = end - start;
            // if (timer < 1000 && this.state.diaries.length > 0) {
            //     await new Promise((resolve, reject) => {
            //         setTimeout(resolve, 1000 - timer)
            //     })
            // }
        } catch (e) {
            if (e.code && e.code === 401) {
                if (this.props.openLogin) {
                    this.props.navigator.showModal({
                        screen: "Login",
                        title: "登录"
                    });
                }

                this.setState({
                    diaries: [],
                    last_id: 0,
                    more: false,
                    refreshing: false,
                    loading_more: false,
                    error: true,
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
        if (!this.props.editable && old.length > 0 && diaries.length > 0 && old[0].id === diaries[0].id) {
            //!this.props.editable 表明不是自己的日记页
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
        this.refresh().done();
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
        this.props.navigator.push({
            screen: 'Photo',
            title: '照片',
            passProps: { url: diary.photoUrl },
            animationType: 'fade'
        });
    }

    onDiaryPress(diary) {
        this.props.navigator.push({
            screen: 'DiaryDetail',
            title: '日记详情',
            passProps: { diary: diary }
        });
    }

    onIconPress(diary) {
        this.props.navigator.push({
            screen: 'User',
            title: diary.user.name,
            passProps: { user: diary.user }
        });
    }

    onActionPress(diary) {
        ActionSheet.showActionSheetWithOptions({
            options:['修改','删除', '取消'],
            cancelButtonIndex:2,
            destructiveButtonIndex: 1,
        }, (index) => {
            if(index === 0) {   //修改
                this.props.navigator.push({
                    screen: 'Write',
                    title: '修改日记',
                    passProps: {
                        diary: diary
                    }
                });
            } else if (index === 1) {
                Alert.alert('提示', '确认删除日记?',[
                    {text: '删除', style: 'destructive', onPress: () => this._deleteDiary(diary)},
                    {text: '取消', onPress: () => console.log('OK Pressed!')},
                ]);
            }
        });
    }

    async _deleteDiary(diary) {
        try {
            await Api.deleteDiary(diary.id);
            Toast.show("日记已删除", {
                duration: 2000,
                position: -80,
                shadow: false,
                hideOnPress: true,
            });
            await this.refresh()
        } catch (err) {
            Alert.alert('删除失败', err.message)
        }
    }

    render() {
        if (this.state.diaries.length === 0) {
            return this.renderEmpty();
        }
        return (
            <View>
                <FlatList
                    ref={(r) => { this.list = r; }}
                    style={{backgroundColor: 'white', height: '100%'}}
                    data={this.state.diaries}
                    keyExtractor={(item, index) => {
                        return item.id.toString()
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
                    onRefresh={this.props.isRefresh ? this.onRefresh.bind(this) : null}
                    refreshing={this.state.refreshing}
                    ListFooterComponent={this.renderFooter()}
                    automaticallyAdjustContentInsets={true}
                    onEndReached={this.state.more ? this.loadMore.bind(this) : null}
                    onEndReachedThreshold={2}
                    {...this.props}
                    // onEndReachedThreshold={0.1}
                    // ListEmptyComponent={this.renderEmpty()}
                    onScroll={(event) => {
                        this.scrollY = event.nativeEvent.contentOffset.y;
                    }}
                >
                </FlatList>
                <ActionSheet/>
            </View>
        )
    }

    renderEmpty() {
        if (this.state.refreshing) {
            return (
                <View style={{alignItems:'center', justifyContent: 'center' , height: '100%'}}>
                    <ActivityIndicator animating={true} color={colors.primary} size={Platform.OS === 'android' ? 'large' : 'small'}/>
                </View>
            )
        }
        let text = this.state.error ? '出错了 :(' : this.props.emptyMessage;
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