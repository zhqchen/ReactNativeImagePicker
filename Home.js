import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    BackHandler,
    Image,
} from 'react-native';

import {StackNavigator} from 'react-navigation';

import Display from './Display';
import Preview from './Preview';

const MyStackNavigator = StackNavigator(
    {
        display: {
            screen: Display,
            navigationOptions: ({navigation}) => ({
                headerTitle: 'Camera',
            }),
        },
        preview: {
            screen: Preview,
            // Optional: Override the `navigationOptions` for the screen
            navigationOptions: ({navigation}) => ({
                headerTitle: 'Preview Pic',
            }),
        }
    },
    {
        navigationOptions:{//已经没用了，子页面自己布局TitleBar，不再用这个
            header: null,//不使用Header
            headerTitle: 'Camera',
            headerTitleStyle: ({color: '#000000', fontSize: 14}),
            headerBackTitle:null,
            headerLeft: (<Image
                style={{width: 10, height: 17, marginLeft: 14}}
                source={require('./imgs/icon_title_bar_back.png')}
                onPress={()=> this.onBackAndroid()}
            />),
            headerRight: (<Image style={{width: 17, height: 17, marginRight: 14}} source={require('./imgs/icon_title_bar_add.png')}/>),
            headerTintColor:'#f4f4f4',//导航栏颜色
            // swipeEnabled:false,
            // animationEnabled:false,
        },
        mode:'card',//使用android和ios默认的跳转风格
        initialRouteName:'display' //设置默认的页面组件
    }
);

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state={
            splashed: false,
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.timer && clearTimeout(this.timer);
    }

    onBackAndroid = () => {
        this.props.navigation && this.props.navigation.goBack();
    };

    componentDidMount() {
        this.timer = setTimeout(
            ()=> {
                this.setState({
                    splashed: true
                })
            }, 500
        );
    }

    render() {
        return (
            <MyStackNavigator/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});