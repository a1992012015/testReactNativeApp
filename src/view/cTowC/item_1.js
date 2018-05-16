/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 买入界面组件
 *
 */
'use strict';

import React, { PureComponent } from 'react';
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
import { Toast } from 'teaset'

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import request from '../../utils/request';
import Loading from '../../components/loading';
import BuySellModal from './buySellModal';

const { width, height }=Dimensions.get('window');

export default class Item_1 extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            loadData:true,
            coinCode:'',
            buyMoney:'',
            buyNum:'',
            loading:true,
            ctcMoney:0,
            isOpen:false,
        }
    }
    //组件接收到新的props时调用
    componentWillReceiveProps(props) {
        const { coinCode, c2cBuySellList } = props;
        const { c2cBuyPrice } = c2cBuySellList;
        const { ref_buyNum } =  this.refs;

        this.setState({
            coinCode: coinCode,
            buyMoney: c2cBuyPrice,
            ctcMoney: 0,
            loading: false
        });

        ref_buyNum.clear();
    }

    setItemText =()=>{
        this.setState({
            isOpen:false,
        })
    };

    buyNum = num => {
        this.setState({
            buyNum: num
        }, () => {
            let money = num * this.state.buyMoney;
            money = Math.floor(money * 100) / 100;
            this.setState({
                ctcMoney:money,
            })
        })
    };

    appCreateTransaction = () => {
        if(this.state.buyMoney === '' || this.state.buyMoney === undefined){
            Toast.fail("请填写买入价");
            return
        }

        if(this.state.buyNum === '' || this.state.buyNum === undefined){
            Toast.fail("请填写买入量");
            return
        }
        //验证价格
        if(isNaN(this.state.buyNum) || this.state.buyNum < 0){
            Toast.fail('请输入正确的数量');
            return;
        }

        this.setState({
            loading:true
        });

        let url = `${config.api.ctc.appCreateTransaction}?transactionType=1&transactionPrice=${this.state.buyMoney}&transactionCount=${this.state.buyNum}&coinCode=${this.state.coinCode}`;

        request.post(url).then(responseText => {
            request.manyLogin(this.props, responseText);

            if(response.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            this.setState({
                loading:false
            });

            const { obj, msg } = responseText;

            if(responseText.success){
                const { ref_buyNum } = this.refs;
                this.setState({
                    buySellData: obj,
                    isOpen: true,
                    ctcMoney: 0,
                });

               this.props.c2cBuySellFunction(this.state.coinCode);
               ref_buyNum.clear();
            }else{
                Toast.fail(msg);
            }
        });


    };

    prompt = () => {
        return(
            <View style={{marginLeft: p(10)}}>
                <Text style={styles.promptText}>1.C2C交易为用户之间点对点的交易，直接转账打币，平台不接受充值汇款;</Text>
                <Text style={styles.promptText}>2.买卖商户均为实名认证商户，并提供保证金，可放心兑换;</Text>
                <Text style={styles.promptText}>3.如需申请成为商户请发邮件到{this.mail()};</Text>
                <Text style={styles.promptText}>4.请使用本人绑定的银行卡进行汇款，其他任何方式汇款都会退款。（禁止微信和支付宝）;</Text>
                <Text style={styles.promptText}>5.商家处理时间9:00-21:00非处理时间的订单会在第二天9:00开始处理，一般接单后24小时内会完成打款。;</Text>
            </View>
        )
    };

    mail = () =>{
        return "develop@hurong.com";
    };

    render(){
        if (this.state.loadData) {
            return (
                <View style={{flex:1,marginBottom:config.api.isTabView?p(100):0}}>
                    <ScrollView style={{ flex:1,backgroundColor: '#fafafa'}}>
                        <View style={styles.ViewFlex}>
                            {/*标题*/}
                            <View style={{marginTop:p(50)}}>
                                <Text style={styles.textStyle}>买入：{this.state.coinCode}</Text>
                            </View>
                        </View>
                        {/*买入价输入框*/}
                        <View style={styles.ViewFlex}>
                            <View style={styles.inputView}>
                                <TextInput
                                    editable={false}
                                    ref="ref_buyMoney"
                                    underlineColorAndroid='transparent'
                                    keyboardType="numeric"
                                    placeholder="买入价 (￥)"
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#565A5D'}
                                    selectionColor={"#EA2000"}
                                    style={styles.inputTextView}
                                    value= {this.state.buyMoney}
                                />
                                <Text style={{color:'#EA2000'}}>{this.state.buyMoney}</Text>
                            </View>
                        </View>
                        {/*买入量输入框*/}
                        <View style={styles.ViewFlex}>
                            <View style={styles.inputTextStyle}>
                                <Text style={{color:'#565A5D'}}>买入量({this.state.coinCode})：</Text>
                                <TextInput
                                    ref="ref_buyNum"
                                    underlineColorAndroid='transparent'
                                    keyboardType="numeric"
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#565A5D'}
                                    selectionColor={"#EA2000"}
                                    style={styles.inputTextView}
                                    value= {this.state.buyNum}
                                    onChangeText={(text) => {this.buyNum(text)}}
                                />
                            </View>
                        </View>
                        {/*需要的数量*/}
                        <View style={{flexDirection:'row',marginLeft:p(64),marginTop:p(30),alignItems:'center'}}>
                            <Text style={styles.textStyle}>需要</Text>
                            <Text style={{color:'#EA2000',marginLeft:p(10),marginRight:p(10),fontSize:p(30)}}>
                                {this.state.ctcMoney}
                            </Text>
                            <Text style={styles.textStyle}>CNY</Text>
                        </View>
                        {/*买入按钮*/}
                        <View style={[styles.ViewFlex,{marginTop:p(40)}]}>
                            <TouchableOpacity
                                onPress={()=>this.appCreateTransaction()}
                                style={styles.touchableStyle}>
                                <Text style={{color:'#FFF'}}>立即买入</Text>
                            </TouchableOpacity>
                        </View>
                        {/*显示买入规则文本*/}
                        <View style={[styles.ViewFlex,{marginTop:p(30),alignItems:'center'}]}>
                            {this.prompt()}
                        </View>
                        {/*加載特效組建*/}
                        <Loading visible={this.state.loading}/>
                    </ScrollView>
                    {/*存疑？ => 完成订单的弹出窗*/}
                    <BuySellModal isOpen={this.state.isOpen} setItemText={this.setItemText} isType="buy" {...this.props} buySellData={this.state.buySellData} isGoBack={false}/>
                </View>
            )
        }else{
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height/2}}
                    size="large"
                />
            )
        }
    }
}

let styles = StyleSheet.create({
    promptText:{
        color:'#2b2b2b',
        fontSize:p(26),
        lineHeight:p(40),
        marginTop:p(20)
    },
    touchableStyle:{
        height:p(70),width:width-p(120),
            backgroundColor:'#f8671b',borderRadius:p(5),
            alignItems:'center',justifyContent:'center'
        },
    inputTextStyle:{
        flexDirection:'row',
        height:p(80),
        alignItems:'center',
        borderRadius:p(5),
        padding:p(8),
        marginTop:p(20),
        width:width-p(120),
        borderWidth:p(2),
        borderColor:'#e6e6e6'
    },
    inputTextView:{
        flex:1,
        height:p(80),
        fontSize:p(26),
        color:'#EA2000',
    },
    inputView:{
        flexDirection:'row',
        height:p(80),
        alignItems:'center',
        backgroundColor:'#ebebeb',
        borderRadius:p(5),
        padding:p(8),
        marginTop:p(20),
        width:width-p(120),
    },
    textStyle:{
        color:'#646464',
        fontSize:p(28),
    },
    ViewFlex:{
        width:width-p(20),
        alignItems:'center',
        justifyContent:'center',
        marginLeft:p(10)
    }
});