/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：导航配置
 *
 */
'use strict';

import React from 'react'
import { StackNavigator } from 'react-navigation';

import App from './view/main/app';
import TabBar from './view/main/tabBar';
import Home from './view/home';
import Lobby from './view/lobby';
import Assets from './view/assets';
import CTowC from './view/cTowC';
import Notice from './view/notice';
import MySelf from './view/mySelf';
import Login from './view/login';
import ForgotPass from './view/login/forgotPass';
import SignUp from './view/login/signUp';

const routeConfiguration = {
    /*入口*/
    App: { screen: App },
    /*底部标签*/
    TabBar: { screen: TabBar },
    /*底部TAB对应的页面*/
    Home: { screen: Home },
    Lobby: { screen: Lobby },
    Assets: { screen: Assets },
    CTowC: { screen: CTowC },
    Notice: { screen: Notice },
    MySelf: { screen: MySelf },
    /*登陆*/
    Login: { screen: Login },
    ForgotPass: { screen: ForgotPass },
    SignUp: { screen: SignUp }
};

const stackNavigatorConfiguration = {
    headerMode: 'none',
    mode: 'card',
    initialRouteName: 'App',
    navigationOptions: {
        cardStack: {
            gesturesEnabled: true
        }
    }
};

const AppNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);

export default AppNavigator