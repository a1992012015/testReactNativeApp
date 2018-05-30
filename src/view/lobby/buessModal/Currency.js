/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：交易大厅页面 => 顶部切换币种下拉组件 => 下拉组件的每个选项组件
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    Text,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity
} from 'react-native';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';

const {width} = Dimensions.get('window');

export default class Currency extends PureComponent {

    static defaultProps = {
        currList: [],
    };

    ListClick = value => {
        this.props.setOpen(false);
        this.props.setItemText(value);
    };

    render() {
        const {currList} = this.props;
        console.log(currList);

        return (
            <FlatList
                style={{paddingHorizontal: p(20)}}
                horizontal={false}
                numColumns={4}
                data={currList}
                renderItem={this.renderCurrency}
                onEndReachedThreshold={1}
                refreshing={false}
                keyExtractor={(item, index) => index.toString()}
            />

        )
    }

    renderCurrency = ({item}) => {
        let value = item.value;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.ListClick(value.coinCode)
                }}
                style={{justifyContent: 'center', alignItems: 'center', width: width * .24, paddingTop: p(20)}}
            >
                <Image
                    style={{width: p(60), height: p(60)}}
                    source={{uri: config.api.host + value.picturePath}}
                />
                <Text numberOfLines={1}>{value.name}</Text>
            </TouchableOpacity>
        )
    }
}