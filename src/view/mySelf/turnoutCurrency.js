/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人中心 => 充币界面 => 具体的币种信息
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import {connect} from 'react-redux';

import p from '../../utils/tranfrom';
import config from '../../utils/config';
import Request from '../../utils/request';
import {InitUserInfo} from '../../store/actions/HomeAction';
import CheckModal from '../../components/checkModal';
import Loading from '../../components/loading';
import SelectApp from '../../components/selectApp';

const request = new Request();

class TurnoutCurrency extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            intoData: '',
            addressList: [],
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
            guDingTur: 0,
            rateType: 1,
            checkOpen: false,
            type: 0,
            valicode: null,
            user: null,
            visible: false
        };
    }

    //真实的结构渲染出来后调用
    componentDidMount() {
        const {params} = this.props.navigation.state;

        this.setState({
            intoData: params.intoData,
            telephone: params.telephone,
            coinType: params.intoData.coinCode,
        });

        this.getJumCode();
        this.getTurCost(params.intoData.coinCode);
    }

    //组件被移除之后调用
    componentWillUnmount() {
        clearInterval(this.state.timeId);
    }

    getJumCode = () => {
        this.setState({
            visible: true
        });

        let url = config.api.currency.jumpCoin;

        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            const {obj} = responseText;
            const {list2} = obj;
            let data = list2;
            let addressList = [];

            for (let i = 0; i < data.length; i++) {
                const {currencyType} = data[i];
                if (this.state.coinType === currencyType) {
                    let item = {
                        text: data[i].publicKey,
                        value: data[i].publicKey,
                    };
                    addressList.push(item);
                }
            }

            this.setState({
                addressList: addressList,
                visible: false,
            })
        })
    };

    /**
     * 获取提现费率
     */
    getTurCost = coinType => {
        let url = `${config.api.currency.findCurry}?coinCode=${coinType}`;

        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            const {obj} = responseText;
            const {paceFeeRate, leastPaceNum, oneDayPaceNum} = obj;

            let fee = obj[1] ? obj[1].split(",")[0] : 0;

            this.setState({
                turFee: parseFloat(paceFeeRate ? paceFeeRate : obj[0].paceFeeRate),
                minTur: parseFloat(leastPaceNum ? leastPaceNum : obj[0].leastPaceNum),
                maxTur: parseFloat(oneDayPaceNum ? oneDayPaceNum : obj[0].oneDayPaceNum),
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
        //地址
        let url = config.api.currency.getbtc;
        //参数
        const actions = {
            coinType: this.state.coinType,
            btcNum: this.state.btcNum,
            btcKey: this.state.btcKey,
            pacecurrecy: this.state.feeTur,
        };

        if (this.state.valicode != null) {
            actions.valicode = this.state.valicode;
        }

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                return;
            }

            const {obj, msg, success} = responseText;

            if (success) {
                Alert.alert(
                    '提示',
                    '转出申请成功',
                    [{
                        text: '确认', onPress: () => {
                            const {dispatch} = this.props;
                            dispatch(InitUserInfo(this.props));
                            const {params} = this.props.navigation.state;
                            params.pullTurnout();
                            this.props.navigation.goBack();
                        }
                    }]
                );
            } else {
                if (obj) {
                    this.toCheck(responseText);
                } else {
                    this.setState({
                        valicode: null,
                        checkOpen: false,
                    });

                    toast.show(msg, DURATION.LENGTH_SHORT);
                }
            }
        })
    };

    withdrawCurrency = code => {
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
                user: obj
            })
        } else if (phoneState === 0 && googleState === 1) {
            //谷歌认证
            this.setState({
                checkOpen: true,
                type: 1,
                user: obj
            })
        } else {
            this.withdrawCurrency();
        }
    };

    _click = () => {
        this.setState({
            checkOpen: false,
        });
    };

    // 渲染
    render() {
        const {numInput} = this.refs;
        return (
            <View style={styles.defaultView}>
                {/*标题组件*/}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack()
                    }}>
                        <Icon
                            name="ios-arrow-back-outline" size={25}
                            color='#fff'
                            style={{paddingHorizontal: p(20)}}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>转出{this.state.coinType}</Text>

                    <View/>

                </View>

                <View style={styles.blockSty}>
                    <View style={{marginLeft: p(20)}}>
                        {/*可用的币*/}
                        <Text style={styles.textPrice}>
                            可用{this.state.coinType}：
                            <Text style={{color: '#018F67'}}>
                                {this.state.intoData.hotMoney}
                            </Text>
                        </Text>
                        {/*冻结的币*/}
                        <Text style={styles.textPrice}>
                            冻结{this.state.coinType}：
                            <Text style={{color: '#F6574D'}}>
                                {this.state.intoData.coldMoney}
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.reWithView}>
                        {/*钱包地址标题*/}
                        <Text style={styles.inputText}>钱包地址:</Text>
                        {/*下拉选择钱包地址*/}
                        <SelectApp
                            style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                            size='md'
                            valueStyle={{color: '#fff', padding: 0}}
                            value={this.state.btcKey}
                            getItemValue={item => item.value}
                            getItemText={item => item.text}
                            onPress={() => {
                                numInput.blur();
                            }}
                            items={this.state.addressList}
                            placeholder='请选择钱包地址'
                            pickerTitle='钱包地址'
                            onSelected={item => this.setState({btcKey: item.value})}
                        />
                    </View>
                    {/*币账户管理*/}
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("Address", {
                            getJumCode: this.getJumCode,
                            jumType: 1
                        })}
                        style={{flexDirection: 'row', alignItems: 'center', marginLeft: p(2)}}
                    >
                        <Text style={styles.inputText}/>
                        <Image
                            style={{width: p(60), height: p(40)}}
                            source={require('../../static/mySelf/guanli.png')}
                        />
                        <Text style={[styles.promptText, {left: -p(12)}]}>管理币账户</Text>
                    </TouchableOpacity>
                    {/*轉出數量*/}
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>转出数量:</Text>
                        <TextInput
                            ref="numInput"
                            underlineColorAndroid='transparent'
                            placeholder={'请输入提现数量'}
                            keyboardType="numeric"
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            selectionColor={"#D95411"}
                            value={this.state.btcNum}
                            style={styles.inputTextView}
                            onChangeText={text => {
                                if (text === "" || text == null || /\s/.exec(text) != null || isNaN(text)) {
                                    text = 0;
                                }
                                let turNum = parseFloat(text);
                                let feeTur = this.state.rateType === 2 ? this.state.guDingTur : turNum * this.state.guDingTur / 100;
                                this.setState({
                                    feeTur: feeTur,
                                    actualTur: turNum - feeTur,
                                    btcNum: turNum,
                                });
                            }}
                        />
                    </View>
                    {/*实时计算手续费和价格*/}
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
                {/*确认转账*/}
                <View style={{marginHorizontal: p(20)}}>
                    <TouchableOpacity
                        onPress={this.currencyOut}
                        activeOpacity={.8}
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
                        <Text style={{color: '#fff', fontSize: p(28)}}>确认转出</Text>
                    </TouchableOpacity>
                    {/*说明*/}
                    <View style={{
                        borderWidth: 1,
                        borderColor: 'transparent',
                        borderRadius: p(5),
                        backgroundColor: 'transparent',
                        margin: p(10)
                    }}
                    >
                        <Text style={styles.promptText}>转出说明：</Text>
                        <Text style={styles.promptText}>
                            1.单笔转出最小币数{this.state.minTur}个{this.state.coinType}，单日转出最大币数{this.state.maxTur}{this.state.coinType}
                        </Text>
                        <Text style={styles.promptText}>
                            2.禁止向（{this.state.coinType}）地址充值除（{this.state.coinType}）之外的资产，任何充入（{this.state.coinType}）地址的非（{this.state.coinType}）资产将不可找回。
                        </Text>
                    </View>
                </View>
                {/*弹出窗*/}
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color: 'white'}}
                />
                {/*加载特效组件*/}
                <Loading visible={this.state.visible}/>
                {/*获取验证码组件*/}
                <CheckModal
                    checkOpen={this.state.checkOpen}
                    {...this.props}
                    type={this.state.type}
                    user={this.state.user}
                    withdraw={this.withdrawCurrency}
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
        backgroundColor: '#1F2228'
    },
    inputText: {
        color: 'white',
        paddingLeft: p(20),
        width: p(180),
    },
    inputTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        height: p(80),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF',
    },
    reWithView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: p(80)
    },
    promptText: {
        color: '#B0B0B0',
        fontSize: p(22),
    },
    textPrice: {
        color: '#FFFFFF',
        marginVertical: p(10)
    },
    codeObtain: {
        backgroundColor: "#D95411",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
    },
    codeFalse: {
        backgroundColor: "#929BA1",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
    }
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(TurnoutCurrency);