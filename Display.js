/**
 * 图片浏览列表
 * Created by CHENZHIQIANG247 on 2017-11-03.
 */
import React, {PureComponent} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    NativeModules,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';

import GalleryListView from './GalleryListView';
import ImageItemView from './ImageItemView';
import TitleBar from './TitleBar';
import Colors from './Colors';

import Constants from './Constants';

var ImageShowModule = NativeModules.ImageShowModule;

const ITEM_SIZE = Dimensions.get('window').width / 4 - 4;
const initialNumToRender = parseInt(Dimensions.get('window').height / ITEM_SIZE * 4);
const galleyAnimTranslateY = -221.5 - 64 * 2; //文件夹list的初始位置Y

export default class Display extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            gallerySource: [],
            dataSource: [],
            chooseSource: [],
            refreshing: false,
            popAnim: new Animated.Value(0),
            isGettingData : false,//是否正在获取数据
            bucketName: ''
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.tempTimer && clearTimeout(this.tempTimer);
        ImageShowModule.recycle();
    }

    componentDidMount() {
        ImageShowModule.init();
        //TODO:显示ProgressDialog
        this.getMyPhotoGallery();
    }

    //图片文件夹列表
    async getMyPhotoGallery() {
        //noinspection JSAnnotator
        this.setState({
            isGettingData : true
        });
        ImageShowModule.getMyPhotoGallery((folders)=> {
            if (!folders || folders.length == 0) {
                var camera = {};
                camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
                var dataSource = [];
                dataSource.push(camera);
                this.setState({
                    dataSource: dataSource,
                    isGettingData: false
                });
                return;
            }
            this.setState({
                gallerySource: folders,
                isGettingData : true,
                bucketName: '所有图片'
            });
            this.showFirstGalleryImages(ImageShowModule.ALL_PHOTO_BUCKET_ID.toString());
        });
    }

    //展示所有图片
    async showFirstGalleryImages(bucketId) {
        ImageShowModule.getBucketMedias(bucketId, (images)=> {
            let chooseData = this.props.navigation.state.params.pictures;//通过state.params来获取传来的参数，后面为key值。此处为pictures
            var gallerySource = this.state.gallerySource;
            if(bucketId === ImageShowModule.ALL_PHOTO_BUCKET_ID.toString() && gallerySource && gallerySource.length == 0) {
                var camera = {};
                camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
                images.unshift(camera);//前面添加拍照的元素
                var allPhotoItem = {};
                allPhotoItem.bucketId = ImageShowModule.ALL_PHOTO_BUCKET_ID.toString();
                allPhotoItem.bucketDisplayName= '所有图片';
                allPhotoItem.firstImagePath = images[0].firstImagePath;
                allPhotoItem.count = images.length;
                gallerySource.unshift(allPhotoItem);//首位增加所有图片的item
            }
            console.log("showFirstGalleryImages_end3" + Date.now());
            //TODO:这里的setState的界面刷新，数据量大时，耗时长，需要优化
            this.setState({
                dataSource: images,
                chooseSource: chooseData,
                gallerySource: gallerySource,
                isGettingData: false,
            });
            console.log("showFirstGalleryImages_end4" + Date.now());//end3--->end4耗时长，性能有问题
        });
    }

    _keyExtractor = (item, index) => item.imageId;

    //点击选择
    //noinspection JSAnnotator
    _onChooseClick = (index:number) => {
        // updater functions are preferred for transactional updates
        var item = this.state.dataSource[index];
        // var dataSource = this.state.dataSource;
        var chooseSource = [];
        chooseSource = chooseSource.concat(this.state.chooseSource);//concat数组链接，不会改变原数组，仅返回一个结果的副本
        let position = this._hasChoose(chooseSource, item);
        if (position != -1) {
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
        if (!array || !element) {
            return -1;
        }
        for (var index = 0; index < array.length; index++) {
            if (array[index].mMediaUrl == element.mMediaUrl) {
                return index;
            }
        }
        return -1;
    };

    async onClick() {
        // var data = await ImageChooser.chooseImage().catch((err)=>{console.log(err);});
        // console.log(data);
    };

    _onGalleryItemClick = (bucketId, bucketName)=> {
        this._onTitleClick();//先隐藏文件夹列表
        this.tempTimer = setTimeout(()=> {
            this.setState({
                isGettingData: true,
                bucketName: bucketName,
            });
            if(this.state.bucketName != bucketName) {//若点击的还是当前文件夹，不再响应
                this.showFirstGalleryImages(bucketId);
            }
        }, 300);
    };

    //点击跳转
    //noinspection JSAnnotator
    _onItemClick = (index:number)=> {
        if (this.state.dataSource[index].imageId == Constants.TAKE_PHOTO_IMAGE_ID) {
            console.log('open camera to take photo');
            ImageShowModule.takePhoto((photoPath, errorCode, errorMessage) => {
                if (photoPath && photoPath != undefined) {
                    var takenPhoto = {};
                    takenPhoto.mMediaUrl = photoPath;
                    this.state.chooseSource.push(takenPhoto);
                    this._onRightBtnClick();//拍照完成直接返回数据
                } else if (errorCode == ImageShowModule.ERROR_CAMERA_NOT_PERMITTED) {
                    console.log('相机权限不可用');
                } else if (errorCode == ImageShowModule.ERROR_SD_CARD_NOT_VALID) {
                    console.log('SD卡不可用或空间不足');
                }
            });
            return;
        }
        this.props.navigation.navigate(Constants.PREVIEW, {param: '传值到preview', index: index});
    };

    _onLeftBtnClick = ()=> {
        this.props.navigation.goBack();
    };

    //完成，回传数据
    _onRightBtnClick = ()=> {
        this.props.navigation.state.params.returnData(this.state.chooseSource);
        this.props.navigation.goBack();
    };

    _onTitleClick = ()=> {
        let currentValue = this.state.popAnim.__getValue();
        if(currentValue != 0 && currentValue != 1) {//动画还在执行
            return;
        }
        Animated.timing(this.state.popAnim, {
            toValue: currentValue == 0 ? 1 : 0,
            duration: 300,
            easing: Easing.inout,//linear, ease, quad, cubic, sin, elastic, bounce, back, bezier, in, out, inout
        }).start();
    };

    _getItemLayout = (data, index) => (
        // 120 是被渲染 item 的高度 ITEM_HEIGHT。
        {length: ITEM_SIZE, offset: ITEM_SIZE * index + 5, index}//加5是加上headerView的高度
    );

    //每一个item的数据源的格式为{ item:{...},index: 0,separators:{...} }
    //因此以({item, index}) =>{}的形式来写参数
    _renderItemComponent = ({item, index}) => {
        // var isSelected = this.state.chooseSource.get(index) && this.state.chooseSource.get(index) != 'undefined' ? true : false;
        var isSelected = this._hasChoose(this.state.chooseSource, item) != -1;
        // console.log('_renderItemComponent ' + index + "is" + isSelected);
        return (
            <ImageItemView
                index={index}
                itemSize={ITEM_SIZE}
                itemData={item}
                onChooseClick={this._onChooseClick}
                onClick={this._onItemClick}
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
    _onRefresh = ()=> {
        if (!this.state.dataSource || this.state.dataSource == undefined || this.state.dataSource.length == 0) {
            this.setState({refreshing: true});//开始刷新
            //这里模拟请求网络，拿到数据，3s后停止刷新
            this.timer = setTimeout(() => {
                var data = [];
                for (var i = 0; i < 10; i++) {
                    data.push({
                        imageId: 'imageId' + i,
                        mMediaUrl: 'https://imagetest.pawjzs.com/web/banner/a4d382a8-04b0-4af0-a4b2-b4c75ea02f5b.jpg'
                    });
                }
                this.setState({
                    dataSource: data,
                    refreshing: false
                });
                clearTimeout(this.timer);
            }, 500);
        }
    };

    render() {
        //refreshing={this.state.refreshing}//下拉刷新在FlatList加上这两个属性
        // onRefresh={this._onRefresh}
        if(this.state.isGettingData) {//获取数据时，展示ProgressBar
            return (
                <View style={styles.container}>
                    <TitleBar
                        topTitle={this.state.bucketName}
                        rightBtnText={'finish'}
                        navigation={this.props.navigation}
                        onLeftBtnClick={this._onLeftBtnClick}
                        onRightBtnClick={this._onRightBtnClick}
                        onTitleClick={this._onTitleClick}/>

                    <View style={styles.dividerLine} />

                    <ActivityIndicator style={styles.loadingProgress} size="large" />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <TitleBar
                    topTitle={this.state.bucketName}
                    rightBtnText={'finish'}
                    navigation={this.props.navigation}
                    onLeftBtnClick={this._onLeftBtnClick}
                    onRightBtnClick={this._onRightBtnClick}
                    onTitleClick={this._onTitleClick}
                />

                <View style={styles.dividerLine} />

                <View style={styles.container}>
                    <FlatList
                        numColumns={4}
                        data={this.state.dataSource}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItemComponent}
                        ListHeaderComponent={this._renderHeader}
                        ListEmptyComponent={this._emptyView}
                        getItemLayout={this._getItemLayout}
                        initialNumToRender={1}
                    />

                    <Animated.View style={[
                        styles.gallery,
                        {
                            transform: [
                                {
                                    translateY: this.state.popAnim.interpolate({
                                        inputRange:[0, 1],
                                        outputRange: [galleyAnimTranslateY, 0]
                                    })
                                }
                            ]
                        }
                    ]}>
                        <GalleryListView gallerySource={this.state.gallerySource} onItemClick={this._onGalleryItemClick}/>
                    </Animated.View>
                </View>
            </View>
        );
    }
}
//transform是一个变换数组，常用的有scale, scaleX, scaleY, translateX, translateY, rotate, rotateX, rotateY, rotateZ：

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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

    gallery: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        right:0,
    },

    dividerLine: {
        height: 0.5,
        backgroundColor: Colors.common_border_line
    },

    loadingProgress : {
        marginTop: 20,
    },
});
