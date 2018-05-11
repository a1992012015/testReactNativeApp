/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：主页
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text
} from 'react-native' ;
import {connect} from 'react-redux';


class Home extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }
    // 渲染
    render() {
        return (
            <View>
                <Text>这里是主页</Text>
            </View>
        );
    }
}

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(Home);