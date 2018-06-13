/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：交易记录
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import {Toast} from "teaset";

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';
import Title from '../../components/title';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class ClosingRecord extends PureComponent {
    constructor(props) {
        super(props);
        this._dataClosing = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            loadData: false,
            dataClosing: this._dataClosing.cloneWithRows([]),
            data: [],
            hasMore: true
        }
    }

    //在第一次渲染后调用，只在客户端
    componentDidMount() {
        //交易记录地址
        let url = config.api.main.apptradeslist;

        const {params} = this.props.navigation.state;
        const {mobile} = params.member;

        const actions = {
            offset: 0,
            limit: '10',
            type: '0',
            phone: mobile,
        };

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                Toast.fail('接口请求失败');
                this.props.navigation.goBack(null);
                return;
            }

            let data = responseText.rows;
            let listLength = responseText.rows.length;

            this.setState({
                loadData: true,
                dataClosing: this.state.dataClosing.cloneWithRows(data),
                data: data
            });

            if (listLength < 10 || this.pageIndex * 10 >= responseText.total) {
                this.setState({
                    hasMore: false
                })
            } else {
                this.pageIndex = 2;
            }
        }).catch((error) => {
            console.log('进入失败函数 =>', error);
        });
    }

    //DOM移除立刻调用
    componentWillUnmount() {
        /*数据获取失败关闭页面后弹出提示窗 => 取消不用了*/
        /* const { onClose } = this.props.navigation.state.params;
         onClose();*/
    }

    pullUP = () => {
        if (this.pageIndex > 1) {
            //地址
            let url = config.api.main.apptradeslist;
            //参数
            const actions = {
                offset: (this.pageIndex - 1) * 10,
                limit: 10,
            };

            request.post(url, actions, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                let listLength = responseText.rows.length;

                if (listLength > 0) {
                    let arr = this.state.data;
                    arr.push(...responseText.rows);

                    this.setState({
                        loadData: true,
                        dataClosing: this.state.dataClosing.cloneWithRows(arr),
                        data: arr
                    });

                    if (listLength < 10 || this.pageIndex * 10 >= responseText.total) {
                        this.setState({
                            hasMore: false
                        });
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex++;
                    }
                } else {
                    this.setState({
                        hasMore: false
                    });
                    this.pageIndex = 1;
                }
            }).catch((error) => {
                console.log('进入失败函数 =>', error);
            });
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
                <View style={{flex: 1, backgroundColor: '#1F2229'}}>
                    <Title titleName="成交记录" canBack={true} {...this.props}/>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#313840',
                        paddingVertical: p(20),
                        paddingHorizontal: p(10),
                    }}>
                        <Text style={[styles.textRecord, {width: '16%'}]}>时间</Text>
                        <Text style={[styles.textRecord, {width: '14%'}]}>类型</Text>
                        <Text style={[styles.textRecord, {width: '14%'}]}>种类</Text>
                        <Text style={[styles.textRecord, {width: '14%'}]}>单价</Text>
                        <Text style={[styles.textRecord, {width: '14%'}]}>数量</Text>
                        <Text style={[styles.textRecord, {width: '14%'}]}>金额</Text>
                        <Text style={[styles.textRecord, {flex: 1}]}>手续费</Text>
                    </View>
                    <ListView
                        horizontal={false}
                        dataSource={this.state.dataClosing}
                        renderRow={this._quotRow}
                        onEndReachedThreshold={20}
                        onEndReached={this.pullUP}
                        renderFooter={this._renderFooter}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.list}
                        removeClippedSubviews={true}

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

    /*科学计数法转换数值*/
    convertNum = (num) => {
        let result = num.toString();

        // 判断一下有没有减号
        if (result.indexOf('-') >= 0) {
            result = '0' + String(Number(result) + 1).substr(1);
            return result;
        }else{
            return result;
        }
    };

    _quotRow = row => {
        const {transactionTime, type, coinCode, transactionPrice = 0, transactionCount = 0, transactionSum = 0, transactionFee = 0} = row;

        return (
            <View style={{
                flexDirection: 'row', padding: p(10), borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#41484F', alignItems: 'center'
            }}>
                <Text style={[styles.textRecord, {width: '16%'}]}>{transactionTime}</Text>
                <Text style={{width: '14%', textAlign: 'center', color: type === 1 ? '#D95411' : '#018F67'}}>
                    {type === 1 ? '买' : '卖'}
                </Text>
                <Text style={[styles.textRecord, {width: '14%'}]}>{coinCode}</Text>
                <Text style={[styles.textRecord, {width: '14%'}]}>{this.convertNum(transactionPrice)}</Text>
                <Text style={[styles.textRecord, {width: '14%'}]}>{this.convertNum(transactionCount)}</Text>
                <Text style={[styles.textRecord, {width: '14%'}]}>{this.convertNum(transactionSum)}</Text>
                <Text style={[styles.textRecord, {flex: 1}]}>{this.convertNum(transactionFee)}</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    textViewTop: {
        color: '#ACB3B9',
        fontSize: p(24),
        marginLeft: p(8),
    },
    quotView: {
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textFont: {
        color: '#FFFFFF',
    },
    textRecord: {
        color: '#ACB3B9',
        textAlign: 'center',
    },
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width,
    },
    loadingText: {
        fontSize: p(25),
        color: '#ACB3B9',
    }
});