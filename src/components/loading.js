/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：加载数据转圈组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, View, StyleSheet, ActivityIndicator} from 'react-native' ;

const {width, height} = Dimensions.get('window');

class Loading extends PureComponent {
    // 默认属性
    static defaultProps = {
        visible: true,
    };

    // 属性类型
    static propTypes = {
        visible: PropTypes.bool,
    };

    // 渲染
    render() {
        return (
            this.props.visible &&
            <View
                style={styles.contentView}>
                <View style={styles.viewSty}>
                    <ActivityIndicator
                        animating
                        style={[styles.centering, {transform: [{scale: 1}]}]}
                        size="small"
                        color='white'
                    />
                </View>
            </View>
        );
    }

}

let styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    viewSty: {
        height: 60, width: 60, backgroundColor: 'rgba(100,100,100,.5)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentView: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        height: height - 55,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Loading;
