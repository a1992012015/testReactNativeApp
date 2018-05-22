/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：根页面,app运行入口
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'; // ES6

import FirstStart from '../../components/startPage/firstStart';
import SecondStart from '../../components/startPage/secondStart';

const {width, height} = Dimensions.get('window');

class App extends PureComponent {
    constructor(props) {
        super(props);

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

    render() {
        if (!this.state.firstFlag) {
            //第一次启动app显示的图片
            console.log('app第一次启动');
            return <FirstStart {...this.props} />
        } else {
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
// 属性类型
FirstStart.propTypes = {
    StartPage: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
};

export default connect((state) => {
    const {StartPage} = state;
    return {
        StartPage
    }
})(App);
