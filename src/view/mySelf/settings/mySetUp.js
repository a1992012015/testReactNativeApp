/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：个人信息设置页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import {connect} from 'react-redux';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import request from '../../../utils/request';
import I18n from '../../../utils/i18n';
import Title from '../../../components/title';
import {InitUserInfo} from '../../../store/actions/HomeAction';

const {height} = Dimensions.get('window');

/*按钮组件*/
class BottomMenu extends PureComponent {
    render() {
        const {icon, name, component, textColor, textView, onClickChange} = this.props;
        return (
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {
                    onClickChange(component, textView)
                }}
                style={styles.menuItemSty}>
                <View style={{flexDirection: "row", paddingLeft: p(20), alignItems: 'center'}}>
                    <Image
                        style={{width: p(40), height: p(40)}}
                        source={icon}
                    />
                    <Text style={{color: "#ACB3B9", paddingLeft: p(20)}}>{name}</Text>
                </View>
                <View
                    style={{flexDirection: "row", marginRight: p(20), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: textColor, paddingRight: p(10), fontSize: p(24)}}>{textView}</Text>
                    <Icon
                        name="ios-arrow-forward-outline"
                        size={20}
                        color="#ACB3B9"
                    />
                </View>
            </TouchableOpacity>
        )
    }
}

class MySetUp extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            member: '',
            ralComponent: 'realAuthentication',//RealAuthentication_2
            textRal: '未认证',
            textColor: "#ACB3B9",
            accountText: '设置',
            accountView: 'PhoneAuthen',
            loadData: false,
        };
    }

    //真实结构渲染出来之后调用
    componentDidMount() {
        const {dispatch} = this.props;

        dispatch(InitUserInfo(this.props));

        const {params} = this.props.navigation.state;

        this.setState({
            member: params.member
        });

        this.getIsReal();
    }

    //登陆和实名认证的方法
    onClickChange = (route, textView) => {

        if (route === null || route === '') {
            return;
        }

        if (route === "RealAuthentications_2" || route === "TransPassword" || route === "RealAuthentications_1") {
            this.props.navigation.navigate(route, {
                member: this.state.member,
                infoAction: this.getIsReal,
                textView: textView
            });
        } else {
            this.props.navigation.navigate(route, {member: this.state.member, infoAction: this.getIsReal});
        }
    };

    getIsReal = () => {
        let url = config.api.person.isRealUrl;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            console.log('responseText', responseText);

            const {obj} = responseText;
            const {states, phoneState} = obj.user;

            //let obj = responseText.obj.user;
            store.update('member', {
                memberInfo: obj.user
            });

            console.log('states=>', states);

            if (states === 0) {
                this.setState({
                    ralComponent: 'RealAuthentications_1',
                    textRal: '未认证',
                    textColor: "#ACB3B9"
                })
            } else if (states === 1) {
                this.setState({
                    ralComponent: 'RealAuthentications_2',
                    textRal: '审核中',
                    textColor: "#D95411"
                })
            } else if (states === 2) {
                this.setState({
                    ralComponent: 'RealAuthentications_2',
                    textRal: '已认证',
                    textColor: "#018F67"
                })
            } else if (states === 3) {
                this.setState({
                    ralComponent: 'RealAuthentications_1',
                    textRal: '已拒绝,重新认证',
                    textColor: "#D95411"
                })
            }

            if (1 === phoneState) {
                this.setState({
                    accountText: '修改',
                    accountView: "ClosePhone"
                })
            } else {
                this.setState({
                    accountText: '设置',
                    accountView: "PhoneAuthen"
                })
            }
            this.setState({
                loadData: true,
                member: obj.user
            })
        }).catch(error => {
            console.log('j进入错误函数 =>', error);
        })
    };
    //退出的方法
    signOut = () => {
        Alert.alert('温馨提醒', '确定退出吗?', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    store.delete('member');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'TabBar'})],
                    });

                    this.props.navigation.dispatch(resetAction);
                }
            }
        ]);
    };

    // 渲染
    render() {
        if (this.state.loadData) {
            const {ralComponent, textColor, textRal} = this.state;

            return (
                <View style={[styles.defaultView, {paddingBottom: p(100)}]}>
                    {/*顶部标签组件*/}
                    <Title titleName={I18n.t('anquanshezhi')} canBack={true} {...this.props}/>

                    <View style={{margin: p(20)}}>
                        {/*实名认证*/}
                        <View style={styles.blockSty}>
                            <BottomMenu
                                icon={require('../../../static/mySelf/realname.png')}
                                name={I18n.t('shimingrenzheng')}
                                onClickChange={this.onClickChange}
                                component={ralComponent}
                                textColor={textColor}
                                textView={textRal}
                            />
                        </View>
                        {/*登录密码*/}
                        <View style={styles.blockSty}>
                            <BottomMenu
                                icon={require('../../../static/mySelf/passw.png')}
                                name={I18n.t('denglumima')}
                                onClickChange={this.onClickChange}
                                component="LoginPass"
                                textColor="#ACB3B9"
                                textView="修改"
                            />
                        </View>
                        {/*退出按钮*/}
                        <TouchableOpacity
                            onPress={this.signOut}
                            activeOpacity={.8}
                            style={{
                                height: p(80),
                                backgroundColor: '#D95411',
                                borderWidth: 1,
                                margin: p(40),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: p(10)
                            }}>
                            <Text style={{color: '#fff', fontSize: p(26)}}>安全退出</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height / 2}}
                    size="large"
                />
            )
        }
    }
}

let styles = StyleSheet.create({
    menuItemSty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: p(80),
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
    },
    topItemStyEX: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(80),
        alignItems: 'center',
    },
    topItemSty: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#41484F',
        height: p(80),
        justifyContent: 'center',
    },
    itemTextMidSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),

    },
    midBlockSty: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        height: p(80),
        paddingLeft: p(20),
    },
    itemTextSty: {
        color: '#ACB3B9',
        paddingVertical: p(20),
        paddingLeft: p(40),
    },
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: p(5),
        borderColor: '#313840',
    },
    defaultView: {
        flex: 1,
        backgroundColor: '#1F2228',
    }
});

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(MySetUp);