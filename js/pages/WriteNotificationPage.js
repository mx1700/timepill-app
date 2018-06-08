import React, { Component } from 'react';
import {WebView, Linking, BackHandler, Picker, View, Alert} from 'react-native';
import LocalIcons from "../common/LocalIcons";
import TokenManager from "../TokenManager";
import * as LocalPush from "../LocalPush";
import * as Api from "../Api";

export default class WriteNotificationPage extends Component {

    static get navigatorButtons() {
        return {
            rightButtons: [{
                id: "save",
                icon: LocalIcons.navButtonSave
            }]
        }
    }

    constructor() {
        super();
        this.state = {
            hours: '19',
            min: '50',
        }
    }

    componentWillMount() {
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        TokenManager.getWriteNotificationTime().then((c) => {
            console.log(c);
            this.setState(c)
        })
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if(event.id === 'save') {
                this.save()
            }
        }
    }

    save() {
        TokenManager.setWriteNotificationTime({
            hours: parseInt(this.state.hours),
            min: parseInt(this.state.min),
        }).done(() => {
            LocalPush.register();
            Alert.alert('提示', '保存成功', [
                {
                    text: 'OK', onPress: () => {
                        this.props.navigator.pop();
                    }
                },
            ]);
        })
    }

    render() {

        let hours = [];
        for(let i = 0; i < 24; i++) {
            hours.push(<Picker.Item key={i.toString()} label={i + '点'} value={i.toString()} />)
        }
        let min = [];
        for(let i = 0; i <= 55; i += 5) {
            min.push(<Picker.Item key={i.toString()} label={i + '分'} value={i.toString()} />)
        }

        return (<View style={{flex: 1, flexDirection: "row"}}>
            <Picker style={{flex: 1}}
                    onValueChange={(itemValue, itemIndex) => this.setState({hours: itemValue})}
                    selectedValue={this.state.hours.toString()}>
                {hours}
            </Picker>
            <Picker style={{flex: 1}}
                    onValueChange={(itemValue, itemIndex) => this.setState({min: itemValue})}
                    selectedValue={this.state.min.toString()}>
                {min}
            </Picker>
        </View>)
    }
}