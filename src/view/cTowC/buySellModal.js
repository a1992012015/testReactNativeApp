/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 买入界面组件 => 存疑？ => 完成订单的弹出窗
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
    Image,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modalbox';

import p from '../../utils/tranfrom';

const {width} = Dimensions.get('window');

export default class BuySellModal extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen: false,
            buySellData: null,
            isGoBack: true,
            isType: 'buy',
        };
    }

    //组件接收到新的props时调用
    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpen: nextProps.isOpen,
            buySellData: nextProps.buySellData,
            isGoBack: nextProps.isGoBack,
            isType: nextProps.isType
        })
    }

    _click = () => {
        const {goBack} = this.props.navigation;

        this.setState({
            isOpen: false
        });

        this.props.setItemText();

        if (this.state.isGoBack) {
            goBack();
        }
    };

    render() {
        const {buySellData} = this.state;

        if (buySellData !== null && buySellData !== undefined) {
            const {bankowner, bankname, bankcard, transactionMoney, randomNum, status2,} = buySellData;

            return (
                <Modal
                    style={[styles.modal, styles.modal3]}
                    position={"center"}
                    backButton={false}
                    backdropPressToClose={false}
                    swipeToClose={false}
                    isOpen={this.state.isOpen}
                >
                    <TouchableOpacity
                        style={styles.imageView}
                        onPress={() => this._click()}>
                        <Image source={require('../../static/cTowC/close.png')}
                               style={styles.imageType}/>
                    </TouchableOpacity>

                    <ScrollView style={{width: width - (70)}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontSize: p(30), paddingVertical: p(20)}}>
                                {this.state.isType === 'buy' ? '汇款订单' : '收款订单'}
                            </Text>
                        </View>
                        <View style={{flex: 1, paddingHorizontal: p(20)}}>

                            <View style={{paddingVertical: p(20), backgroundColor: '#FFE7E1'}}>
                                <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                    <Text style={styles.modeText}>
                                        {this.state.isType === 'buy' ? '1、请按提示信息向卖家汇款' : '1、您的收款信息如下'}
                                    </Text>
                                </Text>
                            </View>

                            <View style={[styles.modeView, {marginTop: p(20)}]}>
                                <Text style={styles.bankText}>收款方户名</Text>
                                <Text style={styles.modeText}>{bankowner}</Text>
                            </View>

                            <View style={styles.modeView}>
                                <Text style={styles.bankText}>收款方开户行</Text>
                                <Text style={[styles.bankTextM, {fontSize: p(24)}]}>{bankname}</Text>
                            </View>

                            <View style={styles.modeView}>
                                <Text style={styles.bankText}>收款方账号</Text>
                                <Text style={styles.bankTextM}>{bankcard}</Text>
                            </View>

                            <View style={styles.modeView}>
                                <Text style={styles.bankText}>
                                    {this.state.isType === 'buy' ? '转账金额' : '收账金额'}
                                </Text>
                                <Text style={styles.bankTextM}>{transactionMoney}</Text>
                            </View>

                            {
                                this.state.isType === 'buy' ?
                                    <View style={styles.modeView}>
                                        <Text style={styles.bankText}>汇款时备注内容</Text>
                                        <Text style={styles.modeText}>{randomNum}</Text>
                                    </View>
                                    :
                                    null
                            }
                            <View style={styles.modeView}>
                                <Text style={styles.bankText}>状态</Text>
                                <Text style={styles.bankTextM}>{
                                    status === 3 && status2 === 3 ? '已否决(交易关闭)' :
                                        status === 3 && status2 === 4 ? '已否决(交易失败)' :
                                            status === 2 && status2 === 2 ? '已完成' :
                                                status2 === 1 ? '未支付' : status2 === 2 ? '已支付' :
                                                    status2 === 3 ? '交易关闭' : '交易失败'
                                }</Text>
                            </View>
                            {
                                this.state.isType === 'buy' ?
                                    <View style={{paddingVertical: p(20), backgroundColor: '#FFE7E1'}}>

                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>1、卖家为认证商户，可放心付款；</Text>
                                        </Text>

                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>2、汇款时请一定要填写备注信息；</Text>
                                        </Text>

                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>
                                                3、卖家确认收到款后，自动充值。如超过24小时未收到币，请向客户反馈解决
                                            </Text>
                                        </Text>
                                    </View>
                                    :
                                    <View style={{paddingVertical: p(20), backgroundColor: '#FFE7E1'}}>
                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>1、卖家为认证商户，可放心等待收款；</Text>
                                        </Text>

                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>2、收款时请确认金额信息；</Text>
                                        </Text>

                                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                                            <Text style={styles.modeText}>3、卖家确认收到款后，自动充值。如超过24小时未收到款项，
                                                请向客户反馈解决</Text>
                                        </Text>
                                    </View>
                            }
                        </View>

                        <Text style={{fontSize: p(26), marginRight: p(15), marginLeft: p(15)}}>
                            <Text style={styles.modeText}>温馨提示：如有任何疑问请联系在线客户或查看帮助中心。</Text>
                        </Text>
                    </ScrollView>
                </Modal>
            );
        } else {
            return (
                <View/>
            );
        }
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: p(10)
    },
    modal3: {
        height: p(870),
        width: width - p(80)
    },
    text: {
        color: '#727272',
        marginTop: p(40),
        fontSize: p(24)
    },
    modeView: {
        flex: 1,
        flexDirection: 'row',
        padding: p(20),
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
    },
    modeText: {
        color: '#D95411',
        paddingLeft: p(20),
        fontSize: p(24)
    },
    imageType: {
        width: p(45),
        height: p(45)
    },
    bankText: {
        width: p(180),
        borderRightColor: '#ccc',
        borderRightWidth: StyleSheet.hairlineWidth,
        fontSize: p(24)
    },
    imageView: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 999
    },
    bankTextM: {
        paddingLeft: p(20),
        width: p(380)
    }
});