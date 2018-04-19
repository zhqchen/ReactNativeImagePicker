/**
 * 标题栏
 * Created by CHENZHIQIANG247 on 2017-11-15.
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import Colors from './Colors';
import PropTypes from 'prop-types';//0.47版时使用 prop-types 包中的 PropTypes 代替了 react 中的 PropTypes

export default class TitleBar extends Component {

    //props定义
    static propTypes={
        leftBtnText: PropTypes.string,
        topTitle: PropTypes.string.isRequired,
        rightBtnText: PropTypes.string,
        onLeftBtnClick: PropTypes.func,
        onRightBtnClick: PropTypes.func,
        onTitleClick: PropTypes.func,
        navigation: PropTypes.object,
    };

    //props默认值
    static defaultProps={
        leftBtnText: './imgs/icon_title_bar_back.png',
        rightBtnText: 'right',
        topTitle: '',
        onLeftBtnClick: this.onLeftClick,
    };

    onLeftClick= ()=> {
        this.props.navigation && this.props.navigation.goBack();
    };

    render() {
        return(
          <View style={styles.container}>

              <TouchableOpacity style={styles.leftBtn} onPress={this.props.onLeftBtnClick} activeOpacity={0.7}>
                  {
                      this.props.leftBtnText.startsWith('./imgs/') ?
                          <Image style={styles.ivBtn} source={require('./imgs/icon_title_bar_back.png')}/> :
                          <Text style={styles.tvBtn}>{this.props.leftBtnText}</Text>
                  }
              </TouchableOpacity>

              <Text style={styles.tvMiddleTitle} onPress={this.props.onTitleClick}>{this.props.topTitle}</Text>

              <TouchableOpacity style={styles.rightBtn} onPress={this.props.onRightBtnClick} activeOpacity={0.7}>
                  {
                      this.props.rightBtnText.startsWith('./imgs/') ?
                          <Image style={styles.ivBtn} source={require('./imgs/icon_title_bar_add.png')}/> :
                          <Text style={styles.tvBtn}>{this.props.rightBtnText}</Text>
                  }
              </TouchableOpacity>
          </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.common_interface_bg,
    },

    leftBtn: {
        height: 64,
        position: 'absolute',
        left: 0,
        paddingHorizontal: 14,
        justifyContent: 'center',//子View垂直居中
    },

    rightBtn: {
        height: 64,
        position: 'absolute',
        right: 0,
        paddingHorizontal: 14,
        justifyContent: 'center',
    },

    tvBtn: {
        color: Colors.common_primary_color,
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',//Android
    },

    ivBtn: {
        width: 10,
        height: 17,
        // resizeMode: 'center',
    },

    tvMiddleTitle: {
        height: 64,
        color: Colors.common_primary_color,
        fontSize: 17,
        marginHorizontal: 60,
        textAlign: 'center',//文本对齐方式
        textAlignVertical: 'center',//Android
    },

    bottomLine: {
        height: 0.5,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#dddddd'
    },

});
