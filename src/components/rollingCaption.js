/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：公告信息轮播组件
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper';

import p from '../utils/tranfrom';
import config from '../utils/config';
import request from '../utils/request';

const { width } = Dimensions.get('window');

export default class RollingCaption extends PureComponent {

    static defaultProps = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            articleList: [],
            isLoading: false,
        };
    }
    //真实的DOM被渲染出来后调用
    componentDidMount() {
        //地址
        let url = config.api.index.article;
        //参数
        const actions = {
            type: 4,
            limit: 10,
            offset: 0,
            num: 10,
        };

        request.post(url, actions).then(response => {

            if(response.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }
            //console.log('获取公告信息=>', response);
            const { obj } = response;
            this.setState({
                articleList: obj,
                isLoading: true,
            })
        }).catch(error => {
            console.log('进入失败函数=>', error)
        });
    }
    //点击信息函数跳转到具体的公告
    newsDetail = id => {
        let url = config.api.index.articleContent;
        //参数
        const actions = {
            type : id,
        };

        request.post(url, actions).then(response => {

            if(response.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            const { obj } = response;
            this.props.navigation.navigate('consDetail', {content: obj.content,title: obj.title, ...this.props})
        }).catch(error => {
            console.log('进入失败函数=>', error)
        });
    };

    render() {
        const { articleList, isLoading } = this.state;

        if (isLoading) {
            return (
                <View style={styles.allViewStyle}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10}}>
                        <View style={{justifyContent: 'center',paddingVertical:p(20),paddingRight:p(20)}}>
                            <Image
                                source={require('../static/home/lg.png')}
                                style={{width: 20, height: 20, resizeMode: 'stretch'}}
                            />
                        </View>
                        <Swiper
                            style={{backgroundColor: '#313840', paddingHorizontal: 5}}
                            showsPagination={false} height={39} width={width - 65}
                            showsButtons={false} horizontal={false} autoplay={true} autoplayTimeout={5}>
                            {
                                articleList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={()=>this.newsDetail(item.id)}
                                            key={index}
                                            style={{justifyContent: 'center', height: 39}}
                                        >
                                            <Text style={{color: '#FFFFFF'}}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </Swiper>
                    </View>
                </View>
            )
        } else {
            return <View />
        }

    }

}

const styles = StyleSheet.create({
    allViewStyle: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#313840',
        height: 40,
        backgroundColor: '#313840'
    },
});


