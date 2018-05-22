/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：公告页面 => 没有数据的提示组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

import p from '../../utils/tranfrom';

const {width} = Dimensions.get('window');

export default class ListFooter extends PureComponent {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            hasMore: false
        };
    }

    render() {
        if (this.state.hasMore) {
            return (
                <View style={[styles.loadingMore, {height: this.state.viewType === 0 ? p(50) : p(50)}]}>
                    <Text style={styles.loadingText}> 没有更多数据了</Text>
                </View>)
        } else {
            return (<View/>)
        }
    }
}

const styles = StyleSheet.create({
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width,
        height: p(50),
    },
    loadingText: {
        fontSize: p(25),
        color: '#cfcfcf',
    },
});