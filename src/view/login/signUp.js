/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：注册功能组件
 *
 * */
'use strict';

import React, {Component}from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    KeyboardAvoidingView,
    Alert,
    ScrollView
}from 'react-native';
import { NavigationActions } from 'react-navigation';
import store from 'react-native-simple-store';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Toast, { DURATION } from 'react-native-easy-toast';
import {Checkbox} from 'teaset';
import Modal from 'react-native-modalbox';
import HTMLView from 'react-native-htmlview';

import md5 from '../../utils/hrymd5';
import I18n from '../../utils/i18n';
import p  from '../../utils/tranfrom'
import config from '../../utils/config';
import request from '../../utils/request';
import allCountriesData from '../../utils/data';
import Title from  '../../components/Title';
import SelectApp from '../../components/SelectApp';
import SModal from '../../components/SModal';

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
    regView: {
        margin: p(20),
        width: width - p(40),
        backgroundColor: '#1F2229',
    },
    regInput: {
        marginLeft: p(20),
        fontSize: p(24),
        height: p(90),
        flex: 1,
        padding: 0,
        color:'#FFFFFF',
    },
    regInputView: {
        height: p(80),
        justifyContent: 'space-around',
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: '#313840',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#565A5D',
        marginVertical: p(10),

    },
    reg_btn: {
        height: p(70),
        backgroundColor: '#D95411',
        padding: p(20),
        marginTop: p(20),
        justifyContent:'center',
    },
    reg_btn_text: {
        color: '#fff',
        fontSize: p(30),
        textAlign: 'center',
        alignItems: 'center',
    },
    centering: {
        marginTop: (height - p(110)) / 2,
        alignItems: 'center',
        justifyContent: 'center',

    },
    codeObtain:{
        color:'#FFFFFF',
        backgroundColor: "#D95411",
        marginRight: p(20),
        paddingVertical: p(10),
        textAlign: 'center',
        paddingHorizontal: p(12),
    },
    codeFalse:{
        color: '#FFFFFF',
        backgroundColor: "#929BA1",
        marginRight: p(20),
        paddingVertical: p(10),
        textAlign: 'center',
        paddingHorizontal: p(12),
    },
    checkStyle:{
        marginRight: p(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: p(20),
        marginBottom: p(20),
    },
    checkboxStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        alignItems: 'center',
        borderRadius: p(20),
        backgroundColor: '#acacac',

    },
    modal3: {
        height: height/2+p(200),
        width: width-p(60),
    },
    imageType:{
        width: p(45),
        height: p(45),
    },
    imageView:{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 999,
    },
});

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                telephone: "",
                registSmsCode: "",
                password: "",
                registCode: "",
                referralCode: "",
                graCode:''
            },
            countDown: 120,
            checkCodeText: "获取验证码",
            codeSent: true,
            countingDown: "",
            codeStyle: styles.codeObtain,
            check: {
                getCode: false,
                password: false
            },
            verifyCode: null,
            timeId: null,
            userIsLogin: false,
            af_swift_number: '',
            GraphicCode:config.api.host+config.api.login.graCode+"?"+Math.random(),
            checked:true,
            content:'无',
            fotPassword:null,
            customStyleIndex:0,
            region:'cn_86',
        }
    }

    componentDidMount() {

        //查询注册协议
        let url = config.api.host + config.api.login.regreg;
        request.post(url).then(responseText => {
            if(responseText.success){
                this.setState({
                    content: responseText.obj.regreg,
                })
            }

        })

    }

    _getLogin = (url) => {
        console.log("url",url);
        let that = this;
        return fetch(url,{
            method: 'POST',
            headers: {
                "Accept": "application/json;charset=utf-8",
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then((response) => response.json()).catch(function (error) {
            console.log('获取用户登录数据报错信息: ' + error.message);
            that.refs.toast.show(I18n.t('network'), DURATION.LENGTH_LONG)
        });
    };

    _register = async() => {
        if (this.state.data.telephone === '' || this.state.data.telephone === null) {
            this.refs.toast.show(I18n.t('emailisnull'), DURATION.LENGTH_LONG);
            return

        }
        let myreg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if(!myreg.test(this.state.data.telephone))
        {
            this.refs.toast.show(I18n.t('emailvail'), DURATION.LENGTH_LONG);
            return;
        }

        if ("" == this.state.data.password) {
            this.refs.toast.show(I18n.t('loginpwd_no_null'), DURATION.LENGTH_LONG);
            return;
        }

        if (this.state.data.password.length < 6 || this.state.data.password.length > 20) {

            this.refs.toast.show(I18n.t('passvail'), DURATION.LENGTH_LONG);
            return;
        }
        let pwdReg = /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/g;
        if (!pwdReg.test(this.state.data.password)) {
            this.refs.toast.show(I18n.t('passvail'), DURATION.LENGTH_LONG);
            return;
        }

        if(this.state.data.password != this.state.fotPassword){
            this.refs.toast.show(I18n.t('fotpassvail'), DURATION.LENGTH_LONG);
            return;
        }

        if(!this.state.checked){
            this.refs.toast.show(I18n.t('agreement'), DURATION.LENGTH_LONG);
            return;
        }

        let signUrl = config.api.host + config.api.login.reg+'?username=' + this.state.data.telephone + '&password=' + md5.md5(this.state.data.password)
            + '&registCode=' + this.state.data.registCode + '&referralCode=' + this.state.data.referralCode;
        //let loginUrl = config.api.host + config.api.login.login+'?username=' + this.state.data.telephone + '&password=' + md5.md5(this.state.data.password);

        console.log('signUrl', signUrl);
        this.setState({
            userIsLogin: true
        });
        request.post(signUrl).then(responseText => {
            console.log("responseText",responseText);
            if (responseText.success) {
                this.setState({userIsLogin: false});
                Alert.alert(
                    I18n.t('tishi'),
                    I18n.t('zcchenggong'),
                    //responseText.msg,
                    [
                        {
                            text: I18n.t('queren'), onPress: () => {
                                //const {params} = this.props.navigation.state;
                                //params.infoAction();
                                this.props.navigation.goBack();
                            }
                        }
                    ]
                );
                //this.refs.toast.show(I18n.t('zcchenggong'), DURATION.LENGTH_LONG);
                //this.props.navigation.goBack();
                /*this._getLogin(loginUrl)
                    .then((responseText) => {
                        this.setState({userIsLogin: false});
                        if (responseText) {
                            console.log('登录时候返回的结果', responseText);
                            responseText.success ? this._toMain(responseText) : this.refs.toast.show(responseText.msg, DURATION.LENGTH_LONG);
                        }
                    })*/

            } else {
                this.refresh();
                this.setState({userIsLogin: false});
                this.refs.toast.show(responseText.msg, DURATION.LENGTH_LONG);

            }
        })

    };

    registerPhone = async() => {


        if (!this.state.check.getcode) {
            this.refs.toast.show('请先获取手机验证码', DURATION.LENGTH_LONG);
            return;
        }
        if ("" == this.state.data.registSmsCode) {
            this.refs.toast.show('请输入手机验证码', DURATION.LENGTH_LONG);
            return;
        }
        if (this.state.data.telephone === '' || this.state.data.telephone === null) {
            this.refs.toast.show("请输入手机号码", DURATION.LENGTH_LONG);
            return

        }
        let code = this.state.region.split("_");
        if(isNaN(this.state.data.telephone)){
            this.refs.toast.show('请输入正确的手机号码', DURATION.LENGTH_LONG);
            return;
        }
        if(code[1] == "86"){
            let regMobile = /^(((14[0-9]{1})|(17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
            if (!regMobile.test(this.state.data.telephone)) {
                this.refs.toast.show('请输入正确的手机号码', DURATION.LENGTH_LONG);
                return;
            }
        }

        if ("" == this.state.data.password) {
            this.refs.toast.show(I18n.t('loginpwd_no_null'), DURATION.LENGTH_LONG);
            return;
        }

        if (this.state.data.password.length < 6 || this.state.data.password.length > 20) {

            this.refs.toast.show(I18n.t('passvail'), DURATION.LENGTH_LONG);
            return;
        }
        let pwdReg = /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/g;
        if (!pwdReg.test(this.state.data.password)) {
            this.refs.toast.show(I18n.t('passvail'), DURATION.LENGTH_LONG);
            return;
        }

        if(this.state.data.password != this.state.fotPassword){
            this.refs.toast.show(I18n.t('fotpassvail'), DURATION.LENGTH_LONG);
            return;
        }

        if(!this.state.checked){
            this.refs.toast.show(I18n.t('agreement'), DURATION.LENGTH_LONG);
            return;
        }

        let signUrl = config.api.host + config.api.login.regMobile+'?mobile=' + this.state.data.telephone + '&password=' + md5.md5(this.state.data.password)
            + '&registSmsCode=' + this.state.data.registSmsCode + '&referralCode=' + this.state.data.referralCode + "&country=+" + code[1] + '&registCode=' + this.state.data.registCode;

        console.log('signUrl', signUrl);
        this.setState({
            userIsLogin: true
        });
        request.post(signUrl).then(responseText => {
            console.log("responseText",responseText);
            if (responseText.success) {
                this.setState({userIsLogin: false});
                Alert.alert(
                    I18n.t('tishi'),
                    "注册成功，请登录!",
                    //responseText.msg,
                    [
                        {
                            text: I18n.t('queren'), onPress: () => {
                                //const {params} = this.props.navigation.state;
                                //params.infoAction();
                                this.props.navigation.goBack();
                            }
                        }
                    ]
                );

            } else {
                this.refresh();
                this.setState({userIsLogin: false});
                this.refs.toast.show(responseText.msg, DURATION.LENGTH_LONG);

            }
        })

    };


    _toMain = (responseText) => {
        this.refs.toast.show(I18n.t('reg_success'), DURATION.LENGTH_LONG);
        setTimeout(() => {
            console.log('用户登录Id==>', responseText.obj.UUID);
            store.save('member', {
                memberInfo: responseText.obj.user,
                isLogin: true,
                token: responseText.obj.UUID
            });
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'TabBar'})
                ]
            });
            this.props.navigation.dispatch(resetAction);
        }, 2000);

        this.setState({
            userIsLogin: false
        })
    };

    _getCheckCode() {
        if ("" == this.state.data.telephone) {
            this.refs.toast.show('请输入您的手机号码', DURATION.LENGTH_LONG);
            return;
        }
        if ("" == this.state.data.registCode) {
            this.refs.toast.show('请输入图形验证码', DURATION.LENGTH_LONG);
            return;
        }
        let code = this.state.region.split("_");
        if(isNaN(this.state.data.telephone)){
            this.refs.toast.show('请输入正确的手机号码', DURATION.LENGTH_LONG);
            return;
        }
        if(code[1] == "86"){
            let regMobile = /^(((14[0-9]{1})|(17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
            if (!regMobile.test(this.state.data.telephone)) {
                this.refs.toast.show('请输入正确的手机号码', DURATION.LENGTH_LONG);
                return;
            }
        }
        if (!this.state.codeSent) {
            return;
        }
        let url = config.api.host + config.api.login.smsCode + '?userName=' + this.state.data.telephone
            + '&registCode=' + this.state.data.registCode;
        console.log('获取验证码URL',url);
        request.setPost(url).then((responseText)=>{
            console.log("responseText",responseText);
            if (responseText) {
                if (responseText.success) {
                    this.setState({
                        codeStyle: styles.codeFalse
                    });
                    this.refs.toast.show('短信发送成功', DURATION.LENGTH_LONG);
                    this.state.check.getcode = true;

                    let num = 60;
                    this.setState({
                        codeSent: false
                    });
                    this.timer1 = setInterval(() => {

                        num--;
                        this.setState({
                            checkCodeText: num + 's重新获取'
                        });
                        if (num < 0) {
                            clearInterval(this.timer1);
                            this.setState({
                                codeStyle: styles.codeObtain,
                                checkCodeText: "重新获取",
                                codeSent: true
                            })
                        }
                    }, 1000);
                    this.setState({timeId: this.timer1});
                } else {
                    this.refs.toast.show(responseText.msg, DURATION.LENGTH_LONG)
                }
            } else {
                this.refs.toast.show(I18n.t('network'), DURATION.LENGTH_LONG)
            }
        });

    }

    componentWillUnmount() {
        clearInterval(this.state.timeId);
    }

    refresh = () => {
        this.setState({
            GraphicCode:config.api.host+config.api.login.graCode+"?"+Math.random()
        })
    };

    //查看协议
    _readModal = () => {
        this.setState({
            isOpen:true,
            checked:true
        });
    }
    //关闭
    _click=()=>{
        this.setState({
            isOpen:false
        });
    };

    render() {
        return (
            <View style={{backgroundColor: '#1F2229', height: height}}>
                {/*标题*/}
                <Title {...this.props} canBack={true} titleName={I18n.t('register')}/>

                <KeyboardAvoidingView behavior="padding" style={{flex: 1, paddingHorizontal: 20}}>

                    <ScrollView>

                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('please_write_email')}
                                style={styles.regInput}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                onChangeText={(telephone) => this.state.data.telephone=telephone}
                            />
                        </View>

                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('mimageshi')}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                style={styles.regInput}
                                secureTextEntry={true}
                                onChangeText={(password) => this.state.data.password=password}
                            />
                        </View>
                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('querenmima')}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                style={styles.regInput}
                                secureTextEntry={true}
                                onChangeText={(fotPassword) => this.state.fotPassword=fotPassword}
                            />
                        </View>
                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('tuxingyanzhengma')}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                style={styles.regInput}
                                onChangeText={(registCode) => this.state.data.registCode=registCode}
                            />
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={this.refresh}>
                                <Image style={{width:p(130),height:p(50),marginRight:p(10)}}
                                       source={{uri:this.state.GraphicCode}}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.regInputView}>
                            <TextInput placeholder={I18n.t('tuijianrenshoujihao')}
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor={'#565A5D'}
                                       clearButtonMode={'while-editing'}
                                       style={styles.regInput}
                                       onChangeText={(referralCode) => this.state.data.referralCode=referralCode}
                            />
                        </View>

                        <View style={styles.checkStyle}>
                            <View style={styles.checkboxStyle}>
                                <Checkbox size='md'
                                          checked={this.state.checked}
                                          onChange={value => this.setState({checked: !this.state.checked})}
                                />
                                <Text style={{color: "#FFF", fontSize: p(25)}}>我已阅读并接受</Text>
                            </View>
                            <TouchableOpacity activeOpacity={.8}
                                              onPress={() => this._readModal(this)}>
                                <Text style={{color: "#3F8DE0", fontSize: p(25), marginRight: p(20)}}>
                                    《用户服务协议》
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity activeOpacity={.8}
                                          onPress={() => this._register()}
                                          style={styles.reg_btn}
                        >
                            <Text style={styles.reg_btn_text}>{I18n.t('signUp')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>


                <Modal style={[styles.modal, styles.modal3]}
                       position={"center"}
                       backButton={false}
                       backdropPressToClose={false}
                       swipeToClose={false}
                       isOpen={this.state.isOpen}>

                    <View style={{height: p(60),alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{fontSize:p(24)}}>注册服务协议</Text>
                    </View>

                    <ScrollView style={{flex:1,borderBottomRightRadius: p(20),borderBottomLeftRadius: p(20)}}>
                        <HTMLView value={this.state.content}
                                  style={{padding: 10, backgroundColor: '#f9f9f9'}}
                        />

                    </ScrollView>

                    <TouchableOpacity style={styles.imageView}
                                      onPress={()=>this._click()}
                    >
                        <Image source={require('../../static/login/clean.png')}
                               style={styles.imageType}
                        />
                    </TouchableOpacity>
                </Modal>

                <Toast ref="toast"
                       style={{backgroundColor:'rgba(0,0,0,.6)'}}
                       position='top'
                       textStyle={{color:'white'}}
                />
                <SModal hasLoading={this.state.userIsLogin}/>

            </View>
        )
    }
}

export default SignUp;