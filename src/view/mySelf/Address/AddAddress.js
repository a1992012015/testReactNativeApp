/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：钱包地址管理 => 添加钱包地址
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    Alert,
} from 'react-native' ;
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import Request from '../../../utils/request';
import Loading from '../../../components/loading';
import SelectApp from '../../../components/selectApp';
import Title from '../../../components/title';

const request = new Request();

export default class AddAddress extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currencyList: [],
            currencyType: null,
            publicKey: null,
            remark: null,
            visible: false
        };
    }

    //真实的DOM渲染出来后调用
    componentDidMount() {
        this.getType();
    }

    getType = () => {
        this.setState({
            visible: true
        });

        let typeUrl = config.api.currency.addAccount;

        request.post(typeUrl, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            this.setState({
                visible: false
            });

            const {obj} = responseText;
            let currencyList = [];

            for (let i = 0; i < obj.length; i++) {
                let item = {
                    text: obj[i].coinCode,
                    value: obj[i].coinCode,
                };
                currencyList.push(item);
            }
            console.log("currencyList", currencyList);
            this.setState({
                currencyList: currencyList,
            })
        })
    };
    //添加币账户
    addWallet = () => {
        const {toast} = this.refs;

        if (null == this.state.currencyType || '' === this.state.currencyType) {
            toast.show('请选择币的类型', DURATION.LENGTH_SHORT);
            return;
        }

        if (null == this.state.publicKey || '' === this.state.publicKey) {
            toast.show('请输入钱包地址', DURATION.LENGTH_SHORT);
            return;
        }

        let re = /^[0-9a-zA-Z]*$/g;
        if (!re.test(this.state.publicKey)) {
            toast.show('钱包地址格式不正确', DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.currencyType === 'TV') {
            if (this.state.remark === null || this.state.remark === '') {
                toast.show('请填写备注', DURATION.LENGTH_SHORT);
                return;
            }
        }

        if(this.state.visible){
            console.log('重复提交');
            toast.show('不能重复提交', DURATION.LENGTH_SHORT);
            return;
        }
        console.log('正常')
        this.setState({
            visible: true
        });

        //地址
        let url = config.api.currency.addWallet;
        //参数
        const actions = {
            currencyType: this.state.currencyType,
            publicKey: this.state.publicKey,
            remark: this.state.remark,
        };

        request.post(url, actions, this.props).then(responseText => {

            this.setState({
                visible: false
            });

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }


            const {msg} = responseText;
            if (responseText.success) {
                Alert.alert(
                    '提示',
                    '添加成功',
                    [{text: '确认', onPress: () => {
                            const {params} = this.props.navigation.state;
                            params.getAddress();
                            this.props.navigation.goBack();
                        }
                    }],
                    { cancelable: false }
                );
            } else {
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        })
    };

    // 渲染
    render() {
        return (
            <View style={styles.defaultView}>
                <Title titleName="添加钱包地址" canBack={true} {...this.props}/>
                <View style={styles.blockSty}>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>虚拟币类型:</Text>
                        <SelectApp
                            style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                            size='md'
                            valueStyle={{color: '#fff', padding: 0}}
                            value={this.state.currencyType}
                            getItemValue={item => item.value}
                            getItemText={item => item.text}
                            onPress={() => {
                                this.refs.publicKey.blur();
                                this.refs.remark.blur();
                            }}
                            items={this.state.currencyList}
                            placeholder='请选择币的类型'
                            pickerTitle='虚拟货币类型'
                            onSelected={item => this.setState({currencyType: item.value})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>钱包地址:</Text>
                        <TextInput
                            ref="publicKey"
                            underlineColorAndroid='transparent'
                            placeholder={'请输入钱包地址'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.publicKey}
                            style={styles.inputTextView}
                            onChangeText={text => this.setState({publicKey: text})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>备注:</Text>
                        <TextInput
                            ref="remark"
                            underlineColorAndroid='transparent'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.remark}
                            style={styles.inputTextView}
                            onChangeText={(text) => this.setState({remark: text})}
                        />
                    </View>

                </View>
                {/*添加币账户*/}
                <TouchableOpacity
                    onPress={this.addWallet}
                    activeOpacity={.8}
                    disabled={this.state.visible}
                    style={{
                        height: p(80), backgroundColor: '#D95411', borderWidth: 1, margin: p(20),
                        alignItems: 'center', justifyContent: 'center', borderRadius: p(10)
                    }}>
                    <Text style={{color: '#fff', fontSize: p(26)}}>确认添加</Text>
                </TouchableOpacity>
                <Loading visible={this.state.visible}/>
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
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(110),
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
        width: p(180),
        fontSize: p(24),
    },
    inputTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        fontSize: p(24),
        height: Platform.OS === 'android' ? p(35) : p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF',
    },
    reWithView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: p(70),
    },
    promptText: {
        color: '#B0B0B0',
        fontSize: p(22),
        padding: p(10),
    }
});