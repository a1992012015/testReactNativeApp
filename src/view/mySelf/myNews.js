/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：我的消息组件页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import store from 'react-native-simple-store';

import Request from '../../utils/request';
import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Title from '../../components/title';
import ListFooter from './listFooter';
import ListEmpty from './listEmpty';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class MyNews extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],
            //refreshing: false,
            hasMore: true,
            loadData: false,
            viewType: null,
            keyword: null,
            hasLoading: null
        };
    }

    //真实的结构渲染出来之后调用
    componentDidMount() {
        this.setState({
            loadData: true
        });

        this.pullDown()
    }

    newsDetail = (content, title) => {
        this.props.navigation.navigate('consDetail', {content: content, title: title, ...this.props})

    };

    pullDown = () => {
        let url = config.api.main.myMsg;
        //参数
        store.get('member').then(member => {
            console.log('=====================================');
            console.log(member);
            const {memberInfo} = member;
            const {mobile} = memberInfo;

            console.log(mobile);

            const actions = {
                email: mobile,
            };

            request.post(url, actions).then((responseText) => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    return;
                }

                request.manyLogin(this.props, responseText);
                let data = responseText.rows;
                if (data.length > 0) {
                    let dataBlob = [];
                    let i = 0;
                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        });
                        i++;
                    });
                    if (dataBlob.length > 5) {
                        this.setState({
                            loadData: true,
                            data: dataBlob,
                        });
                        this.pageIndex = 2;
                    } else {
                        this.setState({
                            loadData: true,
                            hasMore: true,
                            data: dataBlob
                        });
                    }
                } else {
                    this.setState({
                        loadData: true
                    });
                }
            });
        });
    };

    pullUp = () => {
        if (this.pageIndex > 1) {
            let url = config.api.main.myMsg;
            request.post(url).then((responseText) => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    return;
                }

                request.manyLogin(this.props, responseText);

                const {obj, recordsTotal} = responseText;

                if (obj.length > 0 && (this.pageIndex - 1) * 10 < recordsTotal) {
                    let data = responseText.rows;
                    let dataBlob = [];
                    let i = (this.pageIndex - 1) * 10;
                    data.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        });
                        i++;
                    });
                    let arr = this.state.data;
                    arr.push(...dataBlob);
                    this.setState({
                        data: arr,
                    });
                    this.pageIndex++;
                }
                else {
                    this.setState({
                        hasMore: false
                    })
                }
            })
        }
    };

    _renderFooter = () => {
        if (!this.state.hasMore) {
            return (
                <View style={[styles.loadingMore, {height: this.state.viewType === 0 ? p(50) : p(50)}]}>
                    <Text style={styles.loadingText}> 没有更多数据了</Text>
                </View>)
        }
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{backgroundColor: '#1F2229', flex: 1}}>
                    <Title
                        titleName="我的消息"
                        canBack={true}
                        {...this.props}
                    />
                    <FlatList
                        style={{marginTop: p(20)}}
                        horizontal={false}
                        data={this.state.data}
                        renderItem={this._renderRow}
                        ListFooterComponent={<ListFooter hasMore={this.state.hasMore}/>}
                        ListEmptyComponent={<ListEmpty/>}
                        onEndReachedThreshold={1}
                        onEndReached={this.pullUp}
                        onRefresh={this.pullDown}
                        refreshing={false}
                    />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height / 2}}
                    size="large"
                />
            )
        }
    }

    _renderRow = ({item}) => {
        let {title, sendDate} = item.value;

        if (title !== null) {
            title = title.replace('&ldquo;', '“');
            title = title.replace('&rdquo;', '”');
        }
        return (
            <TouchableOpacity

                onPress={() => this.newsDetail(item.value.content, title)}
                activeOpacity={.8}>
                <View style={styles.newsItems}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{width: width * .8}}>
                            <Text
                                style={{fontWeight: 'bold', fontSize: p(28), paddingVertical: p(10), color: '#FFFFFF'}}
                                numberOfLines={1}>
                                {title}
                            </Text>
                            <Text style={{fontSize: p(25), paddingVertical: p(10), color: '#ACB3B9'}}>{sendDate}</Text>
                        </View>
                        <Image source={require('../../static/arrow.png')}
                               style={{width: p(35), height: p(35)}}/>
                    </View>
                </View>
            </TouchableOpacity>)
    }
}
const styles = StyleSheet.create({
    content: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cfcfcf',
    },
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width
    },
    newsItems: {
        width: width,
        padding: p(10),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#8e8e8e',
    },
    loadingText: {
        fontSize: p(25),
        color: '#cfcfcf'
    }
});