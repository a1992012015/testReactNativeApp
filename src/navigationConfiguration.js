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
import MyNews from './view/mySelf/myNews';
import MySetUp from './view/mySelf/mySetUp';
import RealAuthentications_1 from './view/mySelf/realAuthentication_1';
import RealAuthentications_2 from './view/mySelf/realAuthentication_2';
import LoginPass from "./view/mySelf/loginPass";
import TransPassword from "./view/mySelf/transPassword";
import IntoCurrencyList from "./view/mySelf/intoCurrencyList";
import IntoCurrency from "./view/mySelf/intoCurrency";
import TurnoutCurrencyList from "./view/mySelf/turnoutCurrencyList";
import TurnoutCurrency from './view/mySelf/turnoutCurrency';
import TurnoutCurrencyQRList from "./view/mySelf/turnoutCurrencyQRList";
import TurnoutCurrencyQR from "./view/mySelf/turnoutCurrencyQR";
import Entrusted from "./view/mySelf/entrusted/Entrusted";
import ClosingRecord from "./view/mySelf/closingRecord";
import CurrencyRen from "./view/mySelf/currencyRen";
import CurrencyWith from "./view/mySelf/currencyWith";
import Address from "./view/mySelf/Address/Address";
import AddAddress from "./view/mySelf/Address/AddAddress";
import BankCard from "./view/mySelf/bankCard/bankCard";
import AddBankCard from "./view/mySelf/bankCard/AddBankCard";

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
    /*个人中心*/
    MySelf: { screen: MySelf },
    MyNews: { screen: MyNews },
    MySetUp: { screen: MySetUp },
    RealAuthentications_1: { screen: RealAuthentications_1 },//实名制填写页面
    RealAuthentications_2: { screen: RealAuthentications_2 },//实名制反馈页面
    LoginPass: { screen: LoginPass },
    TransPassword: { screen: TransPassword },
    IntoCurrencyList: { screen: IntoCurrencyList },
    IntoCurrency: { screen: IntoCurrency },
    TurnoutCurrencyList: { screen: TurnoutCurrencyList },
    TurnoutCurrency: { screen: TurnoutCurrency },
    TurnoutCurrencyQRList: { screen: TurnoutCurrencyQRList },
    TurnoutCurrencyQR: { screen: TurnoutCurrencyQR },
    Entrusted: { screen: Entrusted },
    ClosingRecord: { screen: ClosingRecord },
    CurrencyRen: { screen: CurrencyRen },
    CurrencyWith: { screen: CurrencyWith },
    Address: { screen: Address },
    AddAddress: { screen: AddAddress },
    BankCard: { screen: BankCard },
    /*登陆*/
    Login: { screen: Login },
    ForgotPass: { screen: ForgotPass },
    SignUp: { screen: SignUp },
    AddBankCard: { screen: AddBankCard },
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