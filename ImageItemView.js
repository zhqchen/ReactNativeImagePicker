/**
 * 图片一格的itemView
 * Created by zhqchen on 2017-11-03.
 */
import React, {PureComponent} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import Constants from './Constants';

export default class ImageItemView extends PureComponent {

    //props定义
    static propTypes={
        index: PropTypes.number,
        itemSize: PropTypes.number.isRequired,
        itemData: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        onChooseClick: PropTypes.func,
        onClick: PropTypes.func,
    };

    _onClick = ()=> {
        this.props.onClick(this.props.index);
    };

    _onChooseClick = ()=> {
        this.props.onChooseClick(this.props.index);//这里必须对应组件使用者的onChooseClick方法和参数
    };

    //网络地址加载方式：source={{uri: 'http://img4.imgtn.bdimg.com/it/u=1725836098,1795487958&fm=27&gp=0.jpg'}}
    //磁盘地址加载方式：source={{uri: Platform.OS === 'android' ? 'file://' + itemData.mMediaUrl : itemData.mMediaUrl}}
    //项目资源加载方式：source={require('./imgs/album_selected.png')}
    render() {
        let itemData = this.props.itemData;
        let selected = this.props.selected;
        if(itemData.imageId == Constants.TAKE_PHOTO_IMAGE_ID) {
            return (
                <TouchableOpacity style={styles.container} onPress={this._onClick} activeOpacity={0.7}>
                    <Image
                        style={{width: this.props.itemSize, height: this.props.itemSize}}
                        source={require('./imgs/register_add_photo.png')}
                    />
                </TouchableOpacity>
            );
        } else {
            return (
                //activeOpacity为按下的不透明度
                <View style={[styles.container, {width: this.props.itemSize, height: this.props.itemSize}]}>
                    <TouchableOpacity onPress={this._onClick} activeOpacity={0.7}>
                        <Image
                            style={{width: this.props.itemSize, height: this.props.itemSize, resizeMode: 'cover'}}
                            source={{uri: Platform.OS === 'android' ? 'file://' + itemData.mMediaUrl : itemData.mMediaUrl}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chooseIcon} onPress={this._onChooseClick} activeOpacity={1}>
                        <Image
                            style={styles.icon}
                            source={selected ? require('./imgs/album_selected.png') : require('./imgs/album_no_selected.png')}/>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 2,
    },

    // itemView: {
    //     width: itemSize,
    //     height: itemSize,
    // },

    chooseIcon: {
        width: 29,
        height: 29,
        position: 'absolute',//absolute相对于父容器，relative相对于兄弟节点
        right: 0,
        top: 0,
        padding: 3
    },

    icon: {
        width: 23,
        height: 23,
    }
});
