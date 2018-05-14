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
} from 'react-native' ;
import I18n from '../../utils/i18n';
import p from '../../utils/tranfrom';
import {NavigationActions} from "react-navigation";
//返回图像大小
//import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

class Login extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ISForm: false,
        }
    }
    //真实的DOM被渲染出来后调用
    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        const {params} = this.props.navigation.state;
        params && params.ISForm && this.setState({
            ISForm: true
        })

    }
    //关闭登陆界面
    _closeLogin = () => {
        if (this.state.ISForm) {
            this.props.navigation.goBack();
        } else {
            const navigateAction = NavigationActions.navigate({
                routeName: 'TabBar',

                params: { title: 'Hello' },
            });

            this.props.navigation.dispatch(navigateAction);
        }

    };
    // 渲染
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={{backgroundColor:'#1F2229',flex:1}}>
                {/*顶部标签组件*/}
                <View style={styles.header}>
                    <Text style={styles.titleStyL}
                          onPress={() => navigate('Home')}
                    >{I18n.t('register')}</Text>
                    <Text style={styles.headerTitle}>{I18n.t('Login')}</Text>
                    <Text style={styles.titleStyR}
                          onPress={() => this._closeLogin()}
                    >{I18n.t('close')}</Text>
                </View>
            </View>
        );
    }
}

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
        borderWidth:StyleSheet.hairlineWidth,
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

export default Login;