/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：根页面,app运行入口
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    BackHandler,
    View,
    ToastAndroid,
    AsyncStorage,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import FirstStart from '../../components/startPage/firstStart'
import SecondStart from '../../components/startPage/secondStart';
import { NaviGoBack } from '../../components/goBack';

const { width, height } = Dimensions.get('window');
let _navigator;

class App extends PureComponent {
    constructor(props) {
        super(props);
        BackHandler.addEventListener('hardwarePress', () => this._onBackAndroid());
        this.state = {
            booted: false,//无法找到具体作用的参数
            firstFlag: false,//判断是否是第一次启动APP
            isLogin: false,
            member: null,
            touchPwdIsOpen: false,
            touchPwd: ''
        }
    }
    //在完成首次渲染之前调用
    async componentWillMount() {
        await AsyncStorage.getItem('firstFlag').then(data => {
            if (data === 'yes') {
                console.log('有启动页的flag')
            }
        })
    }
    //真实的DOM被渲染出来后调用
    componentDidMount() {
        /**
         * 沉浸式代码
         */
        StatusBar.setBarStyle('light-content');
        Platform.OS === 'android' ? StatusBar.setBackgroundColor('rgba(66,175,240,.0)') : '';
        Platform.OS === 'android' ? StatusBar.setTranslucent(true) : '';

    }

    goBack = () => {
        return NaviGoBack(_navigator);
    };
    //初次启动点击图片储存状态
    _enterSlide = () => {
        console.log('设置启动页的flag')
    };
    //监听安卓的返回键
    _onBackAndroid = () => {
        const { dispatch, navigation } = this.props;
        console.log(this.props.navigation.state.routeName);
        if (navigation.state.routeName !== "App") {//不在主页则返回上一页
            dispatch(NavigationActions.back());
            return true;
        }
        if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
            BackHandler.exitApp();
            return true;
        }
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        this.lastBackButtonPress = new Date().getTime();
        return true;
    };

    render() {
        if (!this.state.firstFlag) {
            //第一次启动app显示的图片
            console.log('app第一次启动');
            return <FirstStart enterSlide={this._enterSlide} {...this.props} />
        }else{
            //第一次之后启动app显示的图片
            console.log('app第二次启动');
            return (
                <View style={styles.bootPage}>
                    <SecondStart {...this.props} />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    navigator: {
        flex: 1
    },
    allViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bootPage: {
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center',

    }
});

export default connect((state) => {
    const { HomeReducer } = state;
    return {
        HomeReducer
    }
})(App);
