/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：扫码转币页面 => 二维码扫描页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    Alert,
    Image
} from 'react-native' ;
import Toast, {DURATION} from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import p from '../../utils/tranfrom';
import config from '../../utils/config';
import request from '../../utils/request';
import {InitUserInfo} from '../../store/actions/HomeAction';
import CheckModal from '../../components/checkModal';

class TurnoutCurrencyQR extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            intoData: '',
            btcKey: null,
            telephone: '133****9449',
            coinType: null,
            accountpwSmsCode: null,
            accountPassWord: null,
            btcNum: null,
            checkCodeText: "获取验证码",
            codeStyle: styles.codeObtain,
            codeSent: true,
            timeId: '',
            isCheckCode: false,
            turFee: 0,
            minTur: 1,
            maxTur: 1000000,
            feeTur: 0,
            actualTur: 0,
            rateType: 1,
            checkOpen: false,
            type: 0,
            valicode: null,
            user: null,
        };
    }

    //真实的结构渲染出来之后
    componentDidMount() {
        const {params} = this.props.navigation.state;

        this.setState({
            intoData: params.intoData,
            telephone: params.telephone,
            coinType: params.intoData.coinCode
        });

        this.getTurCost(params.intoData.coinCode);
    }

    //组件被移除之后
    componentWillUnmount() {
        clearInterval(this.state.timeId);
    }

    /**
     * 获取提现费率
     */
    getTurCost = coinType => {
        let url = `${config.api.currency.findCurry}?coinCode=${coinType}`;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            const {obj} = responseText;
            const {paceFeeRate, leastPaceNum, oneDayPaceNum} = obj;

            let fee = obj[1] ? obj[1].split(",")[0] : 0;

            this.setState({
                turFee: parseFloat(paceFeeRate ? paceFeeRate : responseText.obj[0].paceFeeRate),
                minTur: parseFloat(leastPaceNum ? leastPaceNum : responseText.obj[0].leastPaceNum),
                maxTur: parseFloat(oneDayPaceNum ? oneDayPaceNum : responseText.obj[0].oneDayPaceNum),
                guDingTur: fee,
                rateType: obj[2],
            });
        })
    };

    currencyOut = () => {
        const {toast} = this.refs;

        if (null === this.state.btcKey || '' === this.state.btcKey) {
            toast.show('请选择钱包地址', DURATION.LENGTH_SHORT);
            return;
        }

        if (isNaN(this.state.btcNum)) {
            toast.show('转出数量只能是数字', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.btcNum <= 0) {
            toast.show('转出数量必须大于0', DURATION.LENGTH_SHORT);
            return;
        }

        if (parseFloat(this.state.btcNum) > parseFloat(this.state.intoData.hotMoney)) {
            toast.show('提现币不能大于可用币', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.btcNum < this.state.minTur) {
            toast.show('单笔下单的数量小于最小下单数量' + this.state.minTur, DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.btcNum > this.state.maxTur) {
            toast.show('单日转出最大限额' + this.state.maxTur + '个币', DURATION.LENGTH_SHORT);
            return;
        }

        let url = `${config.api.currency.getbtc}?coinType=${this.state.coinType}&btcNum=${this.state.btcNum}&btcKey=${this.state.btcKey}&pacecurrecy=${this.state.feeTur}`;

        if (this.state.valicode != null) {
            url += `&valicode=${this.state.valicode}`;
        }

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);
            const {success, obj, msg} = responseText;

            if (success) {
                Alert.alert(
                    '提示',
                    '转出申请成功',
                    [{
                        text: '确认', onPress: () => {
                            const {dispatch} = this.props;
                            dispatch(InitUserInfo(this.props));
                            this.props.navigation.goBack()
                        }
                    }]
                );
            } else {
                if (obj) {
                    this.toCheck(responseText);
                } else {
                    this.setState({
                        valicode: null,
                        checkOpen: false
                    });
                    toast.show(msg, DURATION.LENGTH_SHORT);
                }
            }
        })
    };

    getQRValue = value => {
        this.setState({
            btcKey: value,
        });
    };

    withdrawCurrencyQR = code => {
        this.setState({
            valicode: code,
            checkOpen: false,
        }, () => {
            this.currencyOut();
        });
    };

    toCheck = responseText => {
        const {obj} = responseText;
        const {phone_googleState, phoneState, googleState} = obj;

        if (phone_googleState === 1) {
            this.setState({
                checkOpen: true,
                type: 2,
                user: obj,
            })
        } else if (phoneState === 1 && googleState === 0) {
            //手机认证
            this.setState({
                checkOpen: true,
                type: 0,
                user: obj,
            })
        } else if (phoneState === 0 && googleState === 1) {
            //谷歌认证
            this.setState({
                checkOpen: true,
                type: 1,
                user: obj,
            })
        } else {
            this.currencyOut();
        }
    };

    _click = () => {
        this.setState({
            checkOpen: false,
        });
    };

    // 渲染
    render() {
        return (
            <View style={styles.defaultView}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <Icon
                            name="ios-arrow-back-outline"
                            size={25}
                            color='#fff'
                            style={{paddingHorizontal: p(20)}}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>转出{this.state.intoData.coinName}</Text>
                    <View/>
                </View>
                <View style={styles.blockSty}>
                    <View style={{marginLeft: p(20)}}>
                        <Text style={styles.textPrice}>
                            可用{this.state.intoData.coinName}：
                            <Text style={{color: '#018F67'}}>
                                {this.state.intoData.hotMoney}
                            </Text>
                        </Text>
                        <Text style={styles.textPrice}>
                            冻结{this.state.intoData.coinName}：
                            <Text style={{color: '#F6574D'}}>
                                {this.state.intoData.coldMoney}
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>钱包地址:</Text>
                        <View style={styles.inputSty}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder={'请输入钱包地址'}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#B0B0B0'}
                                selectionColor="#D95411"
                                value={this.state.btcKey}
                                style={styles.inputTextView}
                                onChangeText={(text) => this.setState({btcKey: text})}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("CameraScanCode", {getQRValue: this.getQRValue})
                                }}
                                style={{marginRight: p(20)}}
                                activeOpacity={.8}>
                                <Image
                                    style={{width: p(40), height: p(40)}}
                                    source={require('../../static/mySelf/scanning.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>转出数量:</Text>
                        <View style={styles.inputSty}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder={'请输入提现数量'}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#B0B0B0'}
                                selectionColor={"#D95411"}
                                value={this.state.btcNum}
                                style={styles.inputTextView}
                                onChangeText={(text) => {
                                    if (text === "" || text == null || /\s/.exec(text) !== null || isNaN(text)) {
                                        text = 0;
                                    }
                                    let turNum = parseFloat(text);
                                    let feeTur = this.state.rateType === 2 ? this.state.guDingTur : turNum * this.state.guDingTur / 100;
                                    this.setState({
                                        feeTur: feeTur,
                                        actualTur: turNum - feeTur,
                                        btcNum: turNum
                                    });
                                }}
                            />
                        </View>
                    </View>
                    {
                        this.state.rateType === 2 ?
                            <Text style={{padding: p(10), backgroundColor: '#B0B0B0', fontSize: p(22), margin: p(20)}}>
                                网络手续费{this.state.guDingTur}{this.state.coinType}
                            </Text>
                            :
                            <Text style={{padding: p(10), backgroundColor: '#B0B0B0', fontSize: p(22), margin: p(20)}}>
                                手续费{this.state.feeTur}{this.state.coinType},实际到账{this.state.actualTur}{this.state.coinType}
                            </Text>
                    }
                </View>
                <View style={{marginHorizontal: p(20)}}>
                    <TouchableOpacity
                        onPress={this.currencyOut}
                        activeOpacity={0.8}
                        style={{
                            height: p(80),
                            backgroundColor: '#D95411',
                            borderWidth: 1,
                            margin: p(10),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: p(10)
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: p(26)}}>确认转出</Text>
                    </TouchableOpacity>
                    <View style={{
                        borderWidth: 1,
                        borderColor: 'transparent',
                        borderRadius: p(5),
                        backgroundColor: 'transparent',
                        margin: p(10)
                    }}>
                        <Text style={styles.promptText}>转出说明：</Text>
                        <Text style={styles.promptText}>
                            1.单笔转出最小币数{this.state.minTur}个{this.state.coinType}，单日转出最大币数{this.state.maxTur}{this.state.coinType}
                        </Text>
                        <Text style={styles.promptText}>
                            2.禁止向（{this.state.coinType}）地址充值除（{this.state.coinType}）之外的资产，任何充入（{this.state.coinType}）地址的非（{this.state.coinType}）资产将不可找回。
                        </Text>
                    </View>
                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color: 'white'}}
                />
                <CheckModal
                    checkOpen={this.state.checkOpen}
                    {...this.props}
                    type={this.state.type}
                    user={this.state.user}
                    withdraw={this.withdrawCurrencyQR}
                    click={this._click}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(110),
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#1F2229',
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(30),
        textAlign: 'center',
        fontWeight: '400',
    },
    goBack: {
        borderLeftWidth: p(4),
        borderBottomWidth: p(4),
        borderColor: '#313840',
        width: p(26),
        height: p(26),
        transform: [{rotate: '45deg'}],
        marginLeft: p(30),
    },
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: 1,
        borderRadius: p(5),
        borderColor: 'transparent',
        marginHorizontal: p(20),

    },
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228',
    },
    inputText: {
        color: 'white',
        paddingLeft: p(20),
        width: p(150),
    },
    inputTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        height: p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF',
    },
    reWithView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: p(70),
        marginTop: p(10),
    },
    promptText: {
        color: '#B0B0B0',
        fontSize: p(22)
    },
    textPrice: {
        color: '#FFFFFF',
        marginVertical: p(10),
    },
    codeObtain: {
        backgroundColor: "#D95411",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
        fontSize: p(26),
    },
    codeFalse: {
        backgroundColor: "#929BA1",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
        fontSize: p(26),
    },
    inputSty: {
        flex: 1,
        height: p(70),
        borderRadius: p(5),
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#313840',
        marginLeft: p(5),
    }
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(TurnoutCurrencyQR);