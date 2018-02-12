import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    ActivityIndicator,
    Text,
    InteractionManager,
    View,
    Image,
    ScrollView,
    Alert, DeviceEventEmitter,
} from 'react-native';
import * as Api from '../Api'
import moment from 'moment'
import {colors} from "../Styles";
import PropTypes from 'prop-types';
import Events from "../Events";
import {Avatar} from "react-native-elements";

export default class UserIntro extends Component {

    static propTypes = {
        user: PropTypes.object,
        mySelf: PropTypes.bool,
    };

    static defaultProps = {
        mySelf: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            userId: props.userId,
            loading: true,
        };
    }

    getId() {
        return this.props.user != null ? this.props.user.id : this.props.userId;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadUser().done();

            if(this.props.mySelf) {
                this.updateListener = DeviceEventEmitter.addListener(Events.updateUserInfo, this._updateUserInfo);
            }
        });
    }

    componentWillUnmount() {
        if(this.updateListener) {
            this.updateListener.remove();
        }
    }

    _updateUserInfo = () => {
        this._loadUser().done();
    };

    async _loadUser() {
        let user;
        try {
            if (this.props.mySelf) {
                user = await Api.getSelfInfoByStore();
            } else {
                user = await Api.getUserInfo(this.getId())
            }
        } catch (err) {
            Alert.alert('加载失败', err);
            return;
        }
        console.log('222222222222222222', this);
        this.setState({
            user: user,
            loading: false,
        });

        if (this.props.mySelf && user) {
            let newUser;
            try {
                newUser = await Api.getUserInfo(user.id)
            } catch (err) {
                console.log(err);
                return;
            }
            console.log('111111111111111', this);
            this.setState({
                user: newUser,
            });
            Api.updateUserInfoStore(newUser).done();
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={[{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}, this.props.style]}>
                    <ActivityIndicator color={colors.light} />
                </View>
            )
        }
        const user = this.state.user;

        const intro = user.intro && user.intro.length > 0
            ? (
                <Text style={{ padding: 15, color: colors.text, lineHeight: 24, textAlign: 'center'}}>
                    {user.intro}
                </Text>
            ) : null;

        return (
            <ScrollView style={[{flex: 1, backgroundColor: 'white'}, this.props.style]}
                        automaticallyAdjustContentInsets={false}
            >
                <View style={{height: 230, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                    <Avatar
                        rounded
                        width={90}
                        height={90}
                        source={{uri: user.coverUrl}}
                    />
                    <Text style={{fontSize: 22, marginTop: 30, fontWeight: 'bold', color: '#000000'}}>{user.name}</Text>
                </View>
                {intro}
                <Text style={{
                    marginTop: 30,
                    marginBottom:60,
                    padding: 15,
                    color: colors.inactiveText,
                    lineHeight: 20,
                    textAlign: 'center'
                }}>
                    {moment(user.created).format('YYYY年M月D日')}加入胶囊
                </Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.line,
        marginHorizontal: 16,
        marginVertical: 10,
    }
});