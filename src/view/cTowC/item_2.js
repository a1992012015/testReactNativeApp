/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 卖出界面组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {Toast} from 'teaset'

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import request from '../../utils/request';
import Loading from '../../components/loading';
import BuySellModal from './buySellModal';

const {width, height} = Dimensions.get('window');

export default class Item_2 extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this.state = {
            loadData: true,
            coinCode: '',
            buyNum: '',
            loading: true,
            ctcMoney: 0,
        }
    }

    //实例渲染完成之后调用
    componentDidMount() {
        const {c2cSellPrice} = this.props.c2cBuySellList;
        this.setState({
            sellMoney: c2cSellPrice,
            coinCode: this.props.coinCode,
            loading: false,
        })
    }

    //接收到新的props调用
    componentWillReceiveProps(props) {
        const {coinCode, c2cBuySellList} = props;
        const {c2cSellPrice} = c2cBuySellList;
        const {ref_buyNum} = this.refs;

        this.setState({
            coinCode: coinCode,
            sellMoney: c2cSellPrice,
            ctcMoney: 0,
            loading: false
        });

        ref_buyNum.clear();
    }

    buyMoney = money => {
        this.setState({
            sellMoney: money
        })
    };

    buyNum = num => {
        this.setState({
            buyNum: num
        }, () => {
            let money = num * this.state.sellMoney;
            money = Math.floor(money * 100) / 100;
            this.setState({
                ctcMoney: money
            })
        })
    };

    appCreateTransaction = () => {
        if (this.state.sellMoney === '' || this.state.sellMoney === undefined) {
            Toast.fail("请填写卖出价");
            return;
        }

        if (this.state.buyNum === '' || this.state.buyNum === undefined) {
            Toast.fail("请填写卖出量");
            return;
        }

        if (isNaN(this.state.buyNum) || this.state.buyNum < 0) {
            Toast.fail('请输入正确的数量');
            return;
        }

        this.setState({
            loading: true
        });

        let url = `${config.api.ctc.appCreateTransaction}?transactionType=2&transactionPrice=${this.state.sellMoney}&transactionCount=${this.state.buyNum}&coinCode=${this.state.coinCode}`;

        request.post(url).then(responseText => {
            request.manyLogin(this.props, responseText);

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            this.setState({
                loading: false
            });

            const {obj, msg} = responseText;
            const {ref_buyNum} = this.refs;
            if (responseText.success) {
                Toast.success("卖出成功");
                this.setState({
                    buySellData: obj,
                    ctcMoney: 0,
                });

                this.props.c2cBuySellFunction(this.state.coinCode);
                ref_buyNum.clear();
            } else {
                Toast.fail(msg);
            }
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        });
    };

    prompt = () => {
        return (
            <View style={{marginLeft: p(10)}}>
                <Text style={styles.promptText}>1.C2C交易为用户之间点对点的交易，直接转账打币，平台不接受充值汇款;</Text>
                <Text style={styles.promptText}>2.买卖商户均为实名认证商户，并提供保证金，可放心兑换;</Text>
                <Text style={styles.promptText}>3.如需申请成为商户请发邮件到{this.mail()};</Text>
                <Text style={styles.promptText}>4.请使用本人绑定的银行卡进行汇款，其他任何方式汇款都会退款。（禁止微信和支付宝）;</Text>
                <Text style={styles.promptText}>5.商家处理时间9:00-21:00非处理时间的订单会在第二天9:00开始处理，一般接单后24小时内会完成打款。;</Text>
            </View>
        )
    };

    mail = () => {
        return "develop@hurong.com";
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, marginBottom: config.api.isTabView ? p(100) : 0}}>
                    <ScrollView
                        style={{flex: 1, backgroundColor: '#fafafa'}}
                    >
                        <View style={styles.ViewFlex}>
                            <View style={{marginTop: p(50)}}>
                                <Text style={styles.textStyle}>卖出：{this.state.coinCode}</Text>
                            </View>
                        </View>

                        <View style={styles.ViewFlex}>
                            <View style={styles.inputView}>
                                <TextInput
                                    editable={false}
                                    ref="ref_buyMoney"
                                    underlineColorAndroid='transparent'
                                    keyboardType="numeric"
                                    placeholder="卖出价 (￥)"
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#565A5D'}
                                    selectionColor={"#018F67"}
                                    style={styles.inputTextView}
                                    value={this.state.sellMoney}
                                    onChangeText={(text) => {
                                        this.buyMoney(text)
                                    }}
                                />
                                <Text style={{color: '#EA2000'}}>{this.state.sellMoney}</Text>
                            </View>
                        </View>
                        <View style={styles.ViewFlex}>
                            <View style={styles.inputTextStyle}>
                                <Text style={{color: '#565A5D'}}>卖出量({this.state.coinCode})：</Text>
                                <TextInput
                                    ref="ref_buyNum"
                                    underlineColorAndroid='transparent'
                                    keyboardType="numeric"
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#565A5D'}
                                    selectionColor={"#018F67"}
                                    style={styles.inputTextView}
                                    value={this.state.buyNum}
                                    onChangeText={(text) => {
                                        this.buyNum(text)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: p(64), marginTop: p(30), alignItems: 'center'}}>
                            <Text style={styles.textStyle}>需要</Text>
                            <Text style={{color: '#018F67', marginLeft: p(10), marginRight: p(10), fontSize: p(30)}}>
                                {this.state.ctcMoney}
                            </Text>
                            <Text style={styles.textStyle}>CNY</Text>
                        </View>
                        <View style={[styles.ViewFlex, {marginTop: p(40)}]}>
                            <TouchableOpacity
                                onPress={() => this.appCreateTransaction()}
                                style={styles.touchableStyle}
                            >
                                <Text style={{color: '#FFF'}}>立即卖出</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.ViewFlex, {marginTop: p(30), alignItems: 'center'}]}>
                            {this.prompt()}
                        </View>

                        <Loading visible={this.state.loading}/>
                    </ScrollView>
                    <BuySellModal
                        isOpen={this.state.isOpen}
                        isType="sell"
                        {...this.props}
                        buySellData={this.state.buySellData}
                        isGoBack={false}
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

}

let styles = StyleSheet.create({
    promptText: {
        color: '#2b2b2b',
        fontSize: p(26),
        lineHeight: p(40),
        marginTop: p(20),
    },
    touchableStyle: {
        height: p(70),
        width: width - p(120),
        backgroundColor: '#f8671b',
        borderRadius: p(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputTextStyle: {
        flexDirection: 'row',
        height: p(80),
        alignItems: 'center',
        borderRadius: p(5),
        padding: p(8),
        marginTop: p(20),
        width: width - p(120),
        borderWidth: p(2),
        borderColor: '#e6e6e6',
    },
    inputTextView: {
        flex: 1,
        height: p(80),
        fontSize: p(26),
        color: '#018F67',
    },
    inputView: {
        flexDirection: 'row',
        height: p(80),
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderRadius: p(5),
        padding: p(8),
        marginTop: p(20),
        width: width - p(120),
    },
    textStyle: {
        color: '#646464',
        fontSize: p(28),
    },
    ViewFlex: {
        width: width - p(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(10),
    }
});