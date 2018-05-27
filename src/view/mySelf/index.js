/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人中心页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image,
    Alert,
    RefreshControl,
} from 'react-native' ;
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import store from 'react-native-simple-store';
import {connect} from 'react-redux';

import p from '../../utils/tranfrom';
import config from '../../utils/config';
import Request from '../../utils/request';
import I18n from '../../utils/i18n';
import {InitUserInfo} from '../../store/actions/HomeAction';

const request = new Request();

//列表选项组件
class BottomMenu extends PureComponent {
    render() {
        const {icon, name, component, onClickChange} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClickChange(component)
                }}
                activeOpacity={.8}
                style={styles.menuItemSty}>
                <View style={{flexDirection: "row", paddingLeft: p(20), alignItems: 'center'}}>
                    <Image
                        style={{width: p(40), height: p(40)}}
                        source={icon}
                    />
                    <Text style={{color: "#ACB3B9", paddingLeft: p(20)}}>{name}</Text>
                </View>
                <Icon name="ios-arrow-forward-outline" size={20} color="#ACB3B9" style={{marginRight: p(20)}}/>
            </TouchableOpacity>
        )
    }
}

class myHome extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            hotMoney: '0.00',
            coldMoney: '0.00',
            rmbAccountNetAsse: '0.00',
            sumRmbfund: '0.00',
            username: '',
            memberInfo: '',
            userInfo: '',
        };
    }

    //真是的结构被渲染出来之后调用
    componentDidMount() {
        const {dispatch} = this.props;
        console.log('进入个人信息页面，开始获取个人信息');
        dispatch(InitUserInfo(this.props));
        let that = this;
        store.get('member').then(member => {
            that.setState({
                username: member.memberInfo.username,
                memberInfo: member.memberInfo,
            })
        });
    }

    //接受到一个新的Props之后调用
    componentWillReceiveProps(nextProps) {
        this.upState();
        const {HomeReducer} = nextProps;
        const {obj} = HomeReducer.userAssets;
        const myAccount = obj && obj.myAccount;
        console.log('接收到新的props');

        if (!HomeReducer.userLoading) {
            this.setState({
                userInfo: obj,
                hotMoney: myAccount.hotMoney,
                coldMoney: myAccount.coldMoney,
                rmbAccountNetAsse: myAccount.rmbAccountNetAsse,
                sumRmbfund: myAccount.sumRmbfund,
            })
        }
    }

    //列表的点击事件跳转页面
    onClickChange = (route, member) => {
        this.props.navigation.navigate(route, {member: member, onClose: () => this.pageCloses()});
    };
    //
    upState = () => {
        let url = config.api.person.isRealUrl;

        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }
            console.log('upState', responseText);

            const {obj} = responseText;

            store.update('member', {
                memberInfo: obj.user
            });

            this.setState({
                memberInfo: obj.user,
                languageCode: obj.languageCode,
            })
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        });
    };

    //获取数据失败的提示窗
    pageCloses() {
        const {toast} = this.refs;
        console.log(toast);
        toast.show('获取数据失败', DURATION.LENGTH_SHORT);
    }

    //打开新的下级页面
    jumpPage = page => {
        const {memberInfo, userInfo} = this.state;
        const {isChongbi, isTibi} = userInfo;

        if (page === "RechargeRMB" || page === "IntoCurrencyList" || page === "TurnoutCurrencyQRList") {
            if (isChongbi === "0" || isChongbi === 0) {
                this.realNameJump(page, memberInfo);
            } else {
                this.onClickChange(page, memberInfo);
            }
        } else if (page === "withdrawalsRMB" || page === "TurnoutCurrencyList") {
            if (isTibi === "0" || isTibi === 0) {
                this.realNameJump(page, memberInfo);
            } else {
                this.onClickChange(page, memberInfo);
            }
        } else if (page === "Address" || page === "BankCard") {
            this.realNameJump(page, memberInfo);
        } else {
            this.onClickChange(page, memberInfo);
        }
    };

    realNameJump = (page, memberInfo) => {
        const {states} = memberInfo;

        if (states === 0 || states === "0") {
            Alert.alert(
                '提示',
                '请先实名认证',
                [{text: '确认', onPress: () => this.props.navigation.navigate("realAuthentication", {
                        member: memberInfo,
                        infoAction: this.upState
                    })
                }]
            );
        } else if (states === 1 || states === "1") {
            Alert.alert(
                '提示',
                '实名认证审核中',
                [{text: '确认', onPress: () => {}}]
            );
        } else if (states === 3 || states === "3") {
            Alert.alert(
                '提示',
                '实名申请被拒绝，请重新认证',
                [{text: '确认', onPress: () => this.props.navigation.navigate("realAuthentication", {
                        member: memberInfo,
                        infoAction: this.upState,
                    })
                }]
            );
        } else {
            this.onClickChange(page, memberInfo);
        }
    };

    refresh = () => {
        const {dispatch} = this.props;
        dispatch(InitUserInfo(this.props));
    };

    // 渲染
    render() {
        return (
            <View style={[styles.defaultView, {paddingBottom: p(100)}]}>
                {/*顶部标签组建*/}
                <View style={styles.header}>
                    {/*左侧铃铛消息组件*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.onClickChange("MyNews")
                        }}
                        activeOpacity={.8}>
                        <Icon
                            name="md-notifications-outline"
                            size={25}
                            color='#fff'
                            style={{paddingHorizontal: p(20)}}
                        />
                    </TouchableOpacity>
                    {/*中间标签*/}
                    <Text style={styles.headerTitle}>{I18n.t("zhanghuzhongxin")}</Text>
                    {/*右侧设置组件*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.onClickChange("MySetUp", this.state.memberInfo)
                        }}>
                        <Icon
                            name="md-settings"
                            size={25}
                            color='#fff'
                            style={{paddingHorizontal: p(20)}}
                        />
                    </TouchableOpacity>
                </View>
                {/*主体部分*/}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.refresh}
                        />
                    }
                    style={{marginHorizontal: p(20), flex: 1}}
                >
                    {/*账户名字*/}
                    <View style={styles.blockSty}>
                        <View style={styles.topItemSty}>
                            <Text style={styles.itemTextSty}>账户：<Text
                                style={{color: '#FFF'}}>{this.state.username}</Text></Text>
                        </View>
                    </View>
                    {/*充币和提币组件*/}
                    <View style={styles.blockSty}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            {/*充币组件*/}
                            <TouchableOpacity
                                onPress={() => {
                                    this.jumpPage("IntoCurrencyList")
                                }}
                                activeOpacity={.8}
                                style={styles.midBlockSty}>
                                <Icon
                                    name="ios-redo" size={20}
                                    color='#fff'
                                    style={{paddingHorizontal: p(20)}}
                                />
                                <Text style={styles.itemTextMidSty}>{I18n.t("woyaochongbi")}</Text>
                            </TouchableOpacity>
                            {/*提币组件*/}
                            <TouchableOpacity
                                onPress={() => {
                                    this.jumpPage("TurnoutCurrencyList")
                                }}
                                activeOpacity={.8}
                                style={[styles.midBlockSty, {
                                    borderLeftWidth: StyleSheet.hairlineWidth,
                                    borderLeftColor: '#41484F'
                                }]}>
                                <Icon name="ios-undo"
                                      size={20}
                                      color='#fff'
                                      style={{paddingHorizontal: p(20)}}
                                />
                                <Text style={styles.itemTextMidSty}>{I18n.t("woyaotibi")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*全部的列表组件*/}
                    <View style={styles.blockSty}>
                        <BottomMenu
                            icon={require('../../static/mySelf/scan.png')}
                            name="扫码转币"
                            component="TurnoutCurrencyQRList"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/entrust.png')}
                            name={I18n.t("wodeweituo")}
                            component="Entrusted"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/record.png')}
                            name={I18n.t("jiaoyijilu")}
                            component="ClosingRecord"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/recharge.png')}
                            name="币种充值流水"
                            component="CurrencyRen"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/withdraw.png')}
                            name="币种提现流水"
                            component="CurrencyWith"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/address.png')}
                            name={I18n.t("bizhanghu")}
                            component="Address"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/bankcard.png')}
                            name={I18n.t("yinhangkaguanli")}
                            component="BankCard"
                            onClickChange={this.jumpPage}
                        />
                        <BottomMenu
                            icon={require('../../static/mySelf/tuijian.png')}
                            name="推荐返佣"
                            onClickChange={this.onClickChange}
                            component="Recommend"
                            textColor="#ACB3B9"
                        />
                    </View>
                </ScrollView>
                {/*弹出提示窗组件*/}
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='center'
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    }

}

let styles = StyleSheet.create({
    menuItemSty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: p(80),
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
    },
    topItemStyEX: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(80),
        alignItems: 'center',
    },
    topItemSty: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(80),
        justifyContent: 'center',
    },
    itemTextMidSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),
    },
    midBlockSty: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: p(80),
    },
    itemTextSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),
        paddingLeft: p(20),
    },
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: p(5),
        borderColor: '#313840',
    },
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228',
    },
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(120),
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
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(myHome);