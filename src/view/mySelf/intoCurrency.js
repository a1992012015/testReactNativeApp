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
    Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import QRCode from 'react-native-qrcode';

import p from '../../utils/tranfrom';
import Request from '../../utils/request'
import config from '../../utils/config'
import I18n from '../../utils/i18n';

const request = new Request();

export default class IntoCurrency extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            coinName: '',
            intoData: {
                hotMoney: 0,
                coldMoney: 0,
            }
        };
    }

    //真实的结构渲染出来以后调用
    componentDidMount() {
        const {params} = this.props.navigation.state;

        this.setState({
            intoData: params.intoData,
            publicKey: params.intoData.publicKey
        }, () => {
            this._getpublicKey();
        });
    }

    /*科学计数法转换数值*/
    scientificToNumber =  (num) => {
        console.log(num);
        let str = num.toString();
        let reg = /^(\d+)(e)([\-]?\d+)$/;
        let arr, len,
            zero = '';

        /*6e7或6e+7 都会自动转换数值*/
        if (!reg.test(str)) {
            return num;
        } else {
            /*6e-7 需要手动转换*/
            arr = reg.exec(str);
            len = Math.abs(arr[3]) - 1;
            for (let i = 0; i < len; i++) {
                zero += '0';
            }

            return '0.' + zero + arr[1];
        }
    };

    //没有币地址 => 生成币地址
    _createPublicKey = () => {
        //地址
        let url = config.api.currency.createPublicKey;
        //参数
        const actions = {
            accountId: this.state.intoData.id,
        };

        const {toast} = this.refs;

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                return;
            }

            const {msg, obj, success} = responseText;

            if (success) {
                this.setState({
                    publicKey: obj
                })
            } else {
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        });
    };

    //获取币地址
    _getpublicKey = () => {
        //地址
        let url = config.api.currency.getPublicKey;
        //参数
        const actions = {
            accountId: this.state.intoData.id,
        };

        const {toast} = this.refs;

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                toast.show('接口请求失败', DURATION.LENGTH_SHORT);
            }
        });
    };

    // 渲染
    render() {
        const {toast} = this.refs;
        const {intoData, publicKey} = this.state;

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
                            style={{paddingHorizontal: p(20)}}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>转入{intoData.coinCode}</Text>
                    <View/>
                </View>

                <View style={{margin: p(20)}}>
                    {/*可用和冻结的币*/}
                    <View style={{marginLeft: p(20)}}>
                        <Text style={styles.textPrice}>
                            可用{intoData.coinCode}：
                            <Text style={{color: '#018F67'}}>
                                {this.scientificToNumber(intoData.hotMoney)}
                            </Text>
                        </Text>
                        <Text style={styles.textPrice}>
                            冻结{intoData.coinCode}：
                            <Text style={{color: '#F6574D'}}>
                                {this.scientificToNumber(intoData.coldMoney)}
                            </Text>
                        </Text>
                    </View>
                    {/*显示币地址信息*/}
                    <View style={{
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: '#565A5D',
                        padding: p(20),
                        backgroundColor: '#313840',
                    }}>
                        <Text style={styles.textPrice}>钱包地址:</Text>

                        {
                            !publicKey ?
                                <TouchableOpacity
                                    onPress={() => this._createPublicKey()}
                                    activeOpacity={.8}
                                    style={{
                                        height: p(80),
                                        backgroundColor: '#D95411',
                                        margin: p(10),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: p(10)
                                    }}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: p(26)
                                    }}>获取地址({intoData.coinCode})</Text>
                                </TouchableOpacity>
                                :
                                <View>
                                    {/*币地址*/}
                                    <Text style={styles.textPrice}>{publicKey}</Text>
                                    {/*点击复制*/}
                                    <TouchableOpacity
                                        onPress={() => {
                                            Clipboard.setString(publicKey);
                                            toast.show(I18n.t('fuzhisuccess'), DURATION.LENGTH_SHORT);
                                        }}
                                        style={styles.touView}
                                        activeOpacity={.8}>
                                        <Text style={styles.textPrice}>{I18n.t('fuzhi')}</Text>
                                    </TouchableOpacity>
                                    {/*显示二维码*/}
                                    <View style={{
                                        width: p(310),
                                        borderColor: '#FFFFFF',
                                        borderWidth: p(5),
                                    }}>
                                        <QRCode
                                            value={publicKey}
                                            size={p(300)}
                                            bgColor='#000000'
                                            fgColor='white'
                                        />
                                    </View>

                                </View>
                        }
                    </View>
                    {/*说明*/}
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: 'transparent',
                            borderRadius: p(5),
                            backgroundColor: 'transparent',
                            marginTop: p(20),
                        }}
                    >
                        <Text style={styles.promptText}>转入说明：</Text>
                        <Text style={styles.promptText}>
                            1.禁止充值除{intoData.coinCode}之外的其他资产，任何非{intoData.coinCode}资产充值将不可找回
                        </Text>

                    </View>
                </View>
                {/*提示窗*/}
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color: 'white'}}
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
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228',
    },
    promptText: {
        color: '#B0B0B0',
        fontSize: p(22),
        marginTop: p(10),
    },
    textPrice: {
        color: '#FFFFFF',
        marginVertical: p(10),
    },
    touView: {
        backgroundColor: '#D95411',
        width: p(100),
        alignItems: 'center',
        borderRadius: p(10),
        marginBottom: p(10),
    }
});