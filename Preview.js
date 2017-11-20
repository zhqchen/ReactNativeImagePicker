/**
 * Created by CHENZHIQIANG247 on 2017-11-03.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu Preview',
});

//noinspection JSAnnotator
export default class Preview extends Component<{}> {
    render() {
        var param = this.props.navigation.state.params.param;//通过state.params来获取传来的参数，后面为key值。此处为param
        return (
            <View style={styles.container}>
                <Text style={styles.welcome} onPress={()=> this.props.navigation.goBack()}>
                    点击返回
                </Text>
                <Text style={styles.instructions}>
                    {param}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
