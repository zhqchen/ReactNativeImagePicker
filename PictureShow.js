/**
 * Created by CHENZHIQIANG247 on 2018-01-02.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    NativeModules,
} from 'react-native';

import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";

import ImageItemView from './ImageItemView';
import TitleBar from './TitleBar';
import Constants from './Constants';
import Colors from './Colors';

var ImageShowModule = NativeModules.ImageShowModule;

const ITEM_SIZE = Dimensions.get('window').width / 4 - 4;

export default class PictureShow extends Component {
    constructor(args) {
        super(args);
        let provider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });
        this.state = {
            dataSource: provider,
            chooseSource:(new Map():Map<number, object>),
        }
        this._layoutProvider = new LayoutProvider((index) => {
            return index;
        }, (type, dim) => {
            dim.width = ITEM_SIZE + 4;
            dim.height = ITEM_SIZE + 4;
        });
    };

    _generateData() {
        var data = [];
        for(var i = 0; i < 100; i++) {
            data.push({imageId: 'imageId' + i, mMediaUrl: 'https://imagetest.pawjzs.com/web/banner/a4d382a8-04b0-4af0-a4b2-b4c75ea02f5b.jpg'});
        }
        return data;
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    componentDidMount() {
        ImageShowModule.init();
        this.getMyPhotoGallery();
    }

    //图片文件夹列表
    async getMyPhotoGallery() {
        //noinspection JSAnnotator
        ImageShowModule.getMyPhotoGallery((folders : array)=> {
            if(!folders || folders.length == 0) {
                var camera = {};
                camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
                var images = [];
                images.push(camera);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(images),
                });
                return;
            }
            this.showFirstGalleryImages(ImageShowModule.ALL_PHOTO_BUCKET_ID.toString());
        });
    }

    //展示所有图片
    async showFirstGalleryImages(bucketId) {
        ImageShowModule.getBucketMedias(bucketId, (images)=> {
            var camera = {};
            camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
            images.unshift(camera);//在数据的开头添加元素
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(images),
            });
        });
    }

    //点击选择
    //noinspection JSAnnotator
    _onChooseClick = (index: number) => {
        // updater functions are preferred for transactional updates
        var item = this.state.dataSource.getDataForIndex(index);
        // var dataSource = this.state.dataSource;
        var chooseSource = new Map(this.state.chooseSource);
        if(chooseSource.get(index) && chooseSource.get(index) != 'undefined') {
            chooseSource.delete(index);//删除(索引，删除个数)
        } else {
            chooseSource.set(index, item);//添加
        }
        this.setState({
            chooseSource: chooseSource
        });
    };

    async onClick(){
        // var data = await ImageChooser.chooseImage().catch((err)=>{console.log(err);});
        // console.log(data);
    }

    //点击跳转
    //noinspection JSAnnotator
    _onClick = (index: number)=> {
        if(this.state.dataSource.getDataForIndex(index).imageId == Constants.TAKE_PHOTO_IMAGE_ID) {
            console.log('open camera to take photo');
            return;
        }
        this.props.navigation.navigate('preview', {param: '传值到preview'});
    };

    //noinspection JSAnnotator
    _renderRow = (type: string | number, data: any, index: number)=> {
        var isSelected = this.state.chooseSource.get(index) && this.state.chooseSource.get(index) != 'undefined' ? true : false;
        return (
            <ImageItemView
                index={index}
                itemSize={ITEM_SIZE}
                itemData={data}
                onChooseClick={this._onChooseClick}
                onClick={this._onClick}
                selected={isSelected}>
            </ImageItemView>
        );
    };


    render(){
        return (
            <View style={styles.container}>
                <TitleBar topTitle={'Camera'} navigation={this.props.navigation}/>
                <RecyclerListView
                    rowRenderer={this._renderRow}
                    dataProvider={this.state.dataSource}
                    layoutProvider={this._layoutProvider}
                    extendedState={this.state.chooseSource}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyView: {
        flex: 1,
        fontSize: 15,
        color: Colors.common_primary_color,
        textAlign: 'center',
        margin: 10,
    },
    headerView: {
        height: 5,
        fontSize: 14,
        textAlign: 'center',
        color: Colors.common_second_color,
    },
});
