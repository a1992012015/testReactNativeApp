/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：注册功能组件
 *
 * */
'use strict';

import React, {PureComponent} from 'react';
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
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Checkbox} from 'teaset';
import Modal from 'react-native-modalbox';
import HTMLView from 'react-native-htmlview';

import md5 from '../../utils/hrymd5';
import I18n from '../../utils/i18n';
import p from '../../utils/tranfrom'
import config from '../../utils/config';
import request from '../../utils/request';
import Title from '../../components/title';
import SModal from '../../components/sModal';

const {width, height} = Dimensions.get('window');

class SignUp extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                telephone: "",
                registSmsCode: "",
                password: "",
                registCode: "",
                referralCode: "",
                graCode: '',
            },
            GraphicCode: `${config.api.host}${config.api.login.graCode}?${Math.random()}`,
            checked: true,
            content: '无',
            fotPassword: null,
        }
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {

        //查询注册协议
        let url = config.api.login.regreg;
        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                //toast.show('登陆失败', 5000);
                return;
            }

            if (responseText.success) {
                const {obj} = responseText;
                this.setState({
                    content: obj.regreg,
                })
            }

        })
    }

    //组件被移除之前被调用
    componentWillUnmount() {
        clearInterval(this.state.timeId);
    }

    _register = async () => {

        const {toast} = this.refs;

        if (this.state.data.telephone === '' || this.state.data.telephone === null) {
            toast.show(I18n.t('emailisnull'), DURATION.LENGTH_SHORT);
            return
        }

        let myReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if (!myReg.test(this.state.data.telephone)) {
            toast.show(I18n.t('emailvail'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.data.password === '') {
            toast.show(I18n.t('loginpwd_no_null'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.data.password.length < 6 || this.state.data.password.length > 20) {

            toast.show(I18n.t('passvail'), DURATION.LENGTH_SHORT);
            return;
        }

        let pwdReg = /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/g;
        if (!pwdReg.test(this.state.data.password)) {
            toast.show(I18n.t('passvail'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.data.password !== this.state.fotPassword) {
            toast.show(I18n.t('fotpassvail'), DURATION.LENGTH_SHORT);
            return;
        }

        if (!this.state.checked) {
            toast.show(I18n.t('agreement'), DURATION.LENGTH_SHORT);
            return;
        }

        let signUrl = `${config.api.login.reg}?username=${this.state.data.telephone}&password=${md5.md5(this.state.data.password)}&registCode=${this.state.data.registCode}&referralCode=${this.state.data.referralCode}`;
        console.log('signUrl', signUrl);

        this.setState({
            userIsLogin: true
        });

        request.post(signUrl).then(responseText => {
            console.log("responseText", responseText);

            if (responseText.ok) {
                console.log('请求接口失败');
                toast.show('数据获取失败', DURATION.LENGTH_SHORT);
                return;
            }

            if (responseText.success) {
                this.setState({userIsLogin: false});
                Alert.alert(
                    I18n.t('tishi'),
                    I18n.t('zcchenggong'),
                    [
                        {
                            text: I18n.t('queren'), onPress: () => {
                                this.props.navigation.goBack();
                            }
                        }
                    ]
                );
            } else {
                this.refresh();
                this.setState({userIsLogin: false});
                const {msg} = responseText;
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        })

    };

    refresh = () => {
        this.setState({
            GraphicCode: `${config.api.host}${config.api.login.graCode}?${Math.random()}`
        })
    };

    //查看协议
    _readModal = () => {
        this.setState({
            isOpen: true,
            checked: true
        });
    };
    //关闭
    _click = () => {
        this.setState({
            isOpen: false
        });
    };

    render() {
        return (
            <View style={{backgroundColor: '#1F2229', height: height}}>
                {/*标题*/}
                <Title {...this.props} canBack={true} titleName={I18n.t('signUp')}/>

                <KeyboardAvoidingView behavior="padding" style={{flex: 1, paddingHorizontal: 20}}>

                    <ScrollView>

                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('please_write_email')}
                                style={styles.regInput}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                onChangeText={(telephone) => this.state.data.telephone = telephone}
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
                                onChangeText={(password) => this.state.data.password = password}
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
                                onChangeText={(fotPassword) => this.state.fotPassword = fotPassword}
                            />
                        </View>
                        <View style={styles.regInputView}>
                            <TextInput
                                placeholder={I18n.t('tuxingyanzhengma')}
                                underlineColorAndroid='transparent'
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                style={styles.regInput}
                                onChangeText={(registCode) => this.state.data.registCode = registCode}
                            />
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={this.refresh}>
                                <Image style={{width: p(130), height: p(50), marginRight: p(10)}}
                                       source={{uri: this.state.GraphicCode}}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.regInputView}>
                            <TextInput placeholder={I18n.t('tuijianrenshoujihao')}
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor={'#565A5D'}
                                       clearButtonMode={'while-editing'}
                                       style={styles.regInput}
                                       onChangeText={(referralCode) => this.state.data.referralCode = referralCode}
                            />
                        </View>

                        <View style={styles.checkStyle}>
                            <View style={styles.checkboxStyle}>
                                <Checkbox size='md'
                                          checked={this.state.checked}
                                          onChange={() => this.setState({checked: !this.state.checked})}
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

                    <View style={{height: p(60), alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: p(24)}}>注册服务协议</Text>
                    </View>

                    <ScrollView style={{flex: 1, borderBottomRightRadius: p(20), borderBottomLeftRadius: p(20)}}>
                        <HTMLView value={this.state.content}
                                  style={{padding: 10, backgroundColor: '#f9f9f9'}}
                        />

                    </ScrollView>

                    <TouchableOpacity style={styles.imageView}
                                      onPress={() => this._click()}
                    >
                        <Image source={require('../../static/login/clean.png')}
                               style={styles.imageType}
                        />
                    </TouchableOpacity>
                </Modal>

                <Toast ref="toast"
                       style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                       position='top'
                       textStyle={{color: 'white'}}
                />
                <SModal hasLoading={this.state.userIsLogin}/>

            </View>
        )
    }
}

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
        color: '#FFFFFF',
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
        justifyContent: 'center',
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
    codeObtain: {
        color: '#FFFFFF',
        backgroundColor: "#D95411",
        marginRight: p(20),
        paddingVertical: p(10),
        textAlign: 'center',
        paddingHorizontal: p(12),
    },
    codeFalse: {
        color: '#FFFFFF',
        backgroundColor: "#929BA1",
        marginRight: p(20),
        paddingVertical: p(10),
        textAlign: 'center',
        paddingHorizontal: p(12),
    },
    checkStyle: {
        marginRight: p(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: p(20),
        marginBottom: p(20),
    },
    checkboxStyle: {
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
        height: height / 2 + p(200),
        width: width - p(60),
    },
    imageType: {
        width: p(45),
        height: p(45),
    },
    imageView: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 999,
    },
});

export default SignUp;