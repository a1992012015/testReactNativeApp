/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：公告页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text
} from 'react-native' ;
import {connect} from 'react-redux';


class Notice extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <View>
                <Text>这里是公告页面</Text>
            </View>
        );
    }
}

export default Notice;