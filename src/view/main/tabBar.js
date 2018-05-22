/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：底部标签按钮
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ToastAndroid,
    Dimensions,
    BackHandler,
} from 'react-native';
import {NavigationActions} from "react-navigation";
import store from 'react-native-simple-store';
import TabNavigator from 'react-native-tab-navigator';

import I18n from '../../utils/i18n';//语言控制
import p from '../../utils/tranfrom';//返回图像大小
import {InitUserInfo} from '../../store/actions/HomeAction';//状态
import Home from '../../view/home';//主页入口
import Lobby from '../../view/lobby';//交易大厅
import Assets from '../../view/assets';//个人资产
import CTwoC from '../cTowC';//c2c
import Notice from '../../view/notice';//公告页面
import MySelf from '../../view/mySelf';//个人信息页面
import Login from '../../view/login';
import {connect} from "react-redux";
//登陆页面

const {width} = Dimensions.get('window');
const TAB_ITEMS = [
    {
        title: I18n.t('Index'),
        name: 'home',
        icon: require("../../static/tabBar/home.png"),
        selectIcon: require("../../static/tabBar/home_select.png"),
        component: Home
    },
    {
        title: I18n.t('TradingHall'),
        name: 'Lobby',
        icon: require("../../static/tabBar/Lobby.png"),
        selectIcon: require("../../static/tabBar/Lobby_select.png"),
        component: Lobby
    },

    {
        title: I18n.t('spotAssets'),
        name: 'assets',
        icon: require("../../static/tabBar/Assets.png"),
        selectIcon: require("../../static/tabBar/Assets_selsect.png"),
        component: Assets
    },
    /*{
        title: 'c2c',
        name: 'cTwoC',
        icon: require("../../static/tabBar/Assets.png"),
        selectIcon: require("../../static/tabBar/Assets_selsect.png"),
        component: CTwoC
    },*/
    {
        title: I18n.t('NewsInformation'),
        name: 'notice',
        icon: require("../../static/tabBar/Notice.png"),
        selectIcon: require("../../static/tabBar/Notice_select.png"),
        component: Notice
    },
    {
        title: I18n.t('personCenter'),
        name: 'mySelf',
        icon: require("../../static/tabBar/MySelf.png"),
        selectIcon: require("../../static/tabBar/MySelf_select.png"),
        component: MySelf
    },
];

class TabBarView extends PureComponent {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        //添加导航获取焦点事件（如果有过渡，过渡完成）
        this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
            BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid)
        );

        this.state = {
            selectedTab: 'home',//显示的界面
            isLogin: false,
            tabTitle: null,
        };
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        console.log("this.props.navigation", this.props.navigation.state);
        //添加导航失去焦点事件（如果有过渡，过渡完成）
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
            BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroid)
        );
        //删除登陆缓存 => 测试用
        /*store.delete('member').then(suss => {
            console.log(suss)
        }).catch(error => {
            console.log(error)
        })*/
    }

    //组件被移出
    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    //监听安卓的返回键
    _onBackAndroid = () => {
        const {dispatch, navigation} = this.props;
        console.log(navigation.state);
        //不在主页则返回上一页
        if (navigation.state.routeName !== "TabBar") {
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
    //底部标签的点击事件
    tabPage = (name, tabTitle) => {

        let strD = new Date().getTime();
        console.log(`事件开始时间${strD}`);

        const {selectedTab} = this.state;
        //点击当前选择的标签无效
        if (selectedTab === name) {
            console.log('重复点击无效');
            let endD = new Date().getTime();
            console.log(`一共花费${(endD - strD) / 1000}`);
            return;
        }

        if (name === 'mySelf' || name === 'assets' || name === 'cTwoC') {
            store.get('member').then(member => {
                console.log(member);
                if (!member) {
                    this.props.navigation.navigate('Login', {ISForm: true});
                } else {
                    //每次跳转都会获取用户资产 => 存疑无需获取
                    /*const { dispatch } = this.props;
                    dispatch(InitUserInfo(this.props));*/

                    this.setState({
                        selectedTab: name,
                        tabTitle: tabTitle,
                    }, () => {
                        this.setState({
                            tabTitle: null
                        });

                        let endD = new Date().getTime();
                        console.log(`一共花费${(endD - strD) / 1000}`);

                    })
                }
            }).catch(error => {
                console.log(error)
            })
        } else {
            this.setState({
                selectedTab: name,
                tabTitle: tabTitle
            }, () => {
                this.setState({
                    tabTitle: null
                });

                let endD = new Date().getTime();
                console.log(`一共花费${(endD - strD) / 1000}`);

            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    sceneStyle={{paddingBottom: p(0)}}
                    hidesTabTouch={true}
                    tabBarStyle={{
                        overflow: 'hidden',
                        backgroundColor: '#1F2229',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: p(100),
                        width: width,
                        borderWidth: 0,
                        borderColor: 'transparent'
                    }}>
                    {
                        TAB_ITEMS.map((item, index) => {
                            let Component = item.component;

                            return (
                                item ?
                                    <TabNavigator.Item
                                        key={index}
                                        title={item.title}
                                        selected={this.state.selectedTab === item.name}
                                        selectedTitleStyle={styles.selectedTextStyle}
                                        titleStyle={styles.textStyle}
                                        renderIcon={() => <Image source={item.icon}
                                                                 style={styles.iconStyle}/>}
                                        renderSelectedIcon={() => <Image source={item.selectIcon}
                                                                         style={styles.iconStyle}/>}
                                        onPress={() => this.tabPage(item.name)}
                                    >
                                        <Component {...this.props}
                                                   tabPage={this.tabPage}
                                                   tabTitle={this.state.tabTitle}
                                        />
                                    </TabNavigator.Item>
                                    : null
                            )
                        })
                    }
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        width: p(30),
        height: p(30),
    },
    absolute: {
        position: "absolute",
        width: width, height: p(100),
        left: 0, bottom: p(50), right: 0,

    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderTopColor: '#f5f5f5',
        borderTopWidth: StyleSheet.hairlineWidth,

    },
    textStyle: {
        color: '#ACB3B9',
        fontSize: p(20),
        textAlign: 'center'
    },
    selectedTextStyle: {
        color: '#ffa200',
        fontSize: p(20),
        textAlign: 'center'

    }
});

export default connect((state) => {
    const {IndexLoopReducer} = state;
    return {
        IndexLoopReducer
    }
})(TabBarView);