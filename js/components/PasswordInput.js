/**
 * Created by chenchunyong on 12/2/15.
 */

import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    InteractionManager,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Password extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        // inputItemStyle: View.propTypes.style,
        // iconStyle: View.propTypes.style,
        // maxLength: TextInput.propTypes.maxLength.isRequired,
        onChange: PropTypes.func,
        onEnd: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: true,
        onChange: () => {},
        onEnd: () => {},
    };

    state = {
        text: ''
    };

    clear() {
        this.setState({
            text: ''
        })
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            InteractionManager.runAfterInteractions(() => {
                this._onPress();
            });
        }
    }

    render(){
        return(
            <TouchableHighlight
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={[styles.container,this.props.style]} >
                    <TextInput
                        style={{width: 0, padding: 0, margin: 0,}}
                        ref={(r) => this.inputText = r}
                        maxLength={this.props.maxLength}
                        autoFocus={false}
                        keyboardType={ Platform.OS === 'ios' ? "number-pad" : 'numeric'}
                        value={this.state.text}
                        onChangeText={
                            (text) => {
                                this.setState({text});
                                this.props.onChange(text);
                                if (text.length === this.props.maxLength) {
                                    this.props.onEnd(text);
                                }
                            }
                        }
                    />
                    {
                        this._getInputItem()
                    }
                </View>
            </TouchableHighlight>
        )

    }
    _getInputItem(){
        let inputItem = [];
        let {text}=this.state;
        for (let i = 0; i < parseInt(this.props.maxLength); i++) {
            if (i === 0) {
                inputItem.push(
                    <View key={i} style={[styles.inputItem,this.props.inputItemStyle]}>
                        {i < text.length ? <View style={[styles.iconStyle,this.props.iconStyle]} /> : null}
                    </View>)
            }
            else {
                inputItem.push(
                    <View key={i} style={[styles.inputItem,styles.inputItemBorderLeftWidth,this.props.inputItemStyle]}>
                        {i < text.length ?
                            <View style={[styles.iconStyle,this.props.iconStyle]}>
                            </View> : null}
                    </View>)
            }
        }
        return inputItem;
    }

    _onPress(){
        setTimeout(() => {
            this.inputText.focus();
        }, 500);
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    inputItem: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8,
    },
});