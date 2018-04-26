/**
 *  图片文件夹列表
 * Created by chenzhiqiang247 on 2018-01-12.
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    TouchableHighlight
} from 'react-native';

import Colors from './Colors';

export default class GalleryListView extends Component {

    _keyExtractor = (item, index) => item.bucketId;

    //每一个item的数据源的格式为{ item:{...},index: 0,separators:{...} }
    //因此以({item, index}) =>{}的形式来写参数
    _renderItemComponent = ({item, index}) => {
        return (
            <TouchableHighlight underlayColor={Colors.common_second_color} activeOpacity={0.7} onPress={()=> this.props.onItemClick(item.bucketId, item.bucketDisplayName)}>
                <View style={styles.itemContainer}>
                    <Image style={styles.ivPhoto} source={{uri: Platform.OS === 'android' ? 'file://' + item.firstImagePath : item.firstImagePath}}/>
                    <Text style={styles.tvPhotoName}>{item.bucketDisplayName +'(' + item.count + ')'}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    //分隔线
    _renderDividerLine = ()=> {
        return (
            <View style={styles.dividerLine}/>
        )
    };

    render() {
        return (
            <FlatList style={styles.listContainer}
                data={this.props.gallerySource}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItemComponent}
                ItemSeparatorComponent={this._renderDividerLine}
                initialNumToRender={4}
            />
        )
    }
}

const styles = StyleSheet.create({

    listContainer : {
        flex: 1,
        height: 221.5,
    },

    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 5,
    },

    ivPhoto: {
        width: 45,
        height: 45,
    },

    tvPhotoName: {
        fontSize: 14,
        marginLeft: 10,
        color: Colors.common_primary_color,
        textAlign: 'center',//文本对齐方式
        textAlignVertical: 'center',//Android
    },

    dividerLine: {
        height: 1,
        backgroundColor: Colors.common_border_line
    }

});