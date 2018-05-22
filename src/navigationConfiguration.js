/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：导航配置
 *
 */
'use strict';

import React from 'react'
import {StackNavigator} from 'react-navigation';

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
import MySetUp from './view/mySelf/settings/mySetUp';
import RealAuthentications_1 from './view/mySelf/settings/realAuthentication_1';
import RealAuthentications_2 from './view/mySelf/settings/realAuthentication_2';
import LoginPass from "./view/mySelf/settings/loginPass";
import TransPassword from "./view/mySelf/settings/transPassword";
import IntoCurrencyList from "./view/mySelf/intoCurrencyList";
import IntoCurrency from "./view/mySelf/intoCurrency";
import TurnoutCurrencyList from "./view/mySelf/turnoutCurrencyList";
import TurnoutCurrency from './view/mySelf/turnoutCurrency';
import TurnoutCurrencyQRList from "./view/mySelf/currencyQR/turnoutCurrencyQRList";
import TurnoutCurrencyQR from "./view/mySelf/currencyQR/turnoutCurrencyQR";
import Entrusted from "./view/mySelf/entrusted/Entrusted";
import ClosingRecord from "./view/mySelf/closingRecord";
import CurrencyRen from "./view/mySelf/currencyRen";
import CurrencyWith from "./view/mySelf/currencyWith";
import Address from "./view/mySelf/Address/Address";
import AddAddress from "./view/mySelf/Address/AddAddress";
import BankCard from "./view/mySelf/bankCard/bankCard";
import AddBankCard from "./view/mySelf/bankCard/AddBankCard";
import Recommend from "./view/mySelf/recommend";
import ConsDetail from "./view/notice/consDetail";
import CodeBillFlow from "./view/assets/codeBillFlow";
import TransQuotation from "./view/lobby/transQuotation";
//import CameraScanCode from "./view/mySelf/currencyQR/cameraScanCode";

const routeConfiguration = {
    /*入口*/
    App: {screen: App},
    /*底部标签*/
    TabBar: {screen: TabBar},
    /*首页*/
    Home: {screen: Home},
    /*交易大厅*/
    Lobby: {screen: Lobby},
    TransQuotation: {screen: TransQuotation},//交易详情页面
    /*个人资产*/
    Assets: {screen: Assets},
    CodeBillFlow: {screen: CodeBillFlow},//账单页面
    /*CTowC*/
    CTowC: {screen: CTowC},
    /*新闻页面*/
    Notice: {screen: Notice},
    ConsDetail: {screen: ConsDetail},//公告详细信息
    /*个人中心*/
    MySelf: {screen: MySelf},
    MyNews: {screen: MyNews},//个人消息
    MySetUp: {screen: MySetUp},//个人设置
    RealAuthentications_1: {screen: RealAuthentications_1},//实名制填写页面
    RealAuthentications_2: {screen: RealAuthentications_2},//实名制反馈页面
    LoginPass: {screen: LoginPass},
    TransPassword: {screen: TransPassword},
    IntoCurrencyList: {screen: IntoCurrencyList},
    IntoCurrency: {screen: IntoCurrency},
    TurnoutCurrencyList: {screen: TurnoutCurrencyList},
    TurnoutCurrency: {screen: TurnoutCurrency},
    TurnoutCurrencyQRList: {screen: TurnoutCurrencyQRList},
    TurnoutCurrencyQR: {screen: TurnoutCurrencyQR},
    //CameraScanCode: {screen: CameraScanCode},
    Entrusted: {screen: Entrusted},
    ClosingRecord: {screen: ClosingRecord},
    CurrencyRen: {screen: CurrencyRen},
    CurrencyWith: {screen: CurrencyWith},
    Address: {screen: Address},
    AddAddress: {screen: AddAddress},
    BankCard: {screen: BankCard},
    AddBankCard: {screen: AddBankCard},
    Recommend: {screen: Recommend},
    /*登陆*/
    Login: {screen: Login},
    ForgotPass: {screen: ForgotPass},
    SignUp: {screen: SignUp},
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