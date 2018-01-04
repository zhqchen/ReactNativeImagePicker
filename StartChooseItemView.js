/**
 * Created by chenzhiqiang247 on 2018-01-04.
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

// const url = 'https://imagetest.pawjzs.com/clinic/doctor/a/a8fe7755-4b08-42ac-9639-67eb5bb21c40/photo/doctorPhoto1478501925321512107831.jpg';
const url = 'https://imagetest.pawjzs.com//clinic/doctor/3/3c1eb44b-58b2-410b-8194-7b23180bd3e0/license/doctorPhoto1506364346411-915548213.jpg';

export default class StartChooseItemView extends PureComponent {

    //props定义
    static propTypes={
        index: PropTypes.number.isRequired,
        itemSize: PropTypes.number.isRequired,
        itemData: PropTypes.object.isRequired,
        onClick: PropTypes.func,
    };

    _onClick = ()=> {
        this.props.onClick(this.props.index);
    };

    //网络地址加载方式：source={{uri: 'https://imagetest.pawjzs.com/clinic/doctor/a/a8fe7755-4b08-42ac-9639-67eb5bb21c40/photo/doctorPhoto1478501925321512107831.jpg'}}
    //磁盘地址加载方式：source={{uri: Platform.OS === 'android' ? 'file://' + itemData.mMediaUrl : itemData.mMediaUrl}}
    //项目资源加载方式：source={require('./imgs/album_selected.png')}
    render() {
        let itemData = this.props.itemData;
        let itemStyle = {width: this.props.itemSize, height: this.props.itemSize};
        if(itemData.imageId == Constants.TAKE_PHOTO_IMAGE_ID) {
            return (
                <TouchableOpacity style={styles.container} onPress={this._onClick} activeOpacity={0.7}>
                    <Image
                        style={itemStyle}
                        source={require('./imgs/status_write_btn_add_pic.png')}
                    />
                </TouchableOpacity>
            );
        } else {
            return (
                //activeOpacity为按下的不透明度
                <TouchableOpacity style={styles.container} onPress={this._onClick} activeOpacity={0.7}>
                    <Image
                        style={[itemStyle, {resizeMode: 'cover'}]}
                        source={{uri: Platform.OS === 'android' ? 'file://' + itemData.mMediaUrl : itemData.mMediaUrl}}
                    />
                </TouchableOpacity>
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
});