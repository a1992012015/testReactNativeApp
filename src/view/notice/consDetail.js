/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：公告页面
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    WebView,
    Text,
    Dimensions,
} from 'react-native'

const { height } = Dimensions.get('window');


import p from '../../utils/tranfrom';
import Title from '../../components/title';
import SModal from '../../components/SModal';

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
        const { params } = this.props.navigation.state;
        const content = params.content;
        const title = params.title;

        this.setState({
            newsBody : content,
            title: title,
            isLoading: true,
        })
    }

    render() {
        const { newsBody, isLoading, title } = this.state;
        const newsBodyContent = newsBody ? newsBody : '暂无资讯';

        if (isLoading) {
            if (newsBodyContent === '暂无资讯') {
                return <View style={{justifyContent:'center',alignItems: 'center',height:height-p(400)}}>
                    <Image
                        source={require('../../static/notice/notAvailable.png')}
                        style={{
                            tintColor: '#888888',
                            width: p(200),
                            height: p(150),
                            resizeMode: Image.resizeMode.stretch,
                        }}
                    />
                    <Text style={{color:'#888888',marginTop:p(40)}}>暂无咨询</Text>
                </View>
            } else {
                return(
                    <View style={{flex:1,backgroundColor: '#FFFFFF'}}>
                        <Title titleName="资讯详情" canBack={true} {...this.props}/>
                        <WebView
                            /*source={{
                                html: `<!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8">
                             <meta name="viewport" content="width=device-width,maximum-scale=2.0,minimum-scale=1.0,initial-scale=1.0,user-scalable=1,target-densitydpi=high-dpi">
                            <style type="text/css">
                                 @media screen and (max-width:768px) {
                                            img{max-width:100%;}
                                            #content{width:100%}
                                        }
                            </style>
                            </head>
                            <body><div style="font-size: 16px;font-weight: bold;color:#7d7b7b;text-align: center;padding: 20px 0;overflow: hidden;border-bottom: 1px solid #EFEFEF;">
                            ${title}</div>${newsBodyContent}<script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;}</script></body></html>`
                            }}*/
                            source={this.newsData(newsBody)}
                            style={{flex: 1}}
                            contentInset={{top: 0, left: 0}}
                            onNavigationStateChange={title => {
                                if(title.title !== undefined) {
                                    this.setState({
                                        height:(parseInt(title.title)+20)
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
    /*新闻的显示的组件*/
    newsData = content => {
        return (
            <View>{content}</View>
        )
    };
}


