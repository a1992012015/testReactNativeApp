/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：首页顶部轮播图组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Dimensions,
    View,
    StyleSheet,
    Image
} from 'react-native';
import Swiper from 'react-native-swiper';

import p from '../utils/tranfrom';
import config from '../utils/config';
import Request from '../utils/request';

const {width} = Dimensions.get('window');
const request = new Request();

class SwiperBanner extends PureComponent {
    // 默认属性
    static defaultProps = {};
    // 属性类型
    static propTypes = {};

    //构建
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            height: p(200),
            loop: true,
            isLoading: false
        }
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        const {height} = this.props;
        const url = config.api.index.banner;

        request.post(url, {}, this.props).then(response => {

            if (response.ok) {//判断接口是否请求成功
                return;
            }

            const {obj} = response;

            this.setState({
                images: obj,
                isLoading: true,
                height: height,
            })
        }).catch(error => {
            console.log('进入失败函数=>', error);
        })

    }

    // 渲染
    render() {
        const {images, height, loop, isLoading} = this.state;

        if (isLoading) {
            return (

                <Swiper
                    autoplay={true}                                 //是否自动播放
                    dot={<View style={styles.dot}/>}                //未选中的圆点样式
                    activeDot={<View style={styles.activeDot}/>}    //选中的小圆点样式
                    loop={loop}                                     //滑动到最后一张是否继续滑动
                    autoplayTimeout={4}                             //每隔4秒切换
                    paginationStyle={{                              //小圆点的位置：距离底部10px
                        bottom: p(10), left: 0, right: 0
                    }}
                    style={styles.wrapper}
                    height={height}
                >
                    {
                        images.map((item, index) => {
                            const {picturePath} = item;

                            return <Image
                                key={index}
                                source={{uri: `${config.api.host}${picturePath}`}}
                                style={[styles.page, {height: height}]}
                            />

                        })
                    }
                </Swiper>)
        } else {
            return <View
                style={{width: width, height: width * .5}}
                resizeMode='stretch'
            />
        }

    }

}

const styles = StyleSheet.create({

    page: {
        width: width,
        resizeMode: 'stretch',

    },
    dot: {
        backgroundColor: 'rgba(255,255,255,.5)',
        width: p(15),
        height: p(5),
        borderRadius: p(10),
        marginHorizontal: p(10),

    },
    activeDot: {
        borderColor: 'rgba(255,255,255,.9)',
        width: p(15),
        height: p(15),
        borderRadius: p(10),
        marginHorizontal: p(16),
        borderWidth: 2,
    },
});

export default SwiperBanner;
