import React, { Component } from 'react';
import Button from '../components/Button'

export default class HomeScreen extends React.Component {
    render() {
        return (
            <Button
                onPress={() => this.props.navigation.navigate('Login', {name: 'Lucy'})}
                title="Go to Lucy's profile"
            />
        );
    }
}