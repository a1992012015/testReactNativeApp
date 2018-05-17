/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：公告页面 ==> 没有数据的显示组件
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

import p from '../../utils/tranfrom';

const { width, height } = Dimensions.get('window');

export default class ListEmpty  extends PureComponent {
    render() {
        return (
            <View style={styles.loadingMore}>
                <Text style={styles.loadingText}> 暂无数据</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        width: width,
        height: height - p(110),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: p(25),
        color: '#cfcfcf'
    },
});