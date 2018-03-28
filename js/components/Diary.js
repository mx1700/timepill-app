/**
 * @providesModule Diary
 */
import React, { Component } from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import { colors } from '../Styles'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from "react-native";
import {Avatar} from "react-native-elements";
import PropTypes from 'prop-types';
import Hyperlink from 'react-native-hyperlink'

/**
 * 日记视图
 * @constructor
 */
Diary = (props) => {
    let diary = props.diary;

    let title;
    if (diary.user) {
        title = <View style={styles.title}>
            <Text style={styles.title_name} numberOfLines={1}>{diary.user.name}</Text>
            <Text style={[styles.title_text, {flex: 1}]} numberOfLines={1}>《{diary.notebook_subject}》</Text>
            <Text style={styles.title_text}>{moment(diary.created).format('H:mm')}</Text>
        </View>
    } else {
        const book = props.showBookSubject
            ? (<Text style={styles.title_h} numberOfLines={1}>《{diary.notebook_subject}》</Text>)
            : null;

        title = <View style={styles.title}>
            {book}
            <Text style={styles.title_text}>{moment(diary.created).format('H:mm')}</Text>
        </View>
    }

    const content = props.showAllContent
        ? (
            <Hyperlink linkDefault={true} linkStyle={{ color: colors.primary }}>
                <Text style={styles.content} selectable={true} selectionColor={colors.textSelect}>{diary.content}</Text>
            </Hyperlink>
                )
        : <Text style={styles.content} numberOfLines={5}>{diary.content.trim()}</Text>;

    return (
        <View style={styles.box}>
            <UserIcon diary={diary} user={diary.user} onPress={() => {
                if (props.onIconPress) {
                    props.onIconPress(diary);
                }
            }}/>
            <View style={styles.body}>
                {title}
                {content}
                <Photo url={diary.photoThumbUrl} onPress={() => props.onPhotoPress ? props.onPhotoPress(diary) : null } diary={diary}/>
                <ActionBar diary={diary} showComment={props.showComment} editable={props.editable}
                           deletable={props.deletable} onPress={() => {
                               if (props.onActionPress) {
                                   props.onActionPress(diary)
                               }
                }} />
            </View>
        </View>
    );
};

Diary.propTypes = {
    diary: PropTypes.object.isRequired,
    onIconPress: PropTypes.func,
    onPhotoPress: PropTypes.func,
    showBookSubject: PropTypes.bool,
    showComment: PropTypes.bool,
    showAllContent: PropTypes.bool,
    navigator: PropTypes.object,
    onActionPress: PropTypes.func,
    deletable: PropTypes.bool,
    editable: PropTypes.bool,
};

Diary.defaultProps = {
    showBookSubject: true,
    showComment: true,
    showAllContent: true,
    deletable: false,
    editable: false,
};

export default Diary

/**
 * 头像
 * @param props(onPress|user)
 * @returns {null}
 * @constructor
 */
UserIcon = (props) => {
    let user = props.user;
    if(!user) return null;
    return (
        <Avatar
            small
            rounded
            containerStyle={styles.user_icon}
            source={{uri: user.iconUrl}}
            onPress={props.onPress}
            activeOpacity={0.7}
        />
    );
};

/**
 * @param props (url|onPress)
 * @returns {null}
 * @constructor
 */
Photo = (props) => {
    return (props.url) ? (
        <TouchableOpacity
            onPress={props.onPress}
            style={styles.photo_box}>
            <Image style={styles.photo}
                   source={{uri: props.url.replace('w240-h320', 'w320-h320-c320:320-q75')}}/>
        </TouchableOpacity>
    ): null;
};

/**
 *
 * @param props(diary|showComment|editable|deletable|onPress)
 * @returns {*}
 * @constructor
 */
ActionBar = (props) => {
    let diary = props.diary;
    const hasComment = diary.comment_count > 0 && props.showComment;
    const hasMoreAction = props.editable || props.deletable;
    if (hasComment || hasMoreAction) {
        const comment = hasComment
            ? (<View style={styles.comment_icon_box}>
                <Icon name="ios-text-outline"
                      size={18}
                      color={colors.inactiveText}
                      style={styles.button_icon} />
                <Text style={styles.comment_icon_text}>{diary.comment_count}</Text>
            </View>)
            : null;

        const action = hasMoreAction
            ? (
                <TouchableOpacity onPress={() => props.onPress && props.onPress(diary)}>
                    <Icon name="ios-more"
                          size={24}
                          color={colors.inactiveText}
                          style={styles.more_icon} />
                </TouchableOpacity>
            )
            : null;

        return (
            <View style={styles.action_bar}>
                {comment}
                <View style={{flex: 1}} />
                {action}
            </View>
        )
    } else {
        return <View style={{height: 24}} />
    }
};

const styles = StyleSheet.create({
    box: {
        overflow: "hidden",
        paddingHorizontal: 15,
        paddingTop: 15,
        flexDirection: "row"
    },
    user_icon: {
        marginTop: 3,
        marginRight: 8,
    },
    body: {
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        paddingTop: 2,
    },
    title: {
        flexDirection: "row",
        paddingBottom: 5,
        alignItems: "flex-end"
    },
    title_name: {
        fontWeight: 'bold',
        color: colors.text,
        fontSize: 14
    },
    title_h: {
        flexGrow: 1,
        fontWeight: 'bold',
        color: colors.darkText,
        fontSize: 14
    },
    title_text: {
        fontSize: 12,
        color: colors.inactiveText
    },
    content: {
        flexGrow: 1,
        lineHeight: 24,
        color: colors.text,
        fontSize: 15,
        textAlignVertical: 'bottom',
    },
    photo_box: {
        width: 160,
        height: 160,
        marginTop: 15,
        backgroundColor: colors.spaceBackground,
        padding: 0,
        borderRadius: 5,
    },
    photo: {
        flexGrow: 1,
        width: 160,
        height: 160,
        borderRadius: 5,
    },
    button_icon: {
        marginRight: 8,
        marginLeft: 2
    },
    comment_icon_box: {
        flexDirection: "row"
    },
    comment_icon_text: {
        fontSize: 15,
        color: colors.inactiveText
    },
    more_icon: {
        paddingVertical: 4,
        paddingHorizontal: 13,
        marginRight: 5,
    },
    action_bar: {
        flexDirection: 'row',
        alignItems: "center",
        height: 50,
        marginRight: -15,
        justifyContent: 'space-between'
    }
});
