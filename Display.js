/**
 * Created by CHENZHIQIANG247 on 2017-11-03.
 */
import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    NativeModules,
} from 'react-native';

import ImageItemView from './ImageItemView';
import TitleBar from './TitleBar';
import Colors from './Colors';

import Constants from './Constants';

var ImageShowModule = NativeModules.ImageShowModule;

const ITEM_SIZE = Dimensions.get('window').width / 4 - 4;
const initialNumToRender = parseInt(Dimensions.get('window').height / ITEM_SIZE * 4);

export default class Display extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            dataSource: [],
            chooseSource:[],
            refreshing: false,
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        ImageShowModule.recycle();
    }

    componentDidMount() {
        console.log("display_componentDidMount");
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
                var dataSource = [];
                dataSource.push(camera);
                this.setState({
                    dataSource : dataSource,
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
            images.unshift(camera);//前面添加拍照的元素
            let chooseData = this.props.navigation.state.params.pictures;//通过state.params来获取传来的参数，后面为key值。此处为pictures
            console.log('showFirstGalleryImages');
            console.log(chooseData);
            this.setState({
                dataSource: images,
                chooseSource: chooseData
            });
        });
    }

    _keyExtractor = (item, index) => item.imageId;
    
    //点击选择
    //noinspection JSAnnotator
    _onChooseClick = (index: number) => {
        // updater functions are preferred for transactional updates
        var item = this.state.dataSource[index];
        // var dataSource = this.state.dataSource;
        var chooseSource = [];
        chooseSource = chooseSource.concat(this.state.chooseSource);//concat数组链接，不会改变原数组，仅返回一个结果的副本
        let position = this._hasChoose(chooseSource, item);
        if(position != -1) {
            chooseSource.splice(position);//删除(索引，删除个数)
        } else {
            chooseSource.push(item);//添加
        }
        // console.log('_onChooseClick-->' + position + ' size is' + chooseSource.length);
        this.setState({
            chooseSource: chooseSource,
        });
    };

    /**
     * 判断图片是否已经被选择
     * @param array
     * @param element
     * @returns {number} -1 or index下标
     * @private
     */
    //noinspection JSAnnotator
    _hasChoose(array, element) {
        if(!array || !element) {
            return -1;
        }
        for(var index = 0; index < array.length; index++) {
            if(array[index].mMediaUrl == element.mMediaUrl) {
                return index;
            }
        }
        return -1;
    }

    async onClick(){
        // var data = await ImageChooser.chooseImage().catch((err)=>{console.log(err);});
        // console.log(data);
    }

    //点击跳转
    //noinspection JSAnnotator
    _onClick = (index: number)=> {
        if(this.state.dataSource[index].imageId == Constants.TAKE_PHOTO_IMAGE_ID) {
            console.log('open camera to take photo');
            return;
        }
        this.props.navigation.navigate(Constants.PREVIEW, {param: '传值到preview', index: index});
    };

    _onLeftBtnClick=()=> {
        this.props.navigation.goBack();
    };

    //完成，回传数据
    _onRightBtnClick=()=> {
        this.props.navigation.state.params.returnData(this.state.chooseSource);
        this.props.navigation.goBack();
    };

    _getItemLayout=(data, index) => (
        // 120 是被渲染 item 的高度 ITEM_HEIGHT。
        {length: ITEM_SIZE, offset: ITEM_SIZE * index + 5, index}//加5是加上headerView的高度
    );

    _renderItemComponent = ({item, index}) => {
        // var isSelected = this.state.chooseSource.get(index) && this.state.chooseSource.get(index) != 'undefined' ? true : false;
        var isSelected = this._hasChoose(this.state.chooseSource, item) != -1;
        console.log('_renderItemComponent ' + index + "is" + isSelected);
        return (
            <ImageItemView
                index={index}
                itemSize={ITEM_SIZE}
                itemData={item}
                onChooseClick={this._onChooseClick}
                onClick={this._onClick}
                selected={isSelected}>
            </ImageItemView>
        );
    };

    _renderHeader = ()=> {
        return (
            <Text style={styles.headerView}>
            </Text>
        );
    };

    _emptyView = ()=> {
        return (
            <Text style={styles.emptyView}>暂无数据</Text>
        );
    };

    //使用箭头函数，否则this的指针不会指向Display这个类
    _onRefresh= ()=> {
        if(!this.state.dataSource || this.state.dataSource == undefined || this.state.dataSource.length == 0) {
            this.setState({refreshing: true});//开始刷新
            //这里模拟请求网络，拿到数据，3s后停止刷新
            this.timer = setTimeout(() => {
                var data = [];
                for(var i = 0; i < 10; i++) {
                    data.push({imageId: 'imageId' + i, mMediaUrl: 'https://imagetest.pawjzs.com/web/banner/a4d382a8-04b0-4af0-a4b2-b4c75ea02f5b.jpg'});
                }
                this.setState({
                    dataSource : data,
                    refreshing: false
                });
                clearTimeout(this.timer);
            }, 500);
        }
    };

    render(){
        //refreshing={this.state.refreshing}//下拉刷新在FlatList加上这两个属性
        // onRefresh={this._onRefresh}
        return (
            <View style={styles.container}>
                <TitleBar
                    topTitle={'Camera'}
                    rightBtnText={'finish'}
                    navigation={this.props.navigation}
                    onLeftBtnClick={this._onLeftBtnClick}
                    onRightBtnClick={this._onRightBtnClick}
                />
                <FlatList
                    numColumns={4}
                    data = {this.state.dataSource}
                    extraData={this.state.chooseSource}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItemComponent}
                    ListHeaderComponent={this._renderHeader}
                    ListEmptyComponent={this._emptyView}
                    getItemLayout={this._getItemLayout}
                    initialNumToRender={initialNumToRender}
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
