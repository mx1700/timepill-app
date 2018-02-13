import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    RefreshControl,
    ActivityIndicator,
    InteractionManager,
    Alert,
    View, DeviceEventEmitter,
} from 'react-native';
import * as Api from '../Api'
import Notebook from './Notebook'
import Events from "../Events";
import GridView from "./GridView";
import PropTypes from 'prop-types';

const EmptyBook = "EmptyBook";

export default class UserBooks extends Component {

    static propTypes = {
        userId: PropTypes.number,
        mySelf: PropTypes.bool,
    };

    static defaultProps = {

    };

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            refreshing: false,
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this._loadBooks().done();
        });
        if (this.props.mySelf) {
            this.updateListener = DeviceEventEmitter.addListener(Events.updateNotebooks, this._onAddNotebook);
        }
    }

    componentWillUnmount() {
        if (this.props.mySelf) {
            this.updateListener.remove();
        }
    }

    _onAddNotebook = () => {
        InteractionManager.runAfterInteractions(() => {
            this._loadBooks().done();
        });
    };

    _onRefresh() {
        this._loadBooks().done();
    }

    async _loadBooks() {
        this.setState({
            refreshing: true
        });
        let books;
        try {
            books = this.props.mySelf
                ? await Api.getSelfNotebooks()
                : await Api.getUserNotebooks(this.props.userId);
        } catch(err) {
            Alert.alert('加载失败', err.message);
            this.setState({
                refreshing: false,
            });
        }

        if (books.length % 2 === 1) {    //为了向左对齐，插入一个空日记本
            books.push(EmptyBook);
        }

        this.setState({
            books: books,
            refreshing: false,
        });
        //console.log(books);
    }

    _bookPress(book) {
        this.props.navigator.push({
            screen: 'Notebook',
            title: `《${book.subject}》`,
            passProps: { notebook: book },
        });
    }

    render() {
        return (
            <GridView
                itemsPerRow={2}
                renderFooter={null}
                onEndReached={null}
                scrollEnabled={true}
                renderSeparator={null}
                items={this.state.books}
                fillIncompleteRow={false}
                renderItem={this._renderBook.bind(this)}
                //renderSectionHeader={this._renderHeader}
                automaticallyAdjustContentInsets={false}
                removeClippedSubviews={false}
                // style={this.props.style}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}/>
                }
            />
        );
    }

    _renderBook(book) {
        if (EmptyBook !== book) {
            return <Notebook key={book.id} book={book} style={{marginBottom: 15}} onPress={() => this._bookPress(book)} />
        } else {
            return <View key="EmptyBook" style={{width: 140}} />
        }
    }
}