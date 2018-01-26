import React from "react";
import {
    View, InteractionManager, Alert, ActionSheetIOS, Clipboard, ActivityIndicator, StyleSheet,
    TextInput, TouchableOpacity, ListView, FlatList, Text
} from "react-native";
import moment from 'moment';
import * as Api from "../Api";
import * as TimeHelper from "../common/TimeHelper";
import ErrorView from "../components/ErrorView";
import {colors} from '../Styles'
import Icon from 'react-native-vector-icons/Ionicons.js';
import KeyboardSpacer from "react-native-keyboard-spacer";
import Diary from "../components/Diary";
import Touchable from "../components/Touchable";
import {Avatar, Divider} from "react-native-elements";


const DefaultInputHeight = 55;

export default class DiaryDetail extends React.Component {
    // static navigationOptions = ({ navigation }) => ({
    //     title: `Chat with ${navigation.state.params.user}`,
    // });
    static navigationOptions = {
        title: "日记详情"
    };

    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        let diary = params.diary;
        this.diary_id = params.diary_id;

        this.state = {
            comments: [],
            loading_comments: true,
            comment_content: '',
            comment_sending: false,
            reply_user_id: 0,
            reply_user_name: '',
            comment_count: diary ? diary.comment_count : 0,
            diary: diary,
            commentsLoadingError: false,
            diaryLoadingError: false,
            isMy: null,
            inputHeight: DefaultInputHeight,
        };
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            let load;
            if (!this.state.diary) {
                load = this._loadDiary();
            } else {
                load = this._loadIsMy();
            }
            Promise.all([this._loadComments(), load])
                .then(() => {
                    if (this.props.new_comments) {
                        this._scrollToBottom();
                    }
                });
        });
        Api.getSelfInfoByStore().then(info => {
            this.selfInfo = info;
        })
    }

    getDiaryId() {
        return this.state.diary ? this.state.diary.id : this.diary_id;
    }

    async _loadIsMy() {
        const user = await Api.getSelfInfoByStore();
        this.setState({
            isMy: this.state.diary.user_id === user.id
        });
    }

    async _loadDiary() {
        this.setState({
            diaryLoadingError: false,
        });

        let diary = null;
        try {
            diary = await Api.getDiary(this.getDiaryId());
        } catch (err) {

        }

        if (diary) {
            this.setState({
                diary: diary,
                comment_count: diary.comment_count,
                diaryLoadingError: false,
            });
            this._loadIsMy();
        } else {
            this.setState({
                diary: null,
                diaryLoadingError: true,
            })
        }
    }

    async _loadComments() {
        this.setState({
            loading_comments: true,
            commentsLoadingError: false,
        });
        let comments = null;
        try {
            comments = await Api.getDiaryComments(this.getDiaryId());
        } catch (e) {
            //console.log(e);
            //有错误试图，不需处理
        }

        if (comments) {
            comments = comments.reverse();
            this.setState({
                comments: comments,
                loading_comments: false,
                comment_count: comments.length,
                commentsLoadingError: false,
            });
        } else {
            comments = [];
            this.setState({
                comments: comments,
                loading_comments: false,
                commentsLoadingError: true,
            });
        }
    }

    _addCommentPress() {
        this.addComment()
    }

    async addComment() {
        let content = this.state.reply_user_name
            ? this.state.comment_content.substr(this.state.reply_user_name.length + 2)
            : this.state.comment_content;

        if (content.length === 0) {
            return;
        }
        this.setState({comment_sending: true});
        let ret = null;
        try {
            ret = await Api.addComment(this.state.diary.id, content, this.state.reply_user_id)
        } catch (err) {
            Alert.alert('回复失败', err.message);
        }

        if (ret) {
            this.state.comments.push(ret);
            this.setState({
                comment_sending: false,
                comment_content: '',
                reply_user_id: 0,
                reply_user_name: '',
                comment_count: this.state.comment_count + 1,
                inputHeight: DefaultInputHeight,
            }, () => {
                this._scrollToBottom();
            });
        } else {
            //Alert.alert('错误','回复失败 -_-!');
            this.setState({
                comment_sending: false,
            });
        }
    }

    _scrollToBottom() {
        /**
         只有指定 initialListSize 足够大时，获取子内容高度才是准确的，不指定时，获取不准确
         */
        // setTimeout(() => {
        //     if(this && this.refs.list) {
        //         const listProps = this.refs.list.scrollProperties;
        //         if (listProps.contentLength < listProps.visibleLength) {
        //             return;
        //         }
        //         const y = listProps.contentLength - listProps.visibleLength;
        //         this.refs.list.scrollTo({x: 0, y: y, animated: true});
        //         //console.log(this.refs.list, listProps)
        //     }
        // }, 500)
    }

    _onCommentPress(comment) {
        if (this.selfInfo && comment.user.id === this.selfInfo.id) {
            //自己不能回复自己
            return;
        }
        let content = this.state.comment_content;
        if (this.state.reply_user_name) {
            content = content.replace('@' + this.state.reply_user_name, '@' + comment.user.name)
        } else {
            content = '@' + comment.user.name + ' ' + content
        }
        this.setState({
            reply_user_id: comment.user.id,
            reply_user_name: comment.user.name,
            comment_content: content,
        });
        if (this.refs.commentInput) {
            this.refs.commentInput.focus();
        }
    }

    _onCommentContentChange(text) {
        //console.log(text);
        if (this.state.reply_user_name === '') {
            this.setState({comment_content: text});
            return
        }
        if (text.startsWith('@' + this.state.reply_user_name + ' ')) {
            this.setState({comment_content: text});
            return
        }
        text = text.substr(this.state.reply_user_name.length + 1);
        this.setState({
            reply_user_id: 0,
            reply_user_name: '',
            comment_content: text,
        })
    }

    _onIconPress(user) {
        // this.props.navigator.push({
        //     name: 'UserPage',
        //     component: UserPage,
        //     params: {
        //         user: user
        //     }
        // })
    }

    _onDiaryIconPress(diary) {
        // this.props.navigator.push({
        //     name: 'UserPage',
        //     component: UserPage,
        //     params: {
        //         user: diary.user
        //     }
        // })
    }

    _onActionPress(diary) {
        ActionSheetIOS.showActionSheetWithOptions({
            options:['修改','删除', '取消'],
            //title: '日记',
            cancelButtonIndex:2,
            destructiveButtonIndex: 1,
        }, (index) => {
            if(index === 0) {
                // this.props.navigator.push({
                //     name: 'WritePage',
                //     component: WritePage,
                //     params: {
                //         diary: diary
                //     }
                // })
            } else if (index === 1) {
                Alert.alert('提示', '确认删除日记?',[
                    {text: '删除', style: 'destructive', onPress: () => this.deleteDiary(diary)},
                    {text: '取消', onPress: () => console.log('OK Pressed!')},
                ]);
            }
        });
    }

    _onCommentActionPress(comment) {
        ActionSheetIOS.showActionSheetWithOptions({
            options:['删除回复', '取消'],
            cancelButtonIndex:1,
            destructiveButtonIndex: 0,
        }, (index) => {
            if(index === 0) {
                Alert.alert('提示', '确认删除回复?',[
                    {text: '删除', style: 'destructive', onPress: () => this.deleteComment(comment).done()},
                    {text: '取消', onPress: () => console.log('OK Pressed!')},
                ]);
            }
        });
    }

    async deleteComment(comment) {
        const newComments = this.state.comments.filter(it => it.id !== comment.id);
        this.setState({
            comments: newComments,
            comment_count: newComments.length,
        });

        try {
            await Api.deleteComment(comment.id);
        } catch(err) {
            Alert.alert('删除失败', err.message);
        }
    }

    _isTodayDiary() {
        const [date, ] = this.state.diary.created.split(' ');
        const [year, month, day] = date.split('-');
        const now = new TimeHelper.now();
        return !(now.getFullYear() !== parseInt(year) ||
            now.getMonth() + 1 !== parseInt(month) ||
            now.getDate() !== parseInt(day));
    }

    _onDiaryMorePress() {
        if (this.state.isMy === true) {
            ActionSheetIOS.showActionSheetWithOptions({
                options: ['修改', '删除', '取消'],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
            }, (index) => {
                if (index === 0) {
                    // this.props.navigator.push({
                    //     name: 'WritePage',
                    //     component: WritePage,
                    //     params: {
                    //         diary: this.state.diary,
                    //         onSuccess: this._editSuccess
                    //     }
                    // })
                } else if (index === 1) {
                    Alert.alert('提示', '确认删除日记?', [
                        {text: '删除', style: 'destructive', onPress: () => this.deleteDiary(this.state.diary)},
                        {text: '取消', onPress: () => console.log('OK Pressed!')},
                    ]);
                }
            });
        } else if(this.state.isMy === false) {
            ActionSheetIOS.showActionSheetWithOptions({
                options: ['举报', '取消'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
            }, (index) => {
                if (index === 0) {
                    Api.report(this.state.diary.user_id, this.state.diary.id)
                        .catch(err => console.log(err));
                    Alert.alert('提示', '感谢你的贡献')
                }
            });
        }
    }

    async deleteDiary(diary) {
        let r;
        try {
            r = await Api.deleteDiary(diary.id);
        } catch (err) {
            Alert.alert('删除失败', err.message);
            return;
        }
        Alert.alert('提示', '日记已删除', [{text: '好', onPress: () =>  this.props.navigator.pop()}]);
        // NotificationCenter.trigger('onDeleteDiary');     //TODO
    }

    _editSuccess = (r) => {
        this.setState({diary: r})
    };

    _onCommentLongPress = (comment) => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['复制内容', '取消'],
            cancelButtonIndex: 1,
        }, (index) => {
            if (index === 0) {
                Clipboard.setString(comment.content);
            }
        });
    };

    render() {
        if (this.state.diaryLoadingError) {
            return (
                <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
                    <ErrorView
                        text="日记加载失败了 :("
                        button="重试一下"
                        onButtonPress={() => {
                            this._loadDiary();
                            if (this.state.commentsLoadingError) {
                                this._loadComments();
                            }
                        }}/>
                </View>
            )
        }

        if (!this.state.diary) {
            return (
                <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
                    <View style={{flex: 1, alignItems: 'center', paddingTop: 30}}>
                        <ActivityIndicator animating={true} color={colors.light} size="large"/>
                    </View>
                </View>
            )
        }

        const isToday = this._isTodayDiary();
        const commentInput = isToday ? this.renderCommentInputBox() : null;
        // const editButton = isToday           //TODO
        //     ? (
        //         <NavigationBar.Icon name="ios-more" onPress={this._onDiaryMorePress.bind(this)}/>
        //     ) : null;


        return (
            <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
                <FlatList
                    ref="list"
                    data={this.state.comments}
                    keyExtractor={(item, index) => {
                        return item.id
                    }}
                    renderItem={({item}) => this.renderComment(item) }
                    ItemSeparatorComponent={({highlighted}) => <Divider style={{backgroundColor: '#eee'}}/>}
                    ListFooterComponent={this.renderFooter()}
                    ListHeaderComponent={this.renderTop()}
                    keyboardDismissMode="on-drag"
                />
                {commentInput}
                <KeyboardSpacer />
            </View>
        );
    }

    renderTop() {
        /*
         editable={this.props.editable}
         没实现刷新,所以暂时不能在日记页面编辑删除
         */
        const content = this.state.comment_count > 0
            ? `共 ${this.state.comment_count} 条回复`
            : '还没有人回复';
        return (
            <View>
                <Diary
                    diary={this.state.diary}
                    onIconPress={this._onDiaryIconPress.bind(this)}
                    showComment={false}
                    showAllContent={true}
                    onActionPress={this._onActionPress.bind(this)}
                />
                <View style={{borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.line, marginHorizontal: 15}} />
                <Text style={{marginHorizontal: 16, marginTop: 20, marginBottom: 20, color: colors.inactiveText}}>
                    {content}
                </Text>
            </View>
        )
    }

    renderCommentInputBox() {
        const comment_sending_box = this.state.comment_sending
            ? (<View style={styles.comment_sending}>
                <ActivityIndicator animating={true} color={colors.light} size="small"/>
            </View>)
            : null;

        return (
            <View style={[styles.comment_box, { height: this.state.inputHeight }]}>
                <TextInput style={styles.comment_input}
                           ref="commentInput"
                           value={this.state.comment_content}
                           placeholder="回复日记"
                           autoCorrect={false}
                           maxLength={500}
                           selectionColor={colors.light}
                           multiline={true}
                           showsVerticalScrollIndicator={false}
                           onChangeText={(text) => this._onCommentContentChange(text)}
                           onContentSizeChange={(event) => {
                               const h = event.nativeEvent.contentSize.height + 37;
                               const max = 74 + 37;
                               if (this.state.inputHeight !== h) {
                                   this.setState({
                                       inputHeight: h > max ? max : h,
                                   });
                               }
                           }}
                />
                <TouchableOpacity style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    paddingBottom: 12,
                    paddingRight:12,
                    paddingTop: 12,
                }} onPress={this._addCommentPress.bind(this)}>
                    <View style={{
                        width: 31,
                        height: 31,
                        backgroundColor: colors.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 16,
                    }}>
                        <Icon name="md-arrow-round-up"
                              size={22}
                              color="#fff"
                        />
                    </View>
                </TouchableOpacity>
                {comment_sending_box}
            </View>
        );
    }

    renderComment(comment) {
        console.log(comment)
        const new_comment = this.props.new_comments != null
            && this.props.new_comments.some(it => it === comment.id);
        const style = new_comment ? {backgroundColor: '#eef5ff'} : null;
        const content = comment.recipient == null
            ? <Text style={styles.content}>{comment.content}</Text>
            : (
                <Text style={styles.content}>
                    <Text style={{color: colors.light}}>@{comment.recipient.name} </Text>
                    {comment.content}
                </Text>
            );

        const action = this.isToday && this.state.isMy
            ? (
                <TouchableOpacity onPress={() => this._onCommentActionPress(comment)}>
                    <Icon name="ios-more"
                          size={16}
                          color={colors.inactiveText}
                          style={{ position: 'absolute', bottom: 0, right: 10, paddingHorizontal: 12, paddingVertical: 5}} />
                </TouchableOpacity>
            ) : null;

        return (
            <Touchable
                onPress={() => this._onCommentPress(comment)}
                underlayColor="#efefef"
                delayLongPress={500}
                onLongPress={() => this._onCommentLongPress(comment)}>
                <View style={style}>
                    <View style={styles.box}>
                        <Avatar
                            small
                            rounded
                            containerStyle={styles.user_icon}
                            source={{uri: comment.user.iconUrl}}
                            onPress={() => this._onIconPress(comment.user)}
                            activeOpacity={0.7}
                        />
                        {/*<RadiusTouchable style={styles.user_icon_box} onPress={() => this._onIconPress(comment.user)}>*/}
                            {/*<Image style={styles.user_icon} source={{uri: comment.user.iconUrl}}/>*/}
                        {/*</RadiusTouchable>*/}
                        <View style={styles.body}>
                            <View style={styles.title}>
                                <Text style={styles.title_name}>{comment.user.name}</Text>
                                <Text style={[styles.title_text]}>{moment(comment.created).format('H:mm')}</Text>
                            </View>
                            {content}
                        </View>
                    </View>
                    {action}
                    <View style={styles.line}/>
                </View>
            </Touchable>
        );
    }

    renderFooter() {
        if (!this.state.loading_comments && this.state.commentsLoadingError && this.state.diary.comment_count > 0) {
            return (
                <View style={{height: 100, justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
                    <TouchableOpacity style={{marginTop: 15}} onPress={this._loadComments.bind(this)}>
                        <Text style={{color: colors.primary}}>回复加载失败,请重试</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (!this.state.loading_comments && this.state.diary.comment_count == 0) {
            return null;
        }

        if (!this.state.loading_comments || this.state.diary.comment_count == 0) {
            return null;
        }

        return (
            <View style={{height: 100, justifyContent: "center", alignItems: "center", paddingBottom: 5}}>
                <ActivityIndicator animating={true} color={colors.primary} size="small"/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    box: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: "row"
    },
    user_icon: {
        marginRight: 8,
    },
    body: {
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        paddingTop: 2
    },
    title: {
        flexDirection: "row",
        paddingBottom: 5,
        alignItems: "flex-end",
    },
    title_name: {
        flexGrow: 1,
        fontWeight: 'bold',
        color: colors.contentText,
        fontSize: 14,
        marginRight: 5,
    },
    title_text: {
        fontSize: 12,
        color: colors.inactiveText
    },
    content: {
        flexGrow: 1,
        lineHeight: 26,
        color: colors.contentText,
        fontSize: 15,
        marginBottom: 10
    },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.line,
        marginHorizontal: 16,
        marginLeft: 56,
    },
    comment_box: {
        height: 55,
        backgroundColor: '#fff',
        elevation: 3,
        borderColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    comment_input: {
        flexGrow: 1,
        borderColor: '#bbb',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 19,
        paddingHorizontal: 15,
        fontSize: 15,
        margin: 8,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
    },
    comment_sending: {
        flexGrow: 1,
        opacity: 0.8,
        backgroundColor: "#fff",
        top: 0,
        left: 0,
        bottom:0,
        right:0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    }
});