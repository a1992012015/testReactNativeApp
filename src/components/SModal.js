/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：加载特效组件
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {Dimensions, View, StyleSheet, ActivityIndicator} from 'react-native' ;

import p from '../utils/tranfrom'

const {width, height} = Dimensions.get('window');
class SModal extends PureComponent {
    // 渲染
    render() {
        const { hasLoading } = this.props;
        return (
            hasLoading ?
                <View style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    bottom: 0,
                    height: height-p(110),
                    width: width,
                }}>
                    <ActivityIndicator animating={hasLoading}
                                       style={[styles.centering, {transform: [{scale: 1}]}]}
                                       size="small"
                    />
                </View>
                :
                <View />
        );
    }
}

let styles = StyleSheet.create({
    centering: {
        marginTop: (height - p(110)) / 2,
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default SModal;
