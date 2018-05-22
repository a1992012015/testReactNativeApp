/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：公告页面
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

import request from '../../utils/request'
import config from '../../utils/config'
import p from '../../utils/tranfrom';
import Title from '../../components/title';
import ListFooter from './listFooter';
import ListEmpty from './listEmpty';

const {width, height} = Dimensions.get('window');

export default class NewsList extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],
            refreshing: false,
            hasMore: true,
            loadData: false,
            viewType: null,
            keyword: null,
            hasLoading: null,
            obj: [],
        };
    }

    //真实的DOM渲染完成之后调用
    componentDidMount() {
        this.pullDown()
    }

    /*点击新闻的触发函数*/
    newsDetail = index => {
        console.log('点击俩表');

        const {obj} = this.state;

        this.props.navigation.navigate('ConsDetail', {
            content: obj[index].content,
            title: obj[index].title, ...this.props
        })
    };
    /*获取全部的新闻信息*/
    pullDown = () => {
        //地址
        let url = config.api.index.article;
        //参数
        const actions = {
            type: 4,
            limit: 10,
            offset: 0,
            num: 999999,
        };

        request.post(url, actions).then((responseText) => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            console.log("responseText", responseText);

            const {obj} = responseText;

            if (obj.length > 0) {
                let dataBlob = [];
                let i = 0;

                obj.map(function (item) {
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
                        obj,
                    });
                    this.pageIndex = 2;
                } else {
                    this.setState({
                        loadData: true,
                        hasMore: true,
                        data: dataBlob,
                        obj,
                    });
                }

            } else {
                this.setState({
                    loadData: true
                });
            }
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        })
    };
    /*滑动的最后的触发函数*/
    pullUp = () => {
        if (this.pageIndex > 1) {
            //地址
            let url = config.api.index.article;

            const actions = {
                type: 4,
                limit: 5,
                offset: ((this.pageIndex - 1) * 5),
                num: 999999,
            };

            request.post(url, actions).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    return;
                }

                console.log("responseText", responseText);
                const {obj, recordsTotal} = responseText;

                if (obj.length > 0 && (this.pageIndex - 1) * 10 < recordsTotal) {

                    let dataBlob = [];
                    let i = (this.pageIndex - 1) * 10;

                    obj.map(function (item) {
                        dataBlob.push({
                            key: i,
                            value: item,
                        });
                        i++;
                    });

                    let arr = this.state.data;
                    arr.push(...dataBlob);

                    this.setState({
                        data: arr
                    });
                    this.pageIndex++;
                }
                else {
                    this.setState({
                        hasMore: false
                    })
                }
            }).catch(error => {
                console.log('进入错误函数 =>', error);
            })
        }
    };

    /*_renderFooter = () => {
        if (!this.state.hasMore) {
            return (
                <View style={[styles.loadingMore,{height:this.state.viewType === 0 ?p(50):p(50)}]}>
                    <Text style={styles.loadingText}> 没有更多数据了</Text>
                </View> )
        }
    };*/

    render() {

        if (this.state.loadData) {
            return (
                <View style={{backgroundColor: '#1F2229', flex: 1}}>
                    <Title titleName="新闻公告" canBack={false} {...this.props}/>
                    <FlatList
                        style={{marginTop: p(20), marginBottom: p(100)}}
                        horizontal={false}
                        data={this.state.data}
                        renderItem={this._renderRow}
                        ListFooterComponent={<ListFooter hasMore={this.state.hasMore}/>}
                        ListEmptyComponent={<ListEmpty/>}
                        onEndReachedThreshold={1}
                        onEndReached={this.pullUp}
                        onRefresh={this.pullDown}
                        refreshing={false}
                        keyExtractor={(item, index) => index.toString()}
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

    _renderRow = ({item, index}) => {
        let {title, created} = item.value;

        return (
            <TouchableOpacity
                onPress={() => this.newsDetail(index)}
                activeOpacity={.8}
            >
                <View style={styles.newsItems}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{width: width * .8}}>

                            <Text style={{color: '#ffffff'}}>{title}</Text>

                            <Text style={{
                                fontSize: p(25),
                                paddingVertical: p(10),
                                color: '#ACB3B9',
                            }}>{created}</Text>
                        </View>
                        <Image
                            source={require('../../static/arrow.png')}
                            style={{
                                width: p(35),
                                height: p(35),
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
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
        color: '#cfcfcf',
    }
});

