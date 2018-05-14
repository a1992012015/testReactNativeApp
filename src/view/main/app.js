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
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types'; // ES6

import FirstStart from '../../components/startPage/firstStart'
import SecondStart from '../../components/startPage/secondStart';

const { width, height } = Dimensions.get('window');
let _navigator;

class App extends PureComponent {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', () => this._onBackAndroid())
        );

        this.state = {
            booted: false,//无法找到具体作用的参数
            firstFlag: props.StartPage.pageFlag,//判断是否是第一次启动APP
            isLogin: false,
            member: null,
            touchPwdIsOpen: false,
            touchPwd: ''
        }
    }
    //在完成首次渲染之前调用
    componentWillMount() {
        console.log(this.props.StartPage.pageFlag);
        console.log(this.props.navigation.state);

        if(Platform.OS === 'android'){

            //BackHandler.addEventListener('hardwarePress', () => _onBackAndroid(this.props));
        }
    }
    //真实的DOM被渲染出来后调用
    componentDidMount() {

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', () => this._onBackAndroid())
        );

        /**
         * 沉浸式代码
         */
        StatusBar.setBarStyle('light-content');
        Platform.OS === 'android' ? StatusBar.setBackgroundColor('rgba(66,175,240,.0)') : '';
        Platform.OS === 'android' ? StatusBar.setTranslucent(true) : '';

    }
    //监听安卓的返回键
    _onBackAndroid () {
        const { dispatch, navigation } = this.props;
        console.log(navigation.state);
        //不在主页则返回上一页
        if (navigation.state.routeName !== "App") {
            dispatch(NavigationActions.back());
            return true;
        }
        //连续返回两次则退出程序
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
            return <FirstStart {...this.props} />
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
let lastBackButtonPress;
function _onBackAndroid (props) {
    console.log(this);
    const { dispatch, navigation } = props;
    console.log(navigation.state);
    //不在主页则返回上一页
    if (navigation.state.routeName !== "App") {
        dispatch(NavigationActions.back());
        return true;
    }
    //连续返回两次则退出程序
    if (lastBackButtonPress + 2000 >= new Date().getTime()) {
        BackHandler.exitApp();
        return true;
    }
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    lastBackButtonPress = new Date().getTime();
    return true;
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
// 属性类型
FirstStart.propTypes = {
    StartPage: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
};

export default connect((state) => {
    const { StartPage } = state;
    return {
        StartPage
    }
})(App);
