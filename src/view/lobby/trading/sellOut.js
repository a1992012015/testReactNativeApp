/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：交易大厅页面 => 卖出组件
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView,
    RefreshControl
} from 'react-native';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import Request from '../../../utils/request';
import I18n from '../../../utils/i18n';
import Loading from '../../../components/loading';
import {InitUserInfo} from '../../../store/actions/HomeAction';

const {width, height} = Dimensions.get('window');
const request = new Request();

class SellOut extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            buyData: [],
            sellData: [],
            tradingData: null,
            isLogin: false,
            member: null,
            coinCode: null,
            balance: true,
            buyFeeRate: 0,//买的手续费
            sellFeeRate: 0,//卖的
            turnover: 0,
            service: 0,
            businessData: null,
            entrustPrice: 0,//买入价格
            entrustCount: 0,//买入数量,
            available: 0,
            frozen: 0,
            canBuyCoin: 0,
            canSellMoney: 0,
            isTrade: "1",
            user: null,
            getMoney: false,
            availableMoney: 0,
            frozenMoney: 0,
            visible: false,
            buttonColor: '#018F67',
            KeepDecimalForCoin: 4,
        };
    }

    //接收到一个先的props的时候调用
    componentWillReceiveProps(props) {

        let {buyData, sellData, tradingData, isLogin, member, businessData, personal, coinCode, user} = props;
        const {ref_price, ref_count} = this.refs;

        if (coinCode !== this.state.coinCode) {

            this.setState({
                coinCode: coinCode,
            }, () => {
                this.queryCoin();
            });

            ref_price.clear();
            ref_count.clear();

            this.setState({
                entrustPrice: 0,
                entrustCount: 0,
            })
        }
        const {price_keepDecimalFor} = businessData;

        this.setState({
            buyData: buyData,
            sellData: sellData,
            tradingData: tradingData,
            isLogin: isLogin,
            member: member,
            businessData: businessData,
            coinCode: coinCode,
            KeepDecimalForCoin: price_keepDecimalFor == null ? 4 : price_keepDecimalFor
        });

        if (isLogin) {
            this.setState({
                buyFeeRate: personal.buyFeeRate,
                sellFeeRate: personal.sellFeeRate,
                available: personal.available,
                frozen: personal.frozen,
                canBuyCoin: personal.canBuyCoin,
                canSellMoney: personal.canSellMoney,
                user: user,
                isTrade: user && user.isTrade,
                frozenMoney: personal.frozen,
                availableMoney: personal.available,
            })
        }
    }

    //委托成功重新查询可用余额和币
    queryCoin = () => {
        //地址
        let url = config.api.trades.appgetAccountInfo;
        //参数
        const actions = {
            symbol: this.state.coinCode,
        };

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            if (responseText.obj) {
                let account = responseText.obj;
                this.setState({
                    availableMoney: account.coinAccount ? parseFloat(account.coinAccount.hotMoney) : 0,
                    frozenMoney: account.coinAccount ? parseFloat(account.myAccount.hotMoney) : 0,
                    getMoney: true
                }, () => {
                    this.isLoginType()
                })

            }
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        })
    };

    isLoginType = () => {
        let {isLogin, coinCode} = this.state;
        if (isLogin) {
            const currName = coinCode ? coinCode.split("_") : 'CNY';
            return (
                <View style={{marginTop: p(20)}}>
                    <View style={{marginLeft: p(10)}}>
                        <Text style={[styles.textPrice, {color: '#D95411', marginTop: p(10)}]}>
                            {I18n.t("available")}{currName[1]}：
                            {this.state.getMoney ? this.state.frozenMoney : this.state.frozen}
                        </Text>
                        <Text style={[styles.textPrice, {color: '#018F67', marginTop: p(10)}]}>
                            {I18n.t("available")}{currName[0]}：
                            {this.state.getMoney ? this.state.availableMoney : this.state.available}
                        </Text>
                    </View>
                </View>
            )
        } else {
            return (
                <TouchableOpacity
                    style={{alignItems: 'center', justifyContent: 'center', width: width * .45, height: height * .33}}
                    onPress={() => {
                        this.props.navigation.navigate('Login', {ISForm: true});
                    }}
                    activeOpacity={.8}
                >
                    <Image
                        style={{width: p(120), height: p(120)}}
                        source={require('../../../static/lobby/user.png')}
                    />
                    <Text style={{marginTop: p(30)}}>{I18n.t("tradlogin")}</Text>
                </TouchableOpacity>
            )
        }
    };

    purchase = () => {
        const {toast} = this.refs;

        if (null == this.state.entrustPrice || '' === this.state.entrustPrice || this.state.entrustPrice === 0) {
            toast.show('请输入委托价格', DURATION.LENGTH_SHORT);
            return;
        }
        //验证价格
        if (isNaN(this.state.entrustPrice) || this.state.entrustPrice < 0) {
            toast.show('请输入正确的价格', DURATION.LENGTH_SHORT);
            return;
        }

        if (null == this.state.entrustCount || '' === this.state.entrustCount || this.state.entrustCount === 0) {
            toast.show('请输入委托数量', DURATION.LENGTH_SHORT);
            return;
        }

        if (isNaN(this.state.entrustCount) || this.state.entrustCount <= 0) {
            toast.show('请输入正确的数量', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.isLogin) {
            const currName = this.state.coinCode ? this.state.coinCode.split("_") : 'CNY';
            if (parseFloat(this.state.entrustCount) > parseFloat(this.state.available)) {
                toast.show(currName[0] + '不足', DURATION.LENGTH_SHORT);
                return;
            }

            if (this.state.isTrade === "0" || this.state.isTrade === 0) {
                this.realNameJump(this.state.user.user, 1);
            } else {
                this.requestMethod();
            }
        } else {
            this.props.navigation.navigate('Login', {ISForm: true});
        }
    };

    /*提交订单*/
    requestMethod = () => {
        this.setState({
            visible: true
        }, () => {
            //地址
            let url = config.api.trades.trans;
            //参数
            const actions = {
                type: 2,
                entrustPrice: this.state.entrustPrice,
                entrustCount: this.state.entrustCount,
                coinCode: this.state.coinCode,
                entrustWay: 1,
            };

            const {toast} = this.refs;

            request.post(url, actions, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                const {success, msg} = responseText;
                const {queryCoinEntrust} = this.props;

                if (success) {
                    this.setState({
                        balance: true,
                        entrustPrice: '',
                        entrustCount: '',
                        visible: false
                    }, () => {
                        this.queryCoin();
                        const {dispatch} = this.props;
                        dispatch(InitUserInfo(this.props));
                        queryCoinEntrust();
                    });

                    toast.show(msg, DURATION.LENGTH_SHORT);
                } else {
                    this.setState({
                        visible: false
                    });

                    toast.show(msg, DURATION.LENGTH_SHORT);
                }
            }).catch(error => {
                console.log('进入失败函数', error);
            });
        });
    };

    /*没有实名制的判断*/
    realNameJump = (memberInfo, type) => {
        const {states} = memberInfo;

        if (states === 0 || states === "0") {
            Alert.alert(
                '提示',
                '请先实名认证',
                [{
                    text: '确认',
                    onPress: () => this.props.navigation.navigate("realAuthentication", {
                        member: memberInfo,
                        infoAction: this.upState
                    })
                }]
            );
        } else if (states === 1 || states === "1") {
            Alert.alert(
                '提示',
                '实名认证审核中',
                [{
                    text: '确认', onPress: () => {
                    }
                }]
            );
        } else if (states === 3 || states === "3") {
            Alert.alert(
                '提示',
                '实名申请被拒绝，请重新认证',
                [{
                    text: '确认',
                    onPress: () => this.props.navigation.navigate("realAuthentication", {
                        member: memberInfo,
                        infoAction: this.upState
                    })
                }],
            )
        } else {
            if (type === 1) {
                this.requestMethod();
            } else {
                this.props.navigation.navigate('RechargeRMB', {member: this.state.member})
            }
        }
    };

    sellButton = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.purchase()
                }}
                style={{
                    height: p(70),
                    width: width * .44,
                    backgroundColor: '#018F67',
                    borderRadius: p(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{color: '#FFF'}}>{I18n.t("spotsell")}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        let {sellData, buyData, tradingData, coinCode, user} = this.state;
        let currName = coinCode ? coinCode.split("_") : 'CNY';
        const {toast} = this.refs;

        return (
            <ScrollView
                ontentContainerStyle={{marginBottom: p(100)}}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this.queryCoin}
                    />
                }
            >
                <View style={styles.container}>
                    <View style={{marginRight: p(20), alignItems: 'center'}}>
                        {/*卖出价格输入*/}
                        <View style={styles.inputView}>
                            <TextInput
                                ref="ref_price"
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                placeholder={I18n.t("weituojiage")}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                selectionColor={"#D95411"}
                                style={styles.inputTextView}
                                value={this.state.entrustPrice.toString()}
                                onChangeText={text => {
                                    if (text === "" || text === 0 || text === null || /\s/.exec(text) !== null || isNaN(text)) {
                                        text = '';
                                    }

                                    this.calculation(text);
                                }}
                            />
                            <Text style={{fontSize: p(24)}}>{currName[1]}</Text>
                        </View>
                        {/*卖出数量输入*/}
                        <View style={styles.inputView}>
                            <TextInput
                                ref="ref_count"
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                placeholder={I18n.t("weituoshuliang")}
                                multiline={false}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                selectionColor={"#D95411"}
                                value={this.state.entrustCount.toString()}
                                style={styles.inputTextView}
                                onChangeText={text => {
                                    if (text === "" || text === null || /\s/.exec(text) !== null || isNaN(text)) {
                                        text = '';
                                    }

                                    if (parseFloat(text) < 0) {
                                        text = '';
                                        toast.show("请输入正确的委托数量", DURATION.LENGTH_SHORT);
                                    }

                                    let turnovers;
                                    if (text === '' || this.state.entrustPrice === '') {
                                        turnovers = 0;
                                    } else {
                                        turnovers = parseFloat(text) * parseFloat(this.state.entrustPrice);
                                    }

                                    let services = turnovers * parseFloat(this.state.buyFeeRate) / 100;

                                    this.setState({
                                        entrustCount: text,
                                        turnover: turnovers.toFixed(5),
                                        service: services.toFixed(5),
                                    }, () => {
                                        if (this.state.turnover > 0) {
                                            this.setState({
                                                buttonColor: '#EA2000'
                                            })
                                        } else {
                                            this.setState({
                                                buttonColor: '#018F67'
                                            })
                                        }
                                    });
                                }}
                            />
                            <Text style={{fontSize: p(24)}}>{currName[0]}</Text>
                        </View>
                        {/*总价显示*/}
                        <View style={styles.inputView}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                placeholder={I18n.t("jiaoyie")}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                selectionColor={"#D95411"}
                                editable={false}
                                value={this.state.turnover.toString()}
                                style={styles.inputTextView}/>
                            <Text style={{fontSize: p(24)}}>{currName[1]}</Text>
                        </View>
                        {/*说明*/}
                        <Text style={{
                            fontSize: p(22),
                            marginVertical: p(20),
                            width: width * .44
                        }}>{I18n.t("jiaoyitishi")}</Text>
                        {/*提交*/}
                        {this.sellButton(coinCode, user)}
                        {/*拥有数量*/}
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            width: width * .45,
                            marginTop: p(20),
                            height: height * .34
                        }}>
                            {this.isLoginType()}
                        </View>
                    </View>
                    <View style={{height: height * .8, backgroundColor: '#ccc', width: StyleSheet.hairlineWidth}}/>
                    <View style={{marginLeft: p(20), alignItems: 'center', paddingVertical: p(10)}}>
                        <TouchableOpacity
                            style={styles.panelView}
                        >
                            <View>
                                <Text style={[styles.textPriceB, {color: '#5f5f5f'}]}>单价</Text>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={[styles.textPriceB, {color: '#5f5f5f'}]}>数量</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{height: height * .31}}>
                            <FlatList
                                horizontal={false}
                                data={sellData}
                                renderItem={this.renderSellRow}
                                onEndReachedThreshold={1}
                                refreshing={false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.calculation(tradingData.priceNew + "")
                            }}
                            style={{
                                width: width * .44,
                                height: p(70),
                                backgroundColor: '#FFFFFF',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: p(10),
                                marginVertical: p(10),
                            }}>
                            <Text style={{fontSize: p(32)}}>
                                {currName[1] === "CNY" ? "￥" : currName[1]}
                                <Text style={{paddingLeft: p(10)}}>
                                    {tradingData ? tradingData.priceNew.toFixed(this.state.KeepDecimalForCoin) : ''}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                        <View style={{height: height * .31}}>
                            <FlatList
                                horizontal={false}
                                data={buyData}
                                renderItem={this.renderBuyRow}
                                onEndReachedThreshold={1}
                                refreshing={false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                    <Loading visible={this.state.visible}/>
                    <Toast
                        ref="toast"
                        style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                        position='top'
                        textStyle={{color: 'white'}}
                    />
                </View>
            </ScrollView>
        )
    }

    calculation = text => {
        const {toast} = this.refs;

        if (parseFloat(text) < 0) {
            text = '';
            toast.show("请输入正确的委托价格", DURATION.LENGTH_SHORT);
        }

        let turnovers;
        if (text === '' || this.state.entrustCount === '') {
            turnovers = 0;
        } else {
            turnovers = parseFloat(text) * parseFloat(this.state.entrustCount);
        }

        let services = turnovers * parseFloat(this.state.buyFeeRate) / 100;

        this.setState({
            entrustPrice: text,
            turnover: turnovers.toFixed(5),
            service: services.toFixed(5)
        }, () => {
            if (this.state.turnover > 0) {
                this.setState({
                    buttonColor: '#EA2000'
                })
            } else {
                this.setState({
                    buttonColor: '#018F67'
                })
            }
        });
    };

    renderSellRow = ({item}) => {
        if (item.value.price) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.calculation(item.value.price + "")
                    }}
                    style={styles.panelView}
                >
                    <View>
                        <Text style={styles.textPriceB}>
                            {item.value.price.toFixed(this.state.KeepDecimalForCoin)}
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={styles.textPriceB}>{item.value.amount}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    renderBuyRow = ({item}) => {
        if (item.value.price) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.calculation(item.value.price + "");
                    }}
                    style={styles.panelView}
                >
                    <View>
                        <Text style={styles.textPriceR}>
                            {item.value.price.toFixed(this.state.KeepDecimalForCoin)}
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={styles.textPriceR}>{item.value.amount}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFF0F2',
        flexDirection: 'row',
        paddingHorizontal: p(20)
    },
    inputView: {
        flexDirection: 'row',
        height: p(80),
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: p(5),
        padding: p(8),
        marginTop: p(20),
        width: width * .45,
        justifyContent: 'space-between'
    },
    inputTextView: {
        width: width * .3,
        fontSize: p(24),
        height: p(80)
    },
    textPriceB: {
        color: '#018F67',
        fontSize: p(20),
    },
    textPriceR: {
        color: 'red',
        fontSize: p(20),
    },
    panelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * .45,
        marginVertical: p(8)
    }
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(SellOut);