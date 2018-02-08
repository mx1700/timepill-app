import React, { Component } from 'react';
import {
    Text, View, BackHandler, BackAndroid, InteractionManager, Alert, Animated, Modal,
    TextInput, ActivityIndicator, Easing, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Image,
    CameraRoll, Platform, StatusBar
} from "react-native";
import LocalIcons from '../common/LocalIcons'
import * as Api from "../Api";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {colors} from "../Styles";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons'
import LabelButton from '../components/LabelButton'
import Notebook from '../components/Notebook'
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet-api';
import ImageResizer from "react-native-image-resizer";
import Toast from 'react-native-root-toast';

export default class WritePage extends Component {

    static get navigatorButtons() {
        return {
            leftButtons: [{
                id: 'cancel', icon: LocalIcons.navButtonClose
            },],
            rightButtons: [{
                id: "save",
                icon: LocalIcons.navButtonSave
            }]
        }
    }

    constructor(props) {
        super(props);
        this.tabIndexToSelect = 0;

        const diary = props.diary;
        this.state = {
            selectBookId: props.diary == null ? 0 : diary.notebook_id,
            modalVisible: false,
            books: [],
            content: props.diary == null ? '' : props.diary.content,
            loading: false,
            photoUri: null,
            photoSource: null,
            loadBookError: false,
            bookEmptyError: false,
            fadeAnimOpacity: new Animated.Value(0),
            fadeAnimHeight: new Animated.Value(0),
            topic: props.topic,
        };
    }

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadBooks().done();
            if (!this.props.diary) {
                // this._loadTempDraftAndDraft();       //TODO:
            }
            // this._autoSaveTempDraft();
        });
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'cancel') { // this is the same id field from the static navigatorButtons definition
                this.goBack();
            }
            if(event.id === 'save') {
                this._writePress()
            }
        }
        if (event.selectedTabIndex === 2 && this.props.tabOpen) {
            this.contentInput.focus();
            this.tabIndexToSelect = !event.unselectedTabIndex || event.unselectedTabIndex === 2 ? 0 : event.unselectedTabIndex;
            //TODO:加载日记本列表
        }
        if (event.id === 'backPress') {
            this.goBack();
        }
    }

    async _loadBooks() {
        let books = [];
        try {
            books = await Api.getSelfNotebooks();
        } catch(err) {
            console.log(err);
            Alert.alert('日记本加载失败', err.message);
            this.state.loadBookError = true;
            return;
        }
        const abooks = books.filter(it => !it.isExpired);
        if (abooks.length === 0) {
            Alert.alert('提示','没有可用日记本,无法写日记',[
                {text: '取消', onPress: () =>  this.goBack()},
                {text: '创建一个', onPress: () => this._createBook()}   //TODO:未实现
            ]);
            this.state.bookEmptyError = true;
            return;
        }
        if (this.props.diary == null) {
            this.setState({
                books: abooks,
                selectBookId: abooks.length > 0 ? abooks[0].id : 0
            })
        } else {
            this.setState({
                books: abooks,
            })
        }
    }

    _onChangeText = (text) => {
        if(!this.tempDraft) {
            this.tempDraft = text;
        } else if(Math.abs(text.length - this.tempDraft.length) > 10) {
            Api.saveTempDraft(text);
            this.tempDraft = text;
        }
        this.setState({ content: text });
    };

    _imagePress() {
        //TODO:当选择照片后,再次点击,放大图片,里边有取消按钮
        this.selectPhoto();
    }

    async selectPhoto() {
        // const photoUri = CameraRoll.getPhotos({first: 1})
        // console.log(photoUri);
        let options, deleteIndex, cancelIndex;
        if (this.state.photoUri !== null) {
            options = ['预览照片', '删除照片', '取消'];
            deleteIndex = 1;
            cancelIndex = 2
        } else {
            options = ['拍照','从相册选择', '取消'];
            deleteIndex = -1;
            cancelIndex = 2;
        }
        ActionSheet.showActionSheetWithOptions({
            options: options,
            cancelButtonIndex: cancelIndex,
            destructiveButtonIndex: deleteIndex,
        }, (index) => {
            if (index === deleteIndex) {
                this.setState({
                    photoSource: null,
                    photoUri: null,
                });
            } else if (index === cancelIndex) {
                console.log('cancel');
            } else if (this.state.photoUri !== null && index === 0) {
                this.openPhoto(this.state.photoUri)
            } else {
                let imageSelect = index === 0
                    ? ImagePicker.openCamera({cropping: false}) : ImagePicker.openPicker({cropping: false});
                imageSelect.then(image => {
                    if (index === 0) {
                        CameraRoll.saveToCameraRoll(image.path).done();
                    }

                    if (image.size > 1024 * 1024 * 2) {
                        this.resizePhoto(image.path, image.width, image.height).then(newUri => {
                            this.setState({
                                photoSource: {uri: newUri, isStatic: true},
                                photoUri: newUri,
                            });
                        });
                    } else {
                        this.setState({
                            photoSource: {uri: image.path, isStatic: true},
                            photoUri: image.path,
                        });
                    }
                });
            }
        });
    }

    async resizePhoto(uri, width, height) {
        //图片最大 1440 * 900 像素
        let oWidth = width;
        let oHeight = height;
        let maxPixel = 1440 * 900;
        let oPixel = oWidth * oHeight;
        if (oPixel > maxPixel) {
            width = Math.sqrt(oWidth * maxPixel / oHeight);
            height = Math.sqrt(oHeight * maxPixel / oWidth);
        }
        console.log('resize to :', width, height);
        const newUri = await ImageResizer.createResizedImage(uri, width, height, 'JPEG', 80);
        console.log('resizePhoto:' + newUri.uri);
        return 'file://' + newUri.uri;
    }

    _createBook() {
        this.closeModal(false);
        //TODO:创建日记本
        // InteractionManager.runAfterInteractions(() => {
        //     this.props.navigator.push({
        //         name: 'NotebookAddPage',
        //         component: NotebookAddPage,
        //         params: {
        //             onCreated: this._setCreatedBook.bind(this)
        //         }
        //     });
        // });
    }

    openPhoto = (uri) => {
        this.props.navigator.push({
            screen: 'Photo',
            title: '照片',
            passProps: { url: uri },
            animationType: 'fade'
        });
    };

    _setCreatedBook(book) {
        const books = [book].concat(this.state.books);
        this.setState({
            selectBookId: book.id,
            books: books,
            bookEmptyError: false,
            loadBookError: false,
        });
    }

    _writePress() {
        if (this.state.loadBookError) {
            Alert.alert('失败','日记本列表加载失败');  //TODO:提供重新加载功能
            return;
        }

        if (this.state.bookEmptyError) {
            Alert.alert('失败','没有可用的日记本');
            return;
        }

        if (this.state.content.length === 0) {
            Alert.alert('提示','请填写日记内容');
            return;
        }

        this.write().done();
    }

    async write() {
        this.setState({loading: true});

        let photoUri = this.state.photoUri;
        let r = null;
        try {
            const  topic = this.props.topic ? 1 : 0;
            r = this.props.diary == null
                ? await Api.addDiary(this.state.selectBookId,
                    this.state.content,
                    photoUri, topic)
                : await Api.updateDiary(this.props.diary.id,
                    this.state.selectBookId,
                    this.state.content);
        } catch (err) {
            //Alert.alert('日记保存失败', err.message);
            Toast.show("保存失败\n" + err.message, {
                duration: 2000,
                position: -80,
                shadow: false,
                hideOnPress: true,
            });
            return;
        } finally {
            this.setState({loading: false});
        }


        if (r) {
            Toast.show("日记保存完成", {
                duration: 2000,
                position: -80,
                shadow: false,
                hideOnPress: true,
            });
            //TODO;清除内容
            this.goBack();

            InteractionManager.runAfterInteractions(() => {
                // NotificationCenter.trigger('onWriteDiary');      //TODO:触发事件
                // if (this.props.topic) {
                //     NotificationCenter.trigger('onWriteTopicDiary');
                // }
                // const type = photoUri == null ? 'text' : 'photo';
                // Answers.logCustom('WriteDiary', {type: type});   //TODO:统计
                if (this.props.onSuccess) {
                    this.props.onSuccess(r);
                }
            });
        }
    }

    goBack = () => {
        //Api.clearTempDraft();     //TODO
        if (this.props.tabOpen) {
            this.props.navigator.switchToTab({
                tabIndex: this.tabIndexToSelect
            });
            this.setState({
                modalVisible: false,
                content: '',
                loading: false,
                photoUri: null,
                photoSource: null,
                loadBookError: false,
                bookEmptyError: false,
            });
        } else {
            this.props.navigator.pop();
        }
    };

    render() {
        const selectedBook = this.state.books.length > 0
            ? this.state.books.filter(it => it.id === this.state.selectBookId).pop()
            : null;

        const bookButton = selectedBook
            ? (<LabelButton text={selectedBook.subject} icon="ios-bookmarks-outline"
                            onPress={this.openModal.bind(this)} />)
            : null;

        const keyboardSpacer = Platform.OS === 'ios' ? <KeyboardSpacer /> : null;
        return (
            <ScrollView style={{flex: 1, backgroundColor:'white'}}
                        contentContainerStyle={{flex: 1}}
                        keyboardShouldPersistTaps="always"
            >
                <Modal
                    visible={this.state.loading}
                    transparent={true}
                    onRequestClose={() => {}}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                        <ActivityIndicator animating={true} color={colors.light} />
                    </View>
                </Modal>
                {this.renderSelectBook()}
                <TextInput
                    ref={(r) => this.contentInput = r }
                    style={{flex: 1, padding: 15, paddingTop: 10, fontSize: 15, lineHeight: 24, color: colors.text, textAlignVertical:'top'}}
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.primary}
                    maxLength={5000}
                    multiline={true}
                    placeholder="记录点滴生活"
                    value={this.state.content}
                    onChangeText={this._onChangeText}
                />
                <View style={styles.comment_box}>
                    {bookButton}
                    <View style={{flex: 1}} />
                    {this.renderTopicButton()}
                    {this.renderPhotoButton()}
                </View>
                {keyboardSpacer}
            </ScrollView>
        );
    }

    openModal() {
        // dismissKeyboard();   //TODO
        this.setState({modalVisible: true});
    }

    closeModal(showKeyboard = true) {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnimOpacity,
                {toValue: 0, duration: 350, easing: Easing.out(Easing.cubic)}
            ),
            Animated.timing(
                this.state.fadeAnimHeight,
                {toValue: 1, duration: 350, easing: Easing.out(Easing.cubic)}   //toValue: 1 为解决 RN 0.36-rc.1 奇怪的闪退 bug
            )
        ]).start(() => {
            this.setState({modalVisible: false});
            if (showKeyboard) {
                this.contentInput.focus();
            }
        });
    }

    renderSelectBook() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.modalVisible}
                onShow={() => {
                    Animated.parallel([
                        Animated.timing(
                            this.state.fadeAnimOpacity,
                            {toValue: 0.4, duration: 350, easing: Easing.out(Easing.cubic)}
                        ),
                        Animated.timing(
                            this.state.fadeAnimHeight,
                            {toValue: Platform.OS === 'ios' ? 250 : 260 , duration: 350, easing: Easing.out(Easing.cubic)}
                        )
                    ]).start();
                }}
                onRequestClose={() => { }}
            >
                <View style={{ flex: 1}}>
                    <TouchableWithoutFeedback onPress={this.closeModal.bind(this)} style={{flex: 1}}>
                        <Animated.View style={{ flex: 1, backgroundColor: "black", opacity: this.state.fadeAnimOpacity }} />
                    </TouchableWithoutFeedback>
                    <Animated.View style={{height: this.state.fadeAnimHeight, backgroundColor: '#fff'}}>
                        <View style={styles.closeButtonContainer}>
                            <TouchableOpacity onPress={this._createBook.bind(this)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>新添</Text>
                            </TouchableOpacity>
                            <Text style={{padding: 10, color: colors.text}}>选择日记本</Text>
                            <TouchableOpacity onPress={this.closeModal.bind(this)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>取消</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal={true}
                                    contentContainerStyle={{padding: 10, paddingRight: 0, paddingBottom:0,}}
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="always"
                                    automaticallyAdjustInsets={false}
                                    decelerationRate={0}
                                    snapToAlignment="start"
                                    snapToInterval={300}
                                    showsHorizontalScrollIndicator={true}
                        >
                            {this.state.books.map((book) => (
                                <Notebook
                                    key={book.id}
                                    book={book}
                                    style={{paddingRight: 10}}
                                    onPress={() => {
                                        this.setState({selectBookId: book.id});
                                        this.closeModal();
                                    }} />
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        );
    }

    renderPhotoButton() {
        if (this.props.diary != null) {
            return null;
        }
        const content = this.state.photoSource != null
            ? (<Image source={this.state.photoSource}
                      style={{width: 30, height: 30}} />)
            : (<Icon name="ios-image-outline" size={30} style={{paddingTop: 4}} color={colors.light} />);
        return (
            <TouchableOpacity
                style={{width: 45, height: 40, alignItems: "center", justifyContent: 'center'}}
                onPress={this._imagePress.bind(this)}>
                {content}
            </TouchableOpacity>
        );
    }

    renderTopicButton() {
        if (!this.state.topic) {
            return null;
        }

        return (
            <TouchableOpacity>
                <Text style={{color: colors.light, fontSize: 15, paddingRight: 15}}>#{this.state.topic.title}</Text>
            </TouchableOpacity>
        )
    }
}

WritePage.propTypes = {
    diary: PropTypes.object,
    onSuccess: PropTypes.func,
    topic: PropTypes.object,
};

WritePage.defaultProps = {
    diary: null,
    topic: null,
};

const styles = StyleSheet.create({
    comment_box: {
        height: 50,
        backgroundColor: '#fff',
        elevation: 3,
        borderColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#e2e2e2',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    closeButton: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    closeButtonText: {
        color: colors.light,
        fontSize: 15,
    }
});