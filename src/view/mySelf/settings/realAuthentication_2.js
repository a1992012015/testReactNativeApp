/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：个人信息设置页面 => 实名认证 => 反馈页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ActivityIndicator
} from 'react-native' ;
import Icon from 'react-native-vector-icons/Ionicons';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import Request from '../../../utils/request';
import I18n from '../../../utils/i18n';

const {height} = Dimensions.get('window');
const request = new Request();

export default class RealAuthentication_2 extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            cardId: '',
            trueName: '',
            cardType: 0,
            papersType: '身份证',
            surname: '',
            loadData: false
        };
    }

    //真实结构渲染之后调用
    componentDidMount() {
        let url = config.api.person.realName;
        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            console.log('responseText', responseText);
            const {obj} = responseText;
            let cardNum = obj.cardId;

            if (cardNum.length > 10) {
                cardNum = `${cardNum.substring(0, 4)}********${cardNum.substring(cardNum.length - 4, cardNum.length)}`;
            }

            this.setState({
                cardId: cardNum,
                trueName: obj.trueName,
                cardType: obj.cardType,
                papersType: obj.papersType,
                surname: obj.surname,
                loadData: true,
            })
        })
    }

    // 渲染
    render() {
        if (this.state.loadData) {
            const {params} = this.props.navigation.state;
            return (
                <View style={styles.defaultView}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                            params.infoAction();
                        }}>
                            <Icon
                                name="ios-arrow-back-outline" size={25}
                                color='#fff'
                                style={{paddingHorizontal: p(20)}}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{I18n.t("verification")}</Text>
                        <View/>
                    </View>

                    <View style={{
                        alignItems: 'center',
                        paddingVertical: p(30),
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#41484F'
                    }}>
                        <Icon name="ios-checkmark-circle" size={30} color="#018F67"/>
                        <Text style={{color: "#018F67", fontSize: p(28), marginTop: p(20)}}>
                            {params.textView === "审核中" ? "实名认证正在审核!" : I18n.t("smchenggong")}
                        </Text>
                    </View>
                    <View style={{alignItems: 'center', paddingVertical: p(20), justifyContent: 'flex-start'}}>
                        <Text style={{marginTop: p(20), color: '#FFF'}}>
                            {I18n.t("zjleixing")}：
                            {
                                this.state.cardType === 0 || this.state.cardType === '0' ?
                                    I18n.t("shenfenzheng")
                                    :
                                    I18n.t("huzhao")
                            }
                        </Text>
                        <Text style={{marginTop: p(20), color: '#FFF'}}>{I18n.t("xingshi")}：{this.state.surname}</Text>
                        <Text style={{marginTop: p(20), color: '#FFF'}}>{I18n.t("mingzi")}：{this.state.trueName}</Text>
                        <Text style={{marginTop: p(20), color: '#FFF'}}>{I18n.t("zjhaoma")}：{this.state.cardId}</Text>
                    </View>
                </View>
            );
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
        marginRight: p(50),
    },
    goBack: {
        borderLeftWidth: p(4),
        borderBottomWidth: p(4),
        borderColor: '#313840',
        width: p(26),
        height: p(26),
        transform: [{rotate: '45deg'}],
        marginLeft: p(20),
    },
    topItemStyEX: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(70),
        alignItems: 'center',
    },
    topItemSty: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(70),
        justifyContent: 'center',
    },
    itemTextMidSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),

    },
    midBlockSty: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        height: p(80),
        paddingLeft: p(20),
    },
    itemTextSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),
        paddingLeft: p(40),
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
    }
});