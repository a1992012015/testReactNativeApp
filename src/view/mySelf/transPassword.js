/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：个人信息设置页面 =>  => 填写页面
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';

import p from '../../utils/tranfrom';
import config from '../../utils/config';
import request from '../../utils/request';
import md5 from '../../utils/hrymd5';
import Title from '../../components/title';

export default class TransPassword extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            name: '',
            accountPassWord: null,
            reaccountPassWord: null,
            accountpwSmsCode: null,
            checkCodeText: "获取验证码",
            codeStyle: styles.codeObtain,
            codeSent: true,
            isCheckCode: false,
            username: '',
            timeId: '',
        };
    }
    //真实结构渲染出来之后调用
    componentDidMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            username:params.username
        });
    }
    //组件被移除之前被调用
    componentWillUnmount() {
        clearInterval(this.state.timeId);
    }

    getTransCode = () => {
        const { toast } = this.refs;

        if (null == this.state.accountPassWord || '' === this.state.accountPassWord) {
            toast.show('请输入交易密码', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.accountPassWord < 6 || this.state.accountPassWord > 20) {

            toast.show('您设置的密码不合符要求', DURATION.LENGTH_SHORT);
            return;
        }

        if (null == this.state.reaccountPassWord || '' === this.state.reaccountPassWord) {
            toast.show('请确认您的交易密码', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.accountPassWord !== this.state.reaccountPassWord) {
            toast.show('两次密码输入不一致', DURATION.LENGTH_SHORT);
            return;
        }

        if (!this.state.codeSent) {
            return;
        }

        let url = `${config.api.person.transCode}?accountPassWord=${md5.md5(this.state.accountPassWord)}&reaccountPassWord=${md5.md5(this.state.reaccountPassWord)}`;

        console.log('获取验证码URL',url);

        request.post(url).then((responseText)=>{

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log("responseText",responseText);

            const { msg } = responseText;

            if (responseText) {
                if (responseText.success) {
                    this.setState({
                        codeStyle: styles.codeFalse
                    });

                    toast.show('短信发送成功', DURATION.LENGTH_SHORT);

                    let num = 60;
                    this.setState({
                        codeSent: false,
                        isCheckCode:true
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
                    toast.show(msg, DURATION.LENGTH_SHORT)
                }
            } else {
                toast.show('获取验证码失败,请检查网络连接', DURATION.LENGTH_SHORT)
            }
        });
    };

    getTransPass =() =>{
        const { toast } = this.refs;

        if(!this.state.isCheckCode){
            toast.show('请先获取短信验证码', DURATION.LENGTH_SHORT);
            return;
        }

        if (null == this.state.accountpwSmsCode || '' === this.state.accountpwSmsCode) {
            toast.show('请输入短信验证码', DURATION.LENGTH_SHORT);
            return;
        }

        let url = `${config.api.person.transPass}?accountPassWord=${md5.md5(this.state.accountPassWord)}&reaccountPassWord=${md5.md5(this.state.reaccountPassWord)}&accountpwSmsCode=${this.state.accountpwSmsCode}`;

        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log('responseText',responseText);
            const { msg } = responseText;

            if(responseText.success){
                Alert.alert(
                    '提示',
                    '交易密码修改成功',
                    [{text: '确认', onPress: () => {
                            const {params} = this.props.navigation.state;
                            params.infoAction();
                            this.props.navigation.goBack();
                        }
                    }]
                );
            }else{
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        })
    };
    // 渲染
    render() {
        return (
            <View style={styles.defaultView}>
                <Title titleName="交易密码" canBack={true} {...this.props}/>
                <View style={styles.blockSty}>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>交易密码:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'请输入您的交易密码'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.accountPassWord}
                            style={styles.inputTextView}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({accountPassWord: text})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>确认密码:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'请再次输入您的交易密码'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.reaccountPassWord}
                            style={styles.inputTextView}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({reaccountPassWord: text})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>手机号码:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            editable={false}
                            value={this.state.username}
                            style={styles.inputTextView}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>短信验证码:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='请输入短信验证码'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.accountpwSmsCode}
                            style={styles.inputTextView}
                            onChangeText={text => this.setState({accountpwSmsCode: text})}
                        />
                        <TouchableOpacity
                            onPress={() => {this.getTransCode()}}
                            activeOpacity={.8}
                        >
                            <Text style={this.state.codeStyle}>{this.state.checkCodeText}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View
                    style={{
                        margin: p(20),
                        borderWidth: 1,
                        borderColor: 'transparent',
                        borderRadius: p(5),
                        backgroundColor: 'transparent',
                    }}>
                    <Text style={styles.promptText}>1.交易密码是在交易所进行交易时需要输入的密码，不同于登录密码。为确保您的财产安全，请牢记交易密码，防止丢失!</Text>
                    <Text style={styles.promptText}>2.密码格式:(含英文字母+数字,不小于6位)。</Text>
                </View>
                <TouchableOpacity
                    onPress={this.getTransPass}
                    activeOpacity={.8}
                    style={{height: p(80),
                        backgroundColor: '#D95411',
                        borderWidth: 1,
                        margin: p(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: p(10),
                    }}
                >
                    <Text style={{color:'#fff',fontSize:p(26)}}>保存</Text>
                </TouchableOpacity>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color:'white'}}
                />
            </View>
        );
    }

}

let styles = StyleSheet.create({
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: 1,
        borderRadius: p(5),
        borderColor: 'transparent',
        marginHorizontal: p(20)

    },
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228'
    },
    inputText:{
        color: 'white',
        paddingLeft: p(20),
        width: p(180)
    },
    inputTextView:{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        height:  p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF'
    },
    reWithView:{
        flexDirection: 'row',
        alignItems: 'center',
        height: p(80)
    },
    promptText:{
        color: '#B0B0B0',
        fontSize: p(22)
    },
    codeObtain:{
        backgroundColor: "#D95411",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12)
    },
    codeFalse:{
        backgroundColor: "#929BA1",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12)
    }
});