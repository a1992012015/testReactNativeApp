/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人中心页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text
} from 'react-native' ;
import {connect} from 'react-redux';


class MySelf extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <View>
                <Text>这里是个人中心</Text>
            </View>
        );
    }
}

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(MySelf);