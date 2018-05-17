/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：银行卡管理 => 添加银行卡
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    Alert
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import request from '../../../utils/request';
import Title from '../../../components/title';
import Loading from '../../../components/loading';
import SelectApp from '../../../components/selectApp';


export default class AddBankCard extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            name: '',
            provinceList:[],
            cityList:[],
            bankList:[],
            province:null,
            city:null,
            cardSurName:null,
            cardName:null,
            bankName:null,
            subBank:null,
            subBankNum:null,
            account:null,
            visible:false
        };
    }
    //真实DOM渲染出来之后调用
    componentDidMount() {
        const { trueName, surname } = this.props.navigation.state.params;

        this.setState({
            cardName: trueName,
            cardSurName: surname

        });

        this.getProvince();
        this.getBankList();
    }

    getProvince = () =>{
        this.setState({
            cityList:[],
            city: null
        });
        let url = config.api.main.province;
        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log('responseText',responseText);

            const { obj } = responseText;
            let data = JSON.parse(obj);
            console.log('data',data);
            let provinceList = [];
            for(let i = 0; i < data.length; i++){
                let item = {
                    text: data[i].province,
                    value: data[i].key,
                };
                provinceList.push(item);
            }
            this.setState({
                provinceList: provinceList,
            })
        })
    };

    getCity = key =>{
        const { toast } = this.refs;
        if (null === key || '' === key) {
            toast.show('请选择省', DURATION.LENGTH_SHORT);
            return;
        }

        let url = `${config.api.main.city}${key}`;
        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log('responseText',responseText);

            const { obj } = responseText;
            let data = JSON.parse("["+obj+"]");
            let cityList = [];
            console.log('data',data);

            for(let i = 0; i < data.length; i++){
                let item = {
                    text: data[i].city,
                    value: data[i].city,
                };
                cityList.push(item);
            }
            this.setState({
                cityList: cityList,
            })
        })
    };

    getBankList = () => {
        this.setState({
            visible:true
        });
        let url = config.api.rmb.redisBank;

        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log('responseTextBank',responseText);

            const { obj } = responseText;
            let data = JSON.parse(obj.key);
            let bankList = [];

            for(let i = 0; i < data.length; i++){
                let { itemName } = data[i];
                bankList.push(itemName);
            }

            this.setState({
                bankList: bankList,
                visible: false,
            })
        })
    };

    saveBank = () =>{

        const { toast } = this.refs;
        const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if (null === this.state.bankName || '' === this.state.bankName) {
            toast.show('请选择银行', DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.province || '' === this.state.province) {
            toast.show('请选择省', DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.city || '' === this.state.city) {
            toast.show('请选择市', DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.account || '' === this.state.account) {
            toast.show('请输入银行卡号', DURATION.LENGTH_SHORT);
            return;
        }

        if(/\s/.exec(this.state.account) != null){
            toast.show('银行卡号不能包含空格', DURATION.LENGTH_SHORT);
            return;
        }

        if(isNaN(this.state.account) || this.state.account.length < 16){
            toast.show('请输入正确的银行卡号', DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.subBank || '' === this.state.subBank) {
            toast.show('请输入开户支行', DURATION.LENGTH_SHORT);
            return;
        }

        if(regEn.test(this.state.subBank) || regCn.test(this.state.subBank)) {
            toast.show("开户支行不能包含特殊字符.", DURATION.LENGTH_SHORT);
            return false;
        }

        this.setState({
            visible:true
        });

        let url = `${config.api.main.saveBank}?bankname=${this.state.bankName}&subBankNum=${this.state.subBank}&p1=${this.state.province}&c1=${this.state.city}&subBank=${this.state.subBank}&cardName=${this.state.cardName}&account=${this.state.account}&surName=${this.state.cardSurName}&trueName=${this.state.cardName}`;

        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);
            console.log('responseText',responseText);
            this.setState({
                visible:false
            });

            const { msg } = responseText;

            if(responseText.success){
                Alert.alert(
                    '提示',
                    '银行卡添加成功',
                    [{text: '确认', onPress: () => {
                            const { params } = this.props.navigation.state;
                            params.getBankCard();
                            this.props.navigation.goBack()
                        }
                    }],
                    { cancelable: false }
                );
            }else{
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
        })
    };

    // 渲染
    render() {
        const { inputSubBank, inputAccount } = this.refs;
        return (
            <View style={styles.defaultView}>
                <Title titleName="添加银行卡" canBack={true} {...this.props}/>
                <View style={styles.blockSty}>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>持卡人姓氏:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.cardSurName}
                            editable={false}
                            style={styles.inputTextView}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>持卡人名字:</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.cardName}
                            editable={false}
                            style={styles.inputTextView}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>选择银行:</Text>
                        <SelectApp
                            style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                            size='md'
                            valueStyle={{color: '#fff', padding: 0, margin: 0}}
                            value={this.state.bankName}
                            items={this.state.bankList}
                            onPress={() => {
                                inputSubBank.blur();
                                inputAccount.blur();
                            }}
                            placeholder='请选择银行'
                            placeholderTextColor={'#B0B0B0'}
                            pickerTitle='请选择银行'
                            onSelected={item => this.setState({bankName: item})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>开户省:</Text>
                        <SelectApp
                            style={{flex:1,borderColor:'transparent',backgroundColor:"transparent"}}
                            size='md'
                            valueStyle={{color:'#fff',padding:0}}
                            value={this.state.province}
                            getItemValue={item => item.value}
                            getItemText={item => item.text}
                            onPress={() => {
                                inputSubBank.blur();
                                inputAccount.blur();
                            }}
                            items={this.state.provinceList}
                            placeholder='请选择省'
                            pickerTitle='请选择省'
                            onSelected={item => {
                                this.getCity(item.value);
                                this.setState({province: item.text})
                            }}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>开户市:</Text>
                        <SelectApp
                            style={{flex:1,borderColor:'transparent',backgroundColor:"transparent"}}
                            size='md'
                            valueStyle={{color:'#fff',padding:0}}
                            value={this.state.city}
                            getItemValue={item => item.value}
                            getItemText={item => item.text}
                            onPress={()=>{
                                inputSubBank.blur();
                                inputAccount.blur();
                            }}
                            items={this.state.cityList}
                            placeholder='请选择市'
                            pickerTitle='请选择市'
                            onSelected={item => this.setState({city: item.value})}
                        />
                    </View>
                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>开户支行:</Text>
                        <TextInput
                            ref="inputSubBank"
                            underlineColorAndroid='transparent'
                            placeholder={'请输入开户支行名称'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.subBank}
                            style={styles.inputTextView}
                            onChangeText={text => this.setState({subBank:text})}
                        />
                    </View>

                    <View style={styles.reWithView}>
                        <Text style={styles.inputText}>银行卡号:</Text>
                        <TextInput
                            ref="inputAccount"
                            underlineColorAndroid='transparent'
                            placeholder={'请输入银行卡号'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#B0B0B0'}
                            value={this.state.account}
                            style={styles.inputTextView}
                            onChangeText={text => this.setState({account:text})}
                        />
                    </View>

                </View>

                <TouchableOpacity
                    onPress={this.saveBank}
                    activeOpacity={.8}
                    style={{ height:p(80),backgroundColor:'#D95411',borderWidth:1,margin:p(20),
                    alignItems: 'center',justifyContent:'center',borderRadius:p(10)}}>
                    <Text style={{color:'#fff',fontSize:p(26)}}>确认添加</Text>
                </TouchableOpacity>
                <Loading visible={this.state.visible}/>
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
    inputText:{
        color: 'white',
        paddingLeft: p(20),
        width: p(180),
        fontSize: p(24),
    },
    inputTextView:{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: p(6),
        fontSize: p(24),
        height: p(70),
        flex: 1,
        padding: 0,
        paddingLeft: p(10),
        color: '#FFF',
    },
    reWithView:{
        flexDirection: 'row',
        alignItems: 'center',
        height: p(70),
    },
    promptText:{
        color: '#B0B0B0',
        fontSize: p(22),
        padding: p(10),
    }
});