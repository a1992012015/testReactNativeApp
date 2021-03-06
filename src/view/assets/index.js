/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人资产页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    Alert,
    TextInput,
    ScrollView
} from 'react-native';
import store from 'react-native-simple-store';
import { connect } from "react-redux";

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';
import Title from '../../components/title';
import Loading from '../../components/loading';

const {width, height} = Dimensions.get('window');
const request = new Request();

class SpotAssets extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this.state = {
            loadData: false,
            coinAccount: [],
            canBack: false,
            member: null,
            user: null,
            queryAccount: [],
            userIsLogin: false,//是否开启正在加载特效
        }
    }

    //加载数据
    componentDidMount() {
        let {params} = this.props.navigation.state;
        console.log(params);
        if (params) {
            this.setState({
                canBack: params.canBack,
            })
        }

        const {HomeReducer} = this.props;
        const {userAssets} = HomeReducer;

        setTimeout(() => {//解决初次点击会很卡的问题
            if (userAssets.obj) {
                this.setState({
                    coinAccount: userAssets.obj.coinAccount,
                    queryAccount: userAssets.obj.coinAccount,
                    loadData: true,
                    user: userAssets.obj,
                })
            }
        }, 1000);

        store.get('member').then(member => {
            this.setState({
                member: member.memberInfo
            })
        });
    }

    //接收到一个新的props
    componentWillReceiveProps(props) {
        const {HomeReducer} = props;
        const {userAssets} = HomeReducer;

        if (userAssets.obj) {
            this.setState({
                coinAccount: userAssets.obj.coinAccount,
                queryAccount: userAssets.obj.coinAccount,
                user: userAssets.obj,
            })
        }
    }

    //查询
    queryName = text => {

        this.setState({
            codeName: text
        });

        let data = [];

        for (let i = 0; i < this.state.queryAccount.length; i++) {

            let coinItem = this.state.queryAccount[i];
            let reg = /^[A-Za-z]+$/;

            if (reg.test(text)) {
                text = text.toUpperCase();
            }

            if (coinItem.coinCode.indexOf(text) >= 0 || coinItem.name.indexOf(text) >= 0) {
                data.push(coinItem);
            } else if (text === '') {
                this.setState({
                    coinAccount: this.state.queryAccount,
                })
            }
        }

        if (text === '') {
            this.setState({
                coinAccount: this.state.queryAccount,
            })
        } else {
            this.setState({
                coinAccount: data,
            })
        }
    };

    upState = () => {
        //地址
        let url = config.api.person.isRealUrl;

        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            store.update('member', {
                memberInfo: responseText.obj.user
            });

            this.setState({
                member: responseText.obj.user,
                languageCode: responseText.obj.languageCode,
                user: responseText.obj
            })
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        });
    };

    //充币
    getIntoCurrency = item => {
        this.setState({
            userIsLogin: true,
        });

        const {moneyAndCoin, coinCode} = item;

        if (moneyAndCoin === 0) {
            this.props.navigation.navigate('RechargeRMB', {member: this.state.member});
        } else {
            let url = config.api.currency.account;
            request.post(url, {}, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                let data = responseText.obj;

                this.setState({
                    userIsLogin: false,
                });

                for (let i = 0; i < data.length; i++) {
                    if (data[i].coinCode === coinCode) {
                        this.props.navigation.navigate('IntoCurrency', {intoData: data[i]});
                    }
                }
            }).catch(error => {
                console.log('进入失败函数 =>', error);
            });
        }
    };

    //提币
    getTurnoutCurrency = item => {
        this.setState({
            userIsLogin: true,
        });

        const {moneyAndCoin, coinCode} = item;

        if (moneyAndCoin === 0) {
            this.props.navigation.navigate('withdrawalsRMB', {member: this.state.member});
        } else {
            //地址
            let url = config.api.currency.account;

            request.post(url, {}, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                let data = responseText.obj;

                this.setState({
                    userIsLogin: false,
                });

                for (let i = 0; i < data.length; i++) {
                    if (data[i].coinCode === coinCode) {
                        this.props.navigation.navigate('TurnoutCurrency', {intoData: data[i], telephone: ''});
                    }
                }
            });
        }
    };

    //账单
    getCodeBillFlow = item => {
        this.props.navigation.navigate('CodeBillFlow', {intoData: item});
    };

    /*跳转下级页面方法*/
    isRealName = (page, memberInfo, item) => {
        let {user} = this.state;
        let {isChongbi, isTibi} = user;

        if (isChongbi === "0" || isChongbi === 0) {
            this.realNameJump(page, memberInfo, item);

        } else if (isTibi === "0" || isTibi === 0) {
            this.realNameJump(page, memberInfo, item);

        } else {
            if (page === 1) {
                this.getIntoCurrency(item);

            } else if (page === 2) {
                this.getTurnoutCurrency(item);

            } else {
                this.getCodeBillFlow(item);
            }
        }
    };

    //实名认证判断
    realNameJump = (page, memberInfo, item) => {
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
                }]
            );
        } else {
            if (page === 1) {
                this.getIntoCurrency(item);

            } else if (page === 2) {
                this.getTurnoutCurrency(item);

            } else {
                this.getCodeBillFlow(item);

            }
        }
    };

    /*科学计数法转换数值*/
    scientificToNumber =  (num) => {
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

    render() {
        if (this.state.loadData) {
            return (
                <View style={{flex: 1}}>
                    {/*资产标题*/}
                    <Title titleName="现货资产" canBack={this.state.canBack} {...this.props}/>

                    <View style={{alignItems: 'center', backgroundColor: '#f4f4f4', flex: !this.state.canBack ? 0 : 1}}>
                        {/*查询输入框组件*/}
                        <View style={styles.inputView}>
                            <Image
                                style={{zIndex: 99999, width: p(40), height: p(40), marginLeft: p(20)}}
                                source={require('../../static/assets/query.png')}
                            />

                            <TextInput
                                ref="ref_price"
                                underlineColorAndroid='transparent'
                                placeholder='输入货币名称'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#787e82'}
                                style={styles.inputTextView}
                                value={this.state.codeName}
                                onChangeText={text => this.queryName(text)}
                            />
                        </View>
                        {/*资产显示组件*/}
                        <ScrollView style={{marginBottom: !this.state.canBack ? p(360) : p(1)}}>
                            {
                                this.state.coinAccount.map((item, i) => {
                                    const {moneyAndCoin, coinCode, name, hotMoney, coldMoney, picturePath} = item;

                                    return (
                                        <View key={`ScrollView${i}`}>
                                            {
                                                moneyAndCoin !== 0 ?
                                                    <View style={styles.viewOne}>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: "center",
                                                            backgroundColor: '#fbfbfb',
                                                        }}>
                                                            {/*显示币种信息*/}
                                                            <View style={{margin: p(35)}}>
                                                                {/*名字*/}
                                                                <Text style={styles.textOne}>{coinCode} （{name}）</Text>
                                                                {/*总数*/}
                                                                <Text
                                                                    style={styles.textTwo}>{this.scientificToNumber(hotMoney)}</Text>
                                                                {/*冻结*/}
                                                                <Text
                                                                    style={styles.textThree}>冻结{this.scientificToNumber(coldMoney)}</Text>
                                                            </View>
                                                            {/*显示图片*/}
                                                            <View style={{marginRight: p(50)}}>
                                                                <Image
                                                                    resizeMode='stretch'
                                                                    style={{width: p(100), height: p(100)}}
                                                                    source={{uri: config.api.host + picturePath}}
                                                                />
                                                            </View>
                                                        </View>

                                                        <View style={{
                                                            height: p(2),
                                                            backgroundColor: '#dfdfdf',
                                                            width: width
                                                        }}/>

                                                        <View style={styles.viewTwo}>

                                                            {/*充币组件*/}
                                                            <TouchableOpacity
                                                                onPress={() => this.isRealName(1, this.state.member, item)}
                                                                style={{
                                                                    width: width * .3,
                                                                    height: '100%',
                                                                    flexDirection: "row",
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Image
                                                                    resizeMode='stretch'
                                                                    style={{
                                                                        width: p(30),
                                                                        height: p(30),
                                                                        marginRight: p(6)
                                                                    }}
                                                                    source={require('../../static/assets/xz.png')}
                                                                />
                                                                <Text style={styles.textBottom}>充币</Text>

                                                            </TouchableOpacity>

                                                            <View style={{
                                                                height: p(40),
                                                                backgroundColor: '#dfdfdf',
                                                                width: p(2)
                                                            }}/>

                                                            {/*提币组件*/}
                                                            <TouchableOpacity
                                                                onPress={() => this.isRealName(2, this.state.member, item)}
                                                                style={{
                                                                    width: width * .3,
                                                                    height: '100%',
                                                                    flexDirection: "row",
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Image
                                                                    resizeMode='stretch'
                                                                    style={{
                                                                        width: p(30),
                                                                        height: p(30),
                                                                        marginRight: p(6)
                                                                    }}
                                                                    source={require('../../static/assets/cb.png')}
                                                                />
                                                                <Text style={styles.textBottom}>提币</Text>

                                                            </TouchableOpacity>

                                                            <View style={{
                                                                height: p(40),
                                                                backgroundColor: '#dfdfdf',
                                                                width: p(2)
                                                            }}/>

                                                            {/*账单组件*/}
                                                            <TouchableOpacity
                                                                onPress={() => this.isRealName(3, this.state.member, item)}
                                                                style={{
                                                                    width: width * .3,
                                                                    height: '100%',
                                                                    flexDirection: "row",
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Image
                                                                    resizeMode='stretch'
                                                                    style={{
                                                                        width: p(26),
                                                                        height: p(26),
                                                                        marginRight: p(6)
                                                                    }}
                                                                    source={require('../../static/assets/zd.png')}
                                                                />
                                                                <Text style={styles.textBottom}>账单</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

                    {/*正在加载特效*/}
                    <Loading visible={this.state.userIsLogin}/>
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height}}
                    size="large"
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    textBottom: {
        fontSize: p(22),
        color: '#454545',
    },
    viewTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        flex: 1,
        borderRadius: p(5),
    },
    textOne: {
        color: '#ffb339',
        fontSize: p(30),
    },
    textTwo: {
        color: '#676767',
        fontSize: p(36),
        marginTop: p(26),
        fontWeight: '400',
    },
    textThree: {
        color: '#b8b8b8',
        fontSize: p(26),
        marginTop: p(26),
    },
    viewOne: {
        width: width - p(40),
        height: p(330),
        backgroundColor: '#fbfbfb',
        borderRadius: p(5),
        borderWidth: p(2),
        borderColor: '#d7d7d7',
        marginBottom: p(25),
    },
    inputTextView: {
        width: width * .5,
        flex: 1,
        fontSize: p(26),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(30),
    },
    inputView: {
        flexDirection: 'row',
        height: p(90),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        borderRadius: p(5),
        marginTop: p(20),
        width: width - p(40),
        justifyContent: 'space-between',
        borderWidth: p(2),
        borderColor: '#dedede',
        marginBottom: p(30),
    },
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(SpotAssets);