/**
 * Created by chenzhiqiang247 on 2018-01-03.
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
} from 'react-native';

import TitleBar from './TitleBar';
import Constants from './Constants';
import StartChooseItemView from './StartChooseItemView';
import Colors from './Colors';

const ITEM_SIZE = Dimensions.get('window').width / 4 - 4;

export default class StartChoosePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        let camera = {};
        camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
        camera.mMeidaUrl = 'add photo';
        let dataSource = [];
        dataSource.push(camera);
        this.setState({
            dataSource: dataSource
        });
    }

    _keyExtractor = (item, index) => item.imageId;

    /**
     * 选择完照片回来更新数据
     * @param pictures
     * @private
     */
    _getPicFromDisplay = (pictures)=> {
        let camera = {};
        camera.imageId = Constants.TAKE_PHOTO_IMAGE_ID;
        pictures.push(camera);
        this.setState({
            dataSource: pictures
        });
    };

    _onClick = (index)=> {
        if (this.state.dataSource[index].imageId === Constants.TAKE_PHOTO_IMAGE_ID) {
            var dataSource = [];
            dataSource = dataSource.concat(this.state.dataSource);
            dataSource.pop();//移除末尾Camera
            this.props.navigation.navigate(Constants.DISPLAY, {
                pictures: dataSource,
                returnData: this._getPicFromDisplay
            });
        } else {
            this.props.navigation.navigate(Constants.PREVIEW, {param: '传值到preview', index: index});//预览
        }
    };

    _renderItemComponent = ({item, index}) => {
        return (
            <StartChooseItemView
                index={index}
                itemSize={ITEM_SIZE}
                itemData={item}
                onClick={this._onClick}>
            </StartChooseItemView>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <TitleBar
                    rightBtnText={""}
                    topTitle={'StartChoose'}
                />

                <View style={styles.dividerLine} />

                <FlatList
                    numColumns={4}
                    data={this.state.dataSource}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItemComponent}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    dividerLine: {
        height: 0.5,
        backgroundColor: Colors.common_border_line
    },
});