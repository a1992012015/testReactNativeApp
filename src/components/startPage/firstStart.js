/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：APP首次启动时展示图片
 *
 */
'use strict';

import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'

import appUrl from '../../utils/urlConfig'
import p from '../../utils/tranfrom'

const {width, height} = Dimensions.get('window');

class FirstStart extends Component {
    // 默认属性
    static defaultProps = {};
    // 属性类型
    static propTypes = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        /*this.state = {};*/
    }

    _toLogin = () => {
        console.log('进入函数');
        const {enterSlide} = this.props;
        /*enterSlide();
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'TabBar'})
            ]
        });
        this.props.navigation.dispatch(resetAction);*/

    };
    // 渲染
    render() {
        const {wrapper, dot, activeDot, btnStyle, page} = styles;
        return (
            <View style={{flex:1}}>
                <Swiper autoplay={false}
                        style={wrapper}
                        height={height}
                        dot={<View style={dot}/>}
                        activeDot={<View style={activeDot}/>}
                        paginationStyle={{bottom: p(60), left: 0, right: 0}}
                        loop={false}
                >
                    {
                        appUrl.api.guideImage.map((item,index)=>{
                            return(
                                <View key={index}>
                                    {
                                        appUrl.api.guideImage.length-1 === index?

                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={this._toLogin}
                                                style={btnStyle}>
                                                <Image style={page}
                                                       source={appUrl.api.guideImage[index]}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <Image style={page}
                                                   source={appUrl.api.guideImage[index]}
                                            />
                                    }
                                </View>

                            )
                        })
                    }
                </Swiper>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    page: {
        width: width,
        height: height,
        resizeMode: 'stretch',

    },
    btnStyle: {
        width: width,
        height: height,
    },
    textSty: {
        fontSize: p(32),
        color: 'white',
        fontWeight: '500',

    }
});


export default connect((state) => {
    const {MineReducer} = state;
    return {
        MineReducer
    }
})(FirstStart);