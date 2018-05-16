/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：登陆页面
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    StatusBar,
    TextInput,
    Platform,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native' ;
import { NavigationActions, StackActions } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import store from 'react-native-simple-store';

import I18n from '../../utils/i18n';
import p from '../../utils/tranfrom';
import config from '../../utils/config';
import request from '../../utils/request';
import md5 from '../../utils/hrymd5';
import CheckModal from '../../components/checkModal';
import SModal from '../../components/sModal';
import MenuSelect, { MenuItem } from '../../components/MenuItem/index';

//返回图像大小
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    imageTitle: {
        width: p(300),
        height: p(100),
        resizeMode: Image.resizeMode.stretch,
        marginHorizontal: (width - p(340)) / 2,
        marginVertical: p(50)
    },
    login_btn_view: {
        height: p(70),
        backgroundColor: '#D95411',
        marginTop: p(30),
        borderRadius: p(5),
        justifyContent: 'center',

    },
    login_btn_text: {
        color: '#fff',
        fontSize: p(28),
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    third_login: {
        height: p(80),
        width: p(80),
        resizeMode: Image.resizeMode.stretch
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#252932',
        paddingTop: p(35),
        height: p(110),
        justifyContent: 'space-between'
    },
    inputSty: {
        marginTop: p(20),
        height: p(90),
        borderRadius: p(5),
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#313840',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor:'#565A5D'
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(30),
        fontWeight: '400',
        textAlign: 'center',
        paddingTop: p(15)

    },
    titleStyL: {
        color: '#fff',

        paddingLeft: p(20),
        fontSize: p(30),
        fontWeight: '400',
        paddingTop: p(15)

    },
    titleStyR: {
        color: '#fff',
        fontSize: p(30),
        fontWeight: '400',
        textAlign: 'center',
        paddingTop: p(15),
        paddingRight: p(20)

    }
});
const btn_model = [
    {text: I18n.t('Login'), value: 1, btnStyle: styles.login_btn_view, textStyle: styles.login_btn_text}
];

class Login extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ISForm: false,//判断是关闭还是重定向
            customStyleIndex: 0,
            name: null,//输入的用户名
            pwd: null,//输入的密码
            loginIng: false,
            userIsLogin: false,
            checkOpen:false,
            type:0,
            user:'',
            strName:[],
            region:'cn_86',
        }
    }
    //真实的DOM被渲染出来后调用
    componentDidMount() {
        //检查是否有之前登陆过的账号
        AsyncStorage.getItem('loginUserName').then((data) => {
            if(data){
                let strName=[];
                let str = data.split(',');
                let num=0;
                for(let i=str.length - 1; i >= 0; i--){
                    if(num === 5){
                        break;
                    }else{
                        num++;
                        let text={text:str[i],value:i};
                        strName.push(text);
                    }
                }
                this.setState({
                    strName:strName
                })
            }
        });

        StatusBar.setBarStyle('light-content');
        //检查是否关闭页面的标记
        const { params } = this.props.navigation.state;
        params && params.ISForm && this.setState({
            ISForm: true
        })

    }
    //关闭登陆界面
    _closeLogin = () => {
        console.log('关闭登陆界面');
        if (this.state.ISForm) {
            this.props.navigation.goBack();
        } else {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TabBar' })],
            });

            navigation.dispatch(resetAction);
        }
    };
    //ref节点
    menu = null;
    //自动显示之前登录过的账号
    showMenu = (type) => {
        console.log('自动显示之前登录过的账号');
        if(type === 1 && this.state.strName.length > 0){
            this.menu.show();
        }else if(!this.state.name && this.state.strName.length > 0){
            this.menu.show();
        }
    };
    //设置ref节点
    setMenuRef = ref => {
        console.log('设置ref节点');
        this.menu = ref;
    };
    //隐藏ref节点
    hideMenu = () => {
        console.log('隐藏ref节点');
        this.menu.hide();
    };
    //选择下拉列表里面的账号
    _selectPerson = (type, item) => {
        console.log('选择下拉列表里面的账号');
        this.setState({
            name:item.text,
        });
        this.hideMenu();
    };
    //删除输入框内的用户名
    _cleanText = ()=>{
        console.log('删除输入框内的字段');
        this.setState({
            name:''
        })
    };
    //删除输入框内的密码
    _cleanTextPwd = ()=>{
        console.log('删除输入框内的密码');
        this.setState({
            pwd:''
        })
    };
    //去登陆的函数
    _toLogin = () => {
        const { toast } = this.refs;
        console.log(DURATION);
        //判断是否输入用户名
        if (this.state.name === '' || this.state.name === null) {
            toast.show(I18n.t('emailisnull'), DURATION.LENGTH_SHORT);
            return
        }
        //判断是否输入密码
        if (this.state.pwd === '' || this.state.pwd === null) {
            toast.show(I18n.t('loginpwd_no_null'), DURATION.LENGTH_SHORT);
            return
        }

        this.setState({
            userIsLogin: true
        });

        let loginURL = `${config.api.login.login}?username=${this.state.name}&password=${md5.md5(this.state.pwd)}`;

        request.post(loginURL).then((responseText) => {

            this.setState({//清除加载转圈
                userIsLogin: false
            });

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('登陆失败', 5000);
                return;
            }

            if (responseText) {
                const { msg } = responseText;
                responseText.success ?
                    this._toMain(responseText)
                    :
                    toast.show(msg, DURATION.LENGTH_SHORT);
            }
        }).catch(error => {
            console.log('错误函数');
            console.log(error);
            toast.show('登陆失败', DURATION.LENGTH_SHORT);
        })
    };
    //登陆成功回调
    _toMain = (responseText) => {
        const { obj } = responseText;
        const { phoneState, googleState } = obj;
        if(phoneState === 1 && googleState === 1){
            this.setState({
                checkOpen: true,
                type: 2,
                user: obj
            })
        }else if(phoneState === 1 && googleState === 0){
            //手机认证
            this.setState({
                checkOpen: true,
                type: 0,
                user: obj
            })
        }else if(phoneState === 0 && googleState === 1){
            //谷歌认证
            this.setState({
                checkOpen: true,
                type: 1,
                user: obj
            })
        }else{
            this.saveUser(responseText)
        }

    };
    //登陆
    _btnView = (items) => {
        console.log('登陆');
        switch (items.value) {
            case 1:
                this._toLogin();
                break;
            case 2:
                break;
            case 3:

                break;
        }
    };
    //缓存用户名
    saveUser = responseText => {
        AsyncStorage.getItem('loginUserName').then(data => {
            if(data){
                let str = data.split(',');
                let loginName = "";
                for(let i = 0; i < str.length; i++){
                    if(str[i] === this.state.name){
                        loginName = "";
                        break;
                    }else{
                        loginName = this.state.name;
                    }
                }
                if(loginName !== ""){
                    let list = `${data},${this.state.name}`;
                    AsyncStorage.setItem('loginUserName', list)
                }
            }else{
                AsyncStorage.setItem('loginUserName', this.state.name)
            }
        });

        const { obj } = responseText;
        const { user, UUID } = obj;
        store.save('member', {
            memberInfo: user,
            isLogin: true,
            token: UUID
        });

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'TabBar' })],
        });
        const { navigation } = this.props;
        navigation.dispatch(resetAction);
    };
    //隐藏验证码弹出框
    _click=()=>{
        console.log('隐藏验证码弹出框');
        this.setState({
            checkOpen:false
        });
    };
    // 渲染
    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={{backgroundColor:'#1F2229',flex:1}}>
                {/*顶部标签组件*/}
                <View style={styles.header}>
                    <Text style={styles.titleStyL}
                          onPress={() => navigate('SignUp')}
                    >{I18n.t('signUp')}</Text>
                    <Text style={styles.headerTitle}>{I18n.t('Login')}</Text>
                    <Text style={styles.titleStyR}
                          onPress={() => this._closeLogin()}
                    >{I18n.t('close')}</Text>
                </View>
                {/*中间的主体*/}
                <View style={{marginHorizontal:p(20),flex:1,marginTop:p(40)}}>

                    <View style={styles.inputSty}>
                        <Icon name="ios-unlock" size = {25} color = {'#565A5D'} style = {{marginLeft:p(20)}}/>

                        {/*用戶名輸入框*/}
                        <TextInput
                            underlineColorAndroid='transparent'
                            //keyboardType="numeric"
                            placeholder={I18n.t('please_write_email')}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#565A5D'}
                            selectionColor={"#D95411"}
                            value = {this.state.name}
                            style={{alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: p(6),
                                fontSize: p(28),
                                height: Platform.OS === 'android' ? p(45) : p(90),
                                flex: 1,
                                padding: 0,
                                color: '#FFFFFF'}}
                            onChangeText={(text) => this.setState({name:text})}
                            onFocus={()=>this.showMenu(0)}
                        />
                        {
                            /*删除用户名的图标显示*/
                            this.state.name != null && this.state.name !== '' && Platform.OS === 'android' ?
                                <Text
                                    onPress={() => this._cleanText()}
                                    style={{marginRight:p(15)}}>
                                    <Image source={require('../../static/login/clean.png')}
                                           style={{width:p(80),height:p(85)}}
                                    />
                                </Text>
                                :
                                <Text/>
                        }

                        {
                            /*用户名右侧按钮，点击显示登陆过的用户名*/
                            Platform.OS === 'android'?
                                <Text onPress={() => this.showMenu(1)}
                                      style={{marginRight:p(15)}}
                                >
                                    <Image source={require('../../static/login/Flip.png')}
                                           style={{width:p(120),height:p(120)}}
                                    />
                                </Text>
                                :
                                <Text onPress={() => this.showMenu(1)}
                                      style={{marginRight:p(15),marginTop:p(14)}}
                                >
                                    <Image source={require('../../static/login/Flip.png')}
                                           style={{width:p(35),height:p(35)}}
                                    />
                                </Text>
                        }

                    </View>
                    {/*登陆过的用户名显示列表*/}
                    <MenuSelect
                        ref={this.setMenuRef}
                        style={{width:width-p(40),backgroundColor:'#313840'}}
                    >
                        <ScrollView>
                            {
                                this.state.strName.length && this.state.strName.map((item, index) =>

                                    <MenuItem
                                        key={index}
                                        onPress={() => this._selectPerson(1, item)}
                                    >
                                        {item.text}
                                    </MenuItem>
                                )
                            }
                        </ScrollView>
                    </MenuSelect>
                    {/*密码输入框*/}
                    <View style={styles.inputSty}>
                        <Icon name="ios-unlock" size = {25} color = {'#565A5D'} style = {{marginLeft:p(20)}}/>
                        <TextInput secureTextEntry
                                   underlineColorAndroid = 'transparent'
                                   clearButtonMode = {'while-editing'}
                                   placeholder = {I18n.t('please_write_pwd')}
                                   placeholderTextColor = {'#565A5D'}
                                   selectionColor = {"#D95411"}
                                   value = {this.state.pwd}
                                   style = {{marginLeft:p(6),
                                       fontSize:p(28),
                                       height:p(70),
                                       flex:1,
                                       lineHeight:p(90),
                                       padding:0,
                                       color:'#FFFFFF'}}
                                   onChangeText = {(text) => this.setState({pwd:text})}
                        />
                        {
                            /*刪除用戶輸入的用戶密码图标显示*/
                            this.state.pwd != null && this.state.pwd !== '' && Platform.OS === 'android' ?
                                <Text
                                    onPress={() => this._cleanTextPwd()}
                                    style={{marginRight:p(15)}}>
                                    <Image source={require('../../static/login/clean.png')}
                                           style={{width:p(80),height:p(85)}}/>
                                </Text>
                                :
                                <Text />

                        }
                    </View>
                    {/*登陆按钮*/}
                    {btn_model.map((items) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => this._btnView(items)}
                                key={items.value}
                                style={items.btnStyle}>
                                <Text style={items.textStyle}>{items.text}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    {/*忘记密码*/}
                    <Text onPress={() => navigate('ForgotPass')}
                          style={{fontSize:p(28),marginTop:p(15), color:'#D95411', textAlign: 'right'}}
                    >
                        {I18n.t('forgotpassword')}
                    </Text>
                </View>

                <CheckModal checkOpen={this.state.checkOpen}
                            {...this.props}
                            type={this.state.type}
                            user={this.state.user}
                            password={md5.md5(this.state.pwd)}
                            saveUser={this.saveUser}
                            click={this._click}
                />
                <Toast ref="toast"
                       style={{backgroundColor:'rgba(0,0,0,.6)'}}
                       position='top'
                       textStyle={{color:'white'}}
                />
                <SModal hasLoading={this.state.userIsLogin}/>
            </View>
        );
    }
}

export default Login;