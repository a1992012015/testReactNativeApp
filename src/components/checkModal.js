/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：登陆页面 => 获取验证码
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    Keyboard
} from 'react-native';
import Modal from 'react-native-modalbox';
import Toast, { DURATION } from 'react-native-easy-toast';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import p from '../utils/tranfrom';
import request from '../utils/request';
import config from '../utils/config';
import I18n from '../utils/i18n';

const { width } = Dimensions.get('window');

export default class CheckModal extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen: false,
            type: 1,
            code: null,
            checkCodeText: "获取验证码",
            codeStyle: styles.codeObtain,
            codeSent: true,
            timeId: '',
            isCheckCode: false,
            smsCode: '',
            telephone: '',
            customStyleIndex: 0,
            username: '',
            googleCode: '',
            user: '',
            password: '',
            keyboardSpace: 0,
            flag: true,//禁止重复点击获取验证码
        };
        //监听输入键盘显示事件
        Keyboard.addListener('keyboardDidShow', (frames) => {
            console.log('键盘显示=>',frames);
            if (!frames.endCoordinates) {
                return
            }
            this.setState({
                keyboardSpace: p(frames.endCoordinates.height),
            });
        });
        //监听输入键盘消失事件
        Keyboard.addListener('keyboardDidHide', () => {
            console.log('键盘消失');
            this.setState({
                keyboardSpace:0
            });
        });
    }
    //组件接收到新的props时调用
    componentWillReceiveProps(nextProps) {
        if(nextProps.user){
            this.setState({
                isOpen: nextProps.checkOpen,
                telephone: nextProps.user.phone,
                type: nextProps.type,
                username: nextProps.user.username,
                user: nextProps.user,
                password: nextProps.password,
                transPassURL: nextProps.transPassURL
            })
        }
    }
    //组件被移除之前被调用
    componentWillUnmount() {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
        clearInterval(this.timer1);
    }
    //谷歌的密钥
    googleKey=()=>{
        const { withdraw } = this.props;
        const { toast } = this.refs;
        if(withdraw){
            withdraw(this.state.googleCode);
            return;
        }
        if (null === this.state.username || '' === this.state.username) {
            toast.show('请输入用户名', DURATION.LENGTH_SHORT);
            return;
        }
        if (null === this.state.googleCode || '' === this.state.googleCode) {
            toast.show('请输入谷歌验证码', DURATION.LENGTH_SHORT);
            return;
        }

        let url = `${config.api.login.googleAuth}?verifyCode=${this.state.googleCode}&username=${this.state.username}&password=${this.state.password}`;

        request.post(url).then((responseText) => {
            console.log("responseText",responseText);

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('登陆失败', 5000);
                return;
            }

            request.manyLogin(this.props, responseText);
            if (responseText.success) {
                this.setState({
                    isOpen:false
                });
                this.props.saveUser(responseText);
            } else {
                const { msg } = responseText;
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        });
    };
    //获取手机验证码
    getCurrencyCode = () => {
        if(!this.state.flag){
            //为true则是还没发送的状态
            return;
        }

        const { toast } = this.refs;
        console.log(DURATION);
        if (null === this.state.telephone || '' === this.state.telephone) {
            toast.show('请输入手机号码', DURATION.LENGTH_SHORT);
            return;
        }
        if (!this.state.codeSent) {
            return;
        }

        let url = `${config.api.login.getPhoneCode}?username=${this.state.username}&password=${this.state.password}&mobile=${this.state.telephone}`;

        this.setState({
            flag: false,
        });

        request.post(url).then((responseText) => {

            request.manyLogin(this.props, responseText);

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('登陆失败', 5000);
                return;
            }

            if (responseText) {
                if (responseText.success) {
                    this.setState({
                        codeStyle: styles.codeFalse
                    });
                    toast.show('短信发送成功', DURATION.LENGTH_SHORT);
                    let num = 60;
                    this.setState({
                        codeSent: false,
                        isCheckCode: true
                    });
                    this.timer1 = setInterval(() => {

                        num--;
                        this.setState({
                            checkCodeText: `${num}s重新获取`
                        });
                        if (num < 0) {
                            clearInterval(this.timer1);
                            this.setState({
                                codeStyle: styles.codeObtain,
                                checkCodeText: "重新获取",
                                codeSent: true,
                                flag: true,
                            })
                        }
                    }, 1000);
                    this.setState({timeId: this.timer1});
                } else {
                    const { msg } = responseText;
                    toast.show(msg, DURATION.LENGTH_SHORT)
                }
            } else {
                toast.show('获取验证码失败,请检查网络连接', DURATION.LENGTH_SHORT)
            }
        });
    };
    //初始化
    countDown = () => {
        console.log('初始化');
        clearInterval(this.timer1);
        this.setState({
            codeStyle: styles.codeObtain,
            checkCodeText: "获取验证码",
            codeSent: true
        });
    };
    //验证码提交函数
    savePhone = () => {
        const { toast } = this.refs;
        if (null === this.state.telephone || '' === this.state.telephone) {
            toast.show('请输入手机号码', DURATION.LENGTH_SHORT);
            return;
        }
        if (null === this.state.smsCode  || '' === this.state.smsCode) {
            toast.show('请输入手机验证码', DURATION.LENGTH_SHORT);
            return;
        }
        let url = "";
        if(this.state.transPassURL){
            url = `${this.state.transPassURL}&valicode=${this.state.smsCode}`;
        }else {
            url = `${config.api.login.phoneAuth}?username=${this.state.username}&verifyCode=${this.state.smsCode}&password=${this.state.password}`;
        }

        request.post(url).then((responseText) => {

            request.manyLogin(this.props, responseText);//验证登陆函数

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('登陆失败', 5000);
                return;
            }

            if (responseText.success) {

                this.countDown();

                this.setState({
                    isOpen:false
                });
                this.props.saveUser(responseText);
            } else {
                const { msg } = responseText;
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        });
    };
    //谷歌验证码特有函数，作用存疑？
    handleSelect = (index) => {
        this.setState({
            customStyleIndex: index,
        });
    };

    render() {
        const { type, keyboardSpace } = this.state;
        console.log("keyboardSpace",keyboardSpace);
        return (
            <Modal style={[styles.modal, styles.modal3,{
                position: 'absolute',
                bottom: 0,
                top: keyboardSpace ? keyboardSpace - p(450) : -10,
            }]}
                   position={"center"}
                   backButton={false}
                   backdropPressToClose={false}
                   swipeToClose={false}
                   isOpen={this.state.isOpen}>
                {/*关闭验证码弹窗组件*/}
                <TouchableOpacity
                    style={styles.imageView}
                    onPress={() => this.props.click()}>
                    <Image source={require('../static/login/clean.png')}
                           style={styles.imageType}/>
                </TouchableOpacity>
                {this.checkType(type)}
                <Toast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color:'white'}}
                />
            </Modal>
        );

    }
    //生成不同验证规则下的UI界面
    checkType = (state) =>{
        let { customStyleIndex } = this.state;
        if(state === 0){//短信验证
            return(
                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={{fontSize:p(30),marginVertical:p(60)}}>手机认证</Text>
                    <View style={styles.reWithView}>
                        {/*验证码输入框*/}
                        <TextInput
                            autoFocus={true}
                            underlineColorAndroid='transparent'
                            placeholder='请输入短信验证码'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.smsCode}
                            style={styles.inputTextView}
                            onChangeText={(text) => this.setState({smsCode:text})}
                        />
                        {/*获取验证码*/}
                        <TouchableOpacity
                            onPress={()=>{this.getCurrencyCode()}}
                            style={this.state.codeStyle}
                            activeOpacity={.8}>
                            <Text style={{color:'#FFF'}}>{this.state.checkCodeText}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*提交验证码*/}
                    <TouchableOpacity
                        onPress={this.savePhone}
                        activeOpacity={.8}
                        style={{ height:p(80),backgroundColor:'#D95411',marginTop:p(40),width:width-p(180),
                            alignItems: 'center',justifyContent:'center',borderRadius:p(10)}}>
                        <Text style={{color:'#fff',fontSize:p(26)}}>{I18n.t("baocun")}</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(state === 1){
            return(
                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={{fontSize:p(30),marginVertical:p(60)}}>谷歌认证</Text>
                    <View style={styles.reWithView}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='请输入谷歌验证码'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.googleCode}
                            style={styles.inputTextView}
                            onChangeText={(text) => this.setState({googleCode:text})}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.googleKey}
                        activeOpacity={.8}
                        style={{ height:p(80),backgroundColor:'#D95411',marginTop:p(40),width:width-p(180),
                            alignItems: 'center',justifyContent:'center',borderRadius:p(10)}}>
                        <Text style={{color:'#fff',fontSize:p(26)}}>{I18n.t("baocun")}</Text>
                    </TouchableOpacity>
                </View>
            )
        }else {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{fontSize: p(30), marginVertical: p(40)}}>二次验证</Text>
                    <View style={{height: p(70)}}>
                        <SegmentedControlTab
                            multiple={false}
                            values={['谷歌验证', '手机验证']}
                            selectedIndex={customStyleIndex}
                            onTabPress={this.handleSelect}
                            borderRadius={0}
                            tabsContainerStyle={{backgroundColor: '#D95411'}}
                            tabStyle={{
                                backgroundColor: '#313840',
                                borderWidth: StyleSheet.hairlineWidth,
                                borderColor: '#313840',
                                width: p(160)
                            }}
                            activeTabStyle={{backgroundColor: '#D95411'}}
                            tabTextStyle={{color: '#FFFFFF', fontWeight: 'bold'}}
                            activeTabTextStyle={{color: '#FFFFFF'}}/>
                    </View>
                    {customStyleIndex === 0 ?
                        <View style={{marginTop: p(30)}}>
                            <View style={styles.reWithView}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='请输入谷歌验证码'
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#B0B0B0'}
                                    value={this.state.googleCode}
                                    style={styles.inputTextView}
                                    onChangeText={(text) => this.setState({googleCode: text})}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={this.googleKey}
                                activeOpacity={.8}
                                style={{
                                    height: p(80), backgroundColor: '#D95411', width: width - p(200), marginTop: p(30),
                                    alignItems: 'center', justifyContent: 'center', borderRadius: p(10)
                                }}>
                                <Text style={{color: '#fff', fontSize: p(26)}}>{I18n.t("baocun")}</Text>
                            </TouchableOpacity>
                        </View>
                        : <View style={{marginTop: p(30)}}>
                            <View style={styles.reWithView}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='请输入短信验证码'
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#B0B0B0'}
                                    value={this.state.smsCode}
                                    style={styles.inputTextView}
                                    onChangeText={(text) => this.setState({smsCode: text})}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.getCurrencyCode()
                                    }}
                                    style={this.state.codeStyle}
                                    activeOpacity={.8}>
                                    <Text
                                        style={{color: '#FFF'}}>{this.state.checkCodeText}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={this.savePhone}
                                activeOpacity={.8}
                                style={{
                                    height: p(80), backgroundColor: '#D95411', marginTop: p(30), width: width - p(200),
                                    alignItems: 'center', justifyContent: 'center', borderRadius: p(10)
                                }}>
                                <Text style={{color: '#fff', fontSize: p(26)}}>{I18n.t("baocun")}</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:p(20)
    },
    modal3: {
        height: p(450),
        width: width-p(100)
    },
    imageType:{
        width:p(45),
        height:p(45)
    },
    imageView:{
        position: 'absolute',
        top: 0,
        right:0,
        zIndex:999
    },
    reWithView:{
        flexDirection:'row',
        height:p(80),
        alignItems:'center',
        paddingHorizontal:p(40)
    },
    inputTextView:{
        alignItems: 'center',
        justifyContent:'center',
        height:p(80),
        flex:1,
        backgroundColor:'#EFF0F2'
    },
    codeObtain:{
        backgroundColor:"#D95411",
        paddingHorizontal:p(20),
        height:p(80),
        alignItems:'center',
        justifyContent:'center'
    },
    codeFalse:{
        backgroundColor:"#929BA1",
        paddingHorizontal:p(20),
        height:p(80),
        alignItems:'center',
        justifyContent:'center'
    }
});