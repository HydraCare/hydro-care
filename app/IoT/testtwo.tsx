import React, { Component } from 'react';

import {
    Platform,
    StyleSheet,
    Alert,
    Text,
    Button,
    View
} from 'react-native';

export default class App extends Component<{}> {
    _onPressButton() {
        window.alert('ボタンを押しました！')
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this._onPressButton}
                        title="start"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this._onPressButton}
                        title="stop"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
    },
    buttonContainer: {
        height: 100,
        width: 200,
        padding: 10,
        backgroundColor: '#FFFFFF',
        margin: 3
    },
});
