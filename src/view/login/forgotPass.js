/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：忘记密码页面
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
} from 'react-native' ;
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../utils/tranfrom';
import I18n from '../../utils/i18n';
import config from '../../utils/config';
import Request from '../../utils/request';
import Title from '../../components/title';
import PromptModal from '../../components/promptModal';
import Loading from '../../components/loading';

const request = new Request();

export default class ForgotPass extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            email: '',
            isOpen: false,
            fotSent: true,
            visible: false,
        };
    }
    //忘记密码提交
    fotOne = () => {
        const {toast, emailInput} = this.refs;

        if (this.state.email === '' || this.state.email === null) {
            toast.show("请输入邮箱", DURATION.LENGTH_SHORT);
            return;
        }

        let myReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if (!myReg.test(this.state.email)) {
            toast.show(I18n.t('emailvail'), DURATION.LENGTH_SHORT);
            return;
        }

        if (!this.state.fotSent) {
            return;
        }

        emailInput.blur();

        this.setState({
            fotSent: false,
            visible: true,
        });
        //地址
        let url = config.api.login.stepOne;
        //参数
        const actions = {
            email: this.state.email,
        };

        request.post(url, actions, this.props).then((responseText) => {

            if (responseText.ok) {
                console.log('请求接口失败');
                toast.show('数据获取失败', DURATION.LENGTH_SHORT);
                return;
            }

            if (responseText.success) {
                this.setState({
                    isOpen: true,
                    fotSent: true,
                    visible: false
                });
            } else {
                const {msg} = responseText;
                toast.show(msg, DURATION.LENGTH_SHORT);
                this.setState({
                    fotSent: true,//能否重复提交
                    visible: false,//加载特效
                });
            }
        });
    };

    // 渲染
    render() {

        return (
            <View style={styles.defaultView}>
                {/*标题*/}
                <Title titleName={I18n.t('chongzhimima')} canBack={true} {...this.props}/>
                {/*手机号数据组件*/}
                <View style={styles.blockSty}>
                    <View style={styles.reWithView}>
                        {/*手机号输入框*/}
                        <TextInput
                            ref="emailInput"
                            underlineColorAndroid='transparent'
                            placeholder={I18n.t('please_write_email')}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.email}
                            style={styles.inputTextView}
                            onChangeText={(text) => this.setState({email: text})}
                        />
                    </View>
                </View>
                {/*确认按钮*/}
                <TouchableOpacity
                    onPress={() => this.fotOne()}
                    activeOpacity={.8}
                    style={{
                        height: p(80),
                        backgroundColor: '#D95411',
                        borderWidth: 1,
                        margin: p(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: p(10)
                    }}
                >
                    <Text style={{color: '#fff', fontSize: p(26)}}>{I18n.t('next')}</Text>
                </TouchableOpacity>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color: 'white'}}
                />
                <Loading visible={this.state.visible}/>
                <PromptModal isOpen={this.state.isOpen} {...this.props}/>
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
    inputText: {
        color: 'white',
        paddingLeft: p(20),
        width: p(180),
        fontSize: p(24)
    },
    inputTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        fontSize: p(24),
        height: p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF'
    },
    reWithView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: p(70)
    },
    promptText: {
        color: '#B0B0B0',
        fontSize: p(22),
        padding: p(10)
    },
    codeObtain: {
        backgroundColor: "#D95411",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12)
    },
    codeFalse: {
        backgroundColor: "#929BA1",
        color: 'white',
        marginRight: p(20),
        paddingVertical: p(8),
        textAlign: 'center',
        paddingHorizontal: p(12)
    }
});