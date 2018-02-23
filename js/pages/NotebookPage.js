import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    RefreshControl,
    ActivityIndicator,
    Text,
    InteractionManager,
    View,
    Image,
    TouchableOpacity,
    ListView
} from 'react-native';
import * as Api from '../Api'
import {colors} from '../Styles'
import Diary from '../components/Diary'
import ErrorView from '../components/ErrorView'
import moment from 'moment'
import Touchable from "../components/TPTouchable";
import LocalIcons from "../common/LocalIcons";

export default class NotebookPage extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.state = {
            diaries: {},
            diariesDateSource: ds,
            page: 1,
            page_size: 20,
            more: false,
            loading_more: false,
            refreshing: true,
            emptyList: false,
            errorPage: false,
            loadMoreError: false,
            isSelf: false,
            notebook: this.props.notebook
        };
    }

    componentDidMount(){
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this._loadSelf().done();
        InteractionManager.runAfterInteractions(() => {
            this._loadDiaries(this.state.page).done();
        });
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if(event.id === 'setting') {
                //TODO:修改日记本页面
                this.props.navigator.push({
                    screen: 'NotebookAdd',
                    title: '创建日记本',
                    passProps: {
                        notebook: this.state.notebook
                    }
                });
            }
        }
    }

    _onRefresh() {
        this._loadDiaries(1).done()
    }

    async _loadSelf() {
        const user = await Api.getSelfInfoByStore();
        const isSelf = this.state.notebook.user_id === user.id;
        this.setState({
            isSelf: isSelf
        });

        if(isSelf) {
            this.props.navigator.setButtons({
                rightButtons: [{ id: 'setting', icon: LocalIcons.navButtonNotebookSetting }],
                animated: false
            });
        }
    }

    async _loadDiaries(page) {
        if (page === 1 && this.state.refreshing === false) {
            this.setState({refreshing: true});
        }
        if (page > 1) {
            this.setState({ loading_more: true });
        }
        let data = null;
        try {
            data = await Api.getNotebookTodayDiaries(this.state.notebook.id, page, this.state.page_size);
        } catch(e) {
            console.log(e);
        }

        if (data) {
            if (page === 1) {
                this.state.diaries = {};
            }

            const today = moment().format('YYYY年M月D日');
            const diaries = data.items.reduce((list, item) => {
                const [year, month, day] =
                    item.created.substr(0, 10).split('-')
                    .map(it => Number(it));

                let date = `${year}年${month}月${day}日`;
                if (date === today) {
                    date = '今天';
                }
                if (list[date] === undefined) {
                    list[date] = [];
                }
                list[date].push(item);
                return list;
            }, this.state.diaries);

            this.setState({
                diaries: diaries,
                diariesDateSource: this.state.diariesDateSource.cloneWithRowsAndSections(diaries),
                page: data.page,
                more: data.items.length === this.state.page_size,
                refreshing: false,
                loading_more: false,
                emptyList: page === 1 && data.items.length === 0,
                errorPage: false,
                loadMoreError: false,
            });
        } else {
            if (page === 1) {
                diaries = {};
                this.setState({
                    diaries: diaries,
                    diariesDateSource: this.state.diariesDateSource.cloneWithRowsAndSections(diaries),
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

    _onEndReached(ignoreError = false) {
        if(this.state.refreshing || this.state.loading_more || !this.state.more) {
            return;
        }
        if (!ignoreError && this.state.loadMoreError) {
            return;
        }
        this._loadDiaries(this.state.page + 1);
    }

    _onDiaryPress(diary) {
        this.props.navigator.push({
            screen: 'DiaryDetail',
            title: '日记详情',
            passProps: { diary: diary },
        });
    }

    _onActionPress(diary) {
        alert('action')
    }

    onPhotoPress(diary) {
        this.props.navigator.push({
            screen: 'Photo',
            title: '照片',
            passProps: { url: diary.photoUrl },
            animationType: 'fade'
        });
    }

    _toEditNotebookPage() {
        // this.props.navigator.push({      //TODO
        //     name: 'NotebookAddPage',
        //     component: NotebookAddPage,
        //     params: {
        //         notebook: this.state.notebook,
        //         onSaved: (book) => {
        //             this.setState({notebook: book})
        //         }
        //     }
        // })
    }

    render() {
        if (this.state.emptyList) {
            return (<ErrorView text="没有日记"/>);
        }

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                {this.renderList()}
            </View>
        );
    }

    renderList() {
        return (
            <ListView
                dataSource={this.state.diariesDateSource}
                renderRow={(rowData) =>
                    <Touchable onPress={() => this._onDiaryPress(rowData)}>
                        <Diary diary={rowData}
                               editable={this.props.editable}
                               showBookSubject={false}
                               deletable={this.props.deletable}
                               onActionPress={this._onActionPress.bind(this)}
                               onPhotoPress={this.onPhotoPress.bind(this)}
                               navigator={this.props.navigator} />
                    </Touchable>
                }
                renderSectionHeader={(s, id) =>
                    <View style={{
                        backgroundColor: '#F9F9F9',
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                    }}>
                        <Text style={{color: colors.text}}>{id}</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={[colors.refreshColor]}
                        tintColor={colors.refreshColor} />
                }
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={200}
                renderFooter={this.renderFooter.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                    <View key={`${sectionID}-${rowID}`} style={{borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: colors.line, marginHorizontal: 15}} />}
                style={this.props.style}
            />
        );
    }

    renderFooter() {
        if (this.state.errorPage) {
            return <ErrorView text="日记加载失败了 :(" button="重试一下" onButtonPress={this._onRefresh.bind(this)}/>
        }

        if (!this.state.loading_more && this.state.loadMoreError) {
            return (
                <View style={{height: 60, justifyContent: "center", alignItems: "center", paddingBottom: 15}}>
                    <TouchableOpacity style={{marginTop: 15}} onPress={this._onEndReached.bind(this, true)}>
                        <Text style={{color: colors.light}}>加载失败,请重试</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (this.state.refreshing || Object.getOwnPropertyNames(this.state.diaries).length === 0) {
            return null;
        }

        if (this.state.more) {
            return (
                <View style={{ height: 60, justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator animating={true} color={colors.light} size="small" />
                </View>
            )
        } else {
            return (
                <View style={{ height: 100, justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
                    <Text style={{color: colors.inactiveText, fontSize: 12}}>——  THE END  ——</Text>
                </View>
            )
        }
    }
}