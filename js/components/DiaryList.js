import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    InteractionManager, Platform, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import * as Api from "../Api";
import Diary from "./Diary";
import {Divider} from "react-native-elements";
import Toast from 'react-native-root-toast';
import {colors} from "../Styles";
import Button from "./Button";
import {NavigationActions, withNavigation} from "react-navigation";
import Touchable from "./Touchable";

@withNavigation
export default class DiaryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diaries: [],
            more: false,
            last_id: 0,
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
            data = await this.getList(0);
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
                console.log(e); //TODO: toast 提示加载失败
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
        let diaries = data.diaries;
        let old = this.state.diaries;
        if (old.length > 0 && diaries.length > 0 && old[0].id === diaries[0].id) {
            this.showToast('没有新内容');
        }
        this.setState({
            diaries: diaries,
            refreshing: false,
            more: data.more,
            loading_more: false,
            last_id: data.last_id,
            errorPage: false,
            loadMoreError: false,
        });
        //         this.refs.list.scrollTo({x: 0, y: -60, animated: false});
    }

    async loadMore() {

        if (this.state.refreshing || this.state.loading_more) {
            return;
        }
        console.log('loadMore', this.state.last_id);
        console.log(this.state);

        this.setState({loading_more: true, error: false});
        let data = null;
        try {
            data = await this.getList(this.state.last_id);
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
        let diaries = data.diaries.length > 0 ? this.state.diaries.concat(data.diaries) : this.state.diaries;
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

    async getList(last_id) {
        let pageSize = 11;
        let data = await Api.getTodayDiaries(0, pageSize, last_id);
        let more = data.diaries.length === pageSize;
        // console.log(data);
        return {
            diaries: data.diaries.slice(0, pageSize - 1),
            more: data.diaries.length === pageSize,
            last_id: more ? data.diaries[pageSize - 1].id : 0,
        };
    }

    showToast(msg) {
        Toast.show(msg, {
            duration: 2500,
            position: -80,
            shadow: false,
            hideOnPress: true,
        });
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
                        <Touchable onPress={() => this.props.navigation.navigate('DiaryDetail', {diary: item})}>
                            <Diary key={item.id} diary={item} showComment={true}/>
                        </Touchable>
                    )
                }}
                ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                onRefresh={this.onRefresh.bind(this)}
                refreshing={this.state.refreshing}
                onEndReached={this.loadMore.bind(this)}
                ListFooterComponent={this.renderFooter()}
                ListHeaderComponent={() => {
                    return (<View style={{paddingTop: 35, paddingHorizontal: 20}}>
                        <Text style={{color: colors.inactiveText}}>1月27日</Text>
                        <Text style={{fontSize:30 }}>Today</Text>
                    </View>)
                }}
                automaticallyAdjustContentInsets={true}
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
        let text = this.state.error ? '出错了!':'今天还没有日记，马上写一篇吧';
        return (
            <View style={{alignItems:'center', justifyContent: 'center' , height: '100%'}}>
                <Text style={{paddingBottom: 15, color: colors.text}}>{text}</Text>
                <Button fontSize={14} title="  刷新一下  " onPress={this.refresh.bind(this)} />
            </View>
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