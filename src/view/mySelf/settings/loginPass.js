/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：个人信息设置页面 => 修改密码
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native' ;
import store from 'react-native-simple-store';
import {NavigationActions, StackActions} from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import request from '../../../utils/request';
import md5 from '../../../utils/hrymd5';
import I18n from '../../../utils/i18n';
import CheckModal from '../../../components/checkModal';
import Title from '../../../components/title';

export default class LoginPass extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            name: '',
            username: '',
            checkCodeText: "获取验证码",
            codeStyle: styles.codeObtain,
            codeSent: true,
            isCheckCode: false,
            oldPassWord: null,
            newPassWord: null,
            pwSmsCode: null,
            reNewPassWord: null,
            timeId: '',
            checkOpen: false,
            type: 0,
            user: ''
        };
    }

    //真实结构渲染之后
    componentDidMount() {
        const {params} = this.props.navigation.state;
        console.log("member", params.member);
        this.setState({
            username: params.username,
            user: params.member
        });
    }

    //组件被移除之后调用
    componentWillUnmount() {

    }

    //密码修改成功跳转主页
    saveUser = () => {
        Alert.alert(
            '提示',
            '登录密码修改成功',
            [{
                text: '确认', onPress: () => {
                    store.delete('member');

                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'TabBar'})],
                    });

                    this.props.navigation.dispatch(resetAction);
                }
            }]
        );
    };
    //获取验证码组件
    _click = () => {
        this.setState({
            checkOpen: false
        });
    };
    //修改配置
    _toMain = (responseText, transPassURL) => {

        const {obj, msg} = responseText;
        const {toast} = this.refs;

        if (obj) {

            const {phoneState, googleState} = obj;
            if (phoneState === 1 && googleState === 1) {
                this.setState({
                    checkOpen: true,
                    type: 2,
                    user: obj,
                    transPassURL: transPassURL
                })
            } else if (phoneState === 1 && googleState === 0) {
                //手机认证
                this.setState({
                    checkOpen: true,
                    type: 0,
                    user: obj,
                    transPassURL: transPassURL
                })
            } else if (phoneState === 0 && googleState === 1) {
                //谷歌认证
                this.setState({
                    checkOpen: true,
                    type: 1,
                    user: obj,
                    transPassURL: transPassURL
                })
            } else {
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        } else {
            toast.show(msg, DURATION.LENGTH_SHORT);
        }
    };
    //提交修改的密码
    getLoginPass = () => {
        const {toast} = this.refs;

        if (null === this.state.oldPassWord || '' === this.state.oldPassWord) {
            toast.show(I18n.t("oldpwd_no_null"), DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.newPassWord || '' === this.state.newPassWord) {
            toast.show(I18n.t("newpwd_no_null"), DURATION.LENGTH_SHORT);
            return;
        }

        let pwdReg = /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/g;
        //密码格式不对
        if (!pwdReg.test(this.state.newPassWord)) {
            toast.show(I18n.t('passvail'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.newPassWord.length < 6 || this.state.newPassWord.length > 20) {

            toast.show("新密码位数不能少于6位", DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.reNewPassWord || '' === this.state.reNewPassWord) {
            toast.show(I18n.t("zaicishuruxinmima"), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.newPassWord !== this.state.reNewPassWord) {
            toast.show(I18n.t("twopwd_is_diff"), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.newPassWord === this.state.oldPassWord) {
            toast.show(I18n.t("newandold_no_null"), DURATION.LENGTH_SHORT);
            return;
        }

        let url = `${config.api.person.loginPass}?oldPassWord=${md5.md5(this.state.oldPassWord)}&newPassWord=${md5.md5(this.state.newPassWord)}&reNewPassWord=${md5.md5(this.state.reNewPassWord)}`;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            if (responseText.success) {
                Alert.alert(
                    '提示',
                    '登录密码修改成功',
                    [{text: '确认', onPress: () => this.saveUser()}]
                );
            } else {
                this._toMain(responseText, url);
            }
        });
    };

    // 渲染
    render() {
        return (
            <View style={styles.defaultView}>
                {/*标题组件*/}
                <Title titleName={I18n.t("denglumima")} canBack={true} {...this.props}/>

                <View style={styles.blockSty}>
                    <View style={styles.reWithView}>
                        {/*标题*/}
                        <View>
                            <Text style={styles.inputText}>{I18n.t("yuanshidenglumima")}:</Text>
                        </View>
                        {/*原密码输入框*/}
                        <View style={{flex: 1}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder={'请输入您的原始登录密码'}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#B0B0B0'}
                                selectionColor={"#FFF"}
                                value={this.state.oldPassWord}
                                style={styles.inputTextView}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({oldPassWord: text})}
                            />
                        </View>
                    </View>
                    <View style={styles.reWithView}>
                        {/*标题*/}
                        <View>
                            <Text style={styles.inputText}>{I18n.t("xindenglumima")}:</Text>
                        </View>
                        {/*新密码输入框*/}
                        <View style={{flex: 1}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder={I18n.t("mimageshi")}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#B0B0B0'}
                                selectionColor={"#FFF"}
                                value={this.state.newPassWord}
                                style={styles.inputTextView}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({newPassWord: text})}
                            />

                        </View>
                    </View>
                    <View style={styles.reWithView}>
                        {/*标题*/}
                        <View>
                            <Text style={styles.inputText}>{I18n.t("xindenglumima")}:</Text>
                        </View>
                        {/*新密码确认*/}
                        <View style={{flex: 1}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder={'请再次输入您的新登录密码'}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#B0B0B0'}
                                selectionColor={"#FFF"}
                                value={this.state.reNewPassWord}
                                style={styles.inputTextView}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({reNewPassWord: text})}
                            />
                        </View>
                    </View>
                </View>
                {/*确认按钮*/}
                <TouchableOpacity
                    onPress={this.getLoginPass}
                    activeOpacity={.8}
                    style={{
                        height: p(80),
                        backgroundColor: '#D95411',
                        borderWidth: 1,
                        margin: p(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: p(10)
                    }}>
                    <Text style={{color: '#fff', fontSize: p(26)}}>{I18n.t("baocun")}</Text>
                </TouchableOpacity>
                {/*验证码模块*/}
                <CheckModal
                    checkOpen={this.state.checkOpen}
                    {...this.props}
                    type={this.state.type}
                    user={this.state.user}
                    password={md5.md5(this.state.oldPassWord)}
                    saveUser={this.saveUser}
                    click={this._click}
                    transPassURL={this.state.transPassURL}
                />
                {/*提示窗组件*/}
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
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: 1,
        borderRadius: p(5),
        borderColor: 'transparent',
        marginHorizontal: p(20),

    },
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228',
    },
    inputText: {
        color: 'white',
        paddingLeft: p(20),
    },
    inputTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        height: p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF',
        fontSize: p(24),
    },
    reWithView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: p(70),
        justifyContent: 'space-between',
    },
    codeObtain: {
        backgroundColor: "#D95411",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
        fontSize: p(26),
    },
    codeFalse: {
        backgroundColor: "#929BA1",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12),
        fontSize: p(26),
    }
});