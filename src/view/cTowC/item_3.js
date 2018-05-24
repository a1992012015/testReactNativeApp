/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 兑换记录界面组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    RefreshControl,
    Dimensions,
    FlatList,
    ScrollView,
} from 'react-native';

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';
import Loading from '../../components/loading';
import BuySellModal from './buySellModal';

const {width} = Dimensions.get('window');
const request = new Request();

export default class Item_3 extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            loading: true,
            isOpen: false,
            isType: 'buy',
        }
    }

    //真实的结构渲染出来之后调用
    componentDidMount() {
        this.setState({
            orderList: this.props.c2cBuySellList.orderList,
            coinCode: this.props.coinCode,
            loading: false,
        })
    }

    //接收一个新的props调用
    componentWillReceiveProps(props) {
        const {coinCode, c2cBuySellList} = props;
        this.setState({
            coinCode: coinCode,
            orderList: c2cBuySellList.orderList,
            loading: false,
        })
    }

    setItemText = () => {
        this.setState({
            isOpen: false
        })
    };
    //查看汇款详情
    getCTowCTransaction = item => {
        const {transactionType, transactionNum} = item;

        if (transactionType === 1) {
            this.setState({
                isType: 'buy',
            })
        } else {
            this.setState({
                isType: 'sell',
            })
        }
        //地址
        let url = config.api.ctc.getc2cTransaction;
        //参数
        const actions = {
            transactionNum: transactionNum,
        };

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            const {obj} = responseText;

            if (responseText.success) {
                this.setState({
                    buySellData: obj,
                    isOpen: true,
                })
            }
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        });
    };

    render() {
        return (
            <View style={{flex: 1, marginBottom: config.api.isTabView ? p(100) : 0}}>
                <ScrollView
                    style={{flex: 1, backgroundColor: '#fafafa'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => this.props.c2cBuySellFunction(this.state.coinCode)}
                        />
                    }>
                    <View style={styles.ViewFlex}>
                        {/*副标题*/}
                        <View style={{marginTop: p(30)}}>
                            <Text style={{color: '#00c2d2', fontSize: p(28), fontWeight: '500'}}>最近兑换记录</Text>
                        </View>

                        <View style={{height: p(2), backgroundColor: '#e6e6e6', width: width, marginTop: p(10)}}/>
                        {/*table列表选项*/}
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', marginTop: p(20)
                        }}>
                            <Text style={[styles.textRecord, {width: '15%', fontSize: p(26)}]}>时间</Text>
                            <Text style={[styles.textRecord, {width: '12%', fontSize: p(26)}]}>类型</Text>
                            <Text style={[styles.textRecord, {width: '15%', fontSize: p(26)}]}>数量</Text>
                            <Text style={[styles.textRecord, {width: '15%', fontSize: p(26)}]}>单价</Text>
                            <Text style={[styles.textRecord, {width: '15%', fontSize: p(26)}]}>总价</Text>
                            <Text style={[styles.textRecord, {width: '14%', fontSize: p(26)}]}>状态</Text>
                            <Text style={[styles.textRecord, {width: '12%', fontSize: p(26)}]}>信息</Text>
                        </View>

                        <View
                            style={{height: p(2), backgroundColor: '#e6e6e6', width: width - p(40), marginTop: p(20)}}/>
                        {/*列表具体的信息*/}
                        <FlatList
                            style={{marginTop: p(20)}}
                            horizontal={false}
                            onEndReachedThreshold={1}
                            refreshing={false}
                            data={this.state.orderList}
                            renderItem={({item}) => {
                                const {
                                    transactionTime,
                                    transactionType,
                                    transactionCount,
                                    transactionPrice,
                                    transactionMoney,
                                    status2,
                                } = item;
                                return (
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: p(2),
                                        borderBottomColor: '#e6e6e6'
                                    }}
                                    >
                                        <Text style={[styles.textRecord, {width: '15%'}]}>{transactionTime}</Text>
                                        <Text style={[styles.textRecord, {width: '12%'}]}>
                                            {transactionType === 1 ? '买' : '卖'}
                                        </Text>
                                        <Text style={[styles.textRecord, {width: '15%'}]}>{transactionCount}</Text>
                                        <Text style={[styles.textRecord, {width: '15%'}]}>{transactionPrice}</Text>
                                        <Text style={[styles.textRecord, {width: '15%'}]}>{transactionMoney}</Text>
                                        <Text style={[styles.textRecord, {width: '12%'}]}>
                                            {
                                                item.status === 3 && status2 === 3 ? '已否决(交易关闭)' :
                                                    item.status === 3 && status2 === 4 ? '已否决(交易失败)' :
                                                        item.status === 2 && status2 === 2 ? '已完成' :
                                                            status2 === 1 ? '未支付' :
                                                                status2 === 2 ? '已支付' :
                                                                    status2 === 3 ? '交易关闭' : '交易失败'
                                            }
                                        </Text>
                                        {
                                            transactionType !== 2 ?
                                                <Text
                                                    onPress={() => this.getCTowCTransaction(item)}
                                                    style={[styles.textRecord, {width: '16%', color: '#00c2d2'}]}
                                                >查看</Text>
                                                :
                                                <Text style={[styles.textRecord, {width: '16%', color: '#00c2d2'}]}/>
                                        }
                                    </View>
                                )
                            }}
                        />
                        {/*规则介绍*/}
                        <View style={{marginTop: p(60), marginBottom: p(40)}}>
                            <Text style={styles.promptText}>1.卖家为认证商户，可放心等待收款</Text>
                            <Text style={styles.promptText}>2.收款时请确认金额信息</Text>
                            <Text style={styles.promptText}>3.卖家确认收到款后，自动充值。如超过24小时未收到款项，请向客服反馈解决</Text>
                            <View style={{flexDirection: 'row', marginTop: p(20)}}>
                                <Text style={{color: 'red'}}>温馨提示：</Text>
                                <Text>如有任何疑问请联系在线客服或查看帮助中心。</Text>
                            </View>
                        </View>
                    </View>
                    {/*加载转圈特效*/}
                    <Loading visible={this.state.loading}/>
                </ScrollView>
                {/*详细信息的弹出层*/}
                <BuySellModal
                    {...this.props}
                    isOpen={this.state.isOpen}
                    setItemText={this.setItemText}
                    isType={this.state.isType}
                    buySellData={this.state.buySellData}
                    isGoBack={false}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    touchableStyle: {
        height: p(70),
        width: width - p(320),
        backgroundColor: '#f8671b',
        borderRadius: p(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputTextStyle: {
        flexDirection: 'row',
        height: p(120),
        alignItems: 'center',
        borderRadius: p(5),
        padding: p(8),
        marginTop: p(20),
        width: width - p(160),
        borderWidth: p(2),
        borderColor: '#e6e6e6',
        marginLeft: p(10)
    },
    inputTextView: {
        flex: 1,
        height: p(120),
        fontSize: p(26),
        color: '#565A5D'
    },
    promptText: {
        color: '#2b2b2b',
        fontSize: p(26),
        lineHeight: p(40),
        marginTop: p(20)
    },
    textRecord: {
        fontSize: p(24),
        color: '#292b2c',
        textAlign: 'center'
    },
    ViewFlex: {
        width: width - p(20),
        marginLeft: p(10)
    }
});