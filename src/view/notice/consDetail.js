/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：公告页面 => 详情页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Image,
    WebView,
    Text,
    Dimensions,
} from 'react-native';

import p from '../../utils/tranfrom';
import Title from '../../components/title';
import SModal from '../../components/sModal';

const {height} = Dimensions.get('window');

export default class ConsDetail extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isLoading: false,
            newsBody: '',
            height: 300,
            title: '',

        };
    }

    /*真是的DOM渲染出以后调用*/
    componentDidMount() {
        const {params} = this.props.navigation.state;
        const content = params.content;
        const title = params.title;

        this.setState({
            newsBody: content,
            title: title,
            isLoading: true,
        })
    }

    render() {
        const {newsBody, isLoading} = this.state;
        const newsBodyContent = newsBody ? newsBody : '暂无资讯';
        console.log(newsBodyContent);

        if (isLoading) {
            if (newsBodyContent === '暂无资讯') {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center', height: height - p(400)}}>
                        <Image
                            source={require('../../static/notice/notAvailable.png')}
                            style={{
                                tintColor: '#888888',
                                width: p(200),
                                height: p(150),
                                resizeMode: Image.resizeMode.stretch,
                            }}
                        />
                        <Text style={{color: '#888888', marginTop: p(40)}}>暂无咨询</Text>
                    </View>
                )
            } else {
                return (
                    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                        <Title titleName="资讯详情" canBack={true} {...this.props}/>
                        <WebView
                            source={{html: newsBody}}
                            style={{flex: 1}}
                            contentInset={{top: 0, left: 0}}
                            onNavigationStateChange={title => {
                                if (title.title !== undefined) {
                                    this.setState({
                                        height: (parseInt(title.title) + 20)
                                    })
                                }
                            }}
                        >
                        </WebView>
                    </View>
                )
            }
        } else {
            return (
                <SModal hasLoading={!isLoading}/>
            )
        }
    }
}