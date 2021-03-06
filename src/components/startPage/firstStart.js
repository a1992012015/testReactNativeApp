/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：APP首次启动时展示图片
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {connect} from 'react-redux';
import {StackActions, NavigationActions} from 'react-navigation';

import {START_PAGE_DATA} from '../../store/actions/ActionTypes';
import appUrl from '../../utils/urlConfig';
import p from '../../utils/tranfrom';

const {width, height} = Dimensions.get('window');

class FirstStart extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    //首次启动app点击最后一张图片的操作函数
    _toLogin = () => {

        const {dispatch, navigation} = this.props;

        dispatch({type: START_PAGE_DATA});

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'TabBar'})],
        });

        navigation.dispatch(resetAction);
    };

    // 渲染
    render() {
        const {wrapper, dot, activeDot, btnStyle, page} = styles;
        return (
            <View style={{flex: 1}}>
                <Swiper
                    autoplay={false}
                    style={wrapper}
                    height={height}
                    dot={<View style={dot}/>}
                    activeDot={<View style={activeDot}/>}
                    paginationStyle={{bottom: p(60), left: 0, right: 0}}
                    loop={false}
                >
                    {
                        appUrl.api.guideImage.map((item, index) => {
                            return (
                                <View key={index}>
                                    {
                                        appUrl.api.guideImage.length - 1 === index ?//当是最后一张图片的时候则添加点击事件
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={this._toLogin}
                                                style={btnStyle}>
                                                <Image
                                                    style={page}
                                                    source={appUrl.api.guideImage[index]}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <Image
                                                style={page}
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
    const {StartPage} = state;
    return {
        StartPage,
    }
})(FirstStart);