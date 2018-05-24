/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：全部的请求方式
 *
 */
'use strict';

import {
    Alert,
} from 'react-native';
import store from 'react-native-simple-store';
import {getLanguages} from 'react-native-i18n';
import {NavigationActions, StackActions} from "react-navigation";

import config from './config';

const request = function () {
    /*拼接post接口的参数*/
    this.joinParamsPost = async function (params) {

        let token = await store.get('member').then(member => member && member.token);
        console.log('token=>', token);

        let languages = await getLanguages().then(languages => languages);

        if (languages[0].indexOf("zh") > -1) {
            languages = 'zh_CN';
        } else if (languages[0].indexOf("en") > -1) {
            languages = 'en';
        } else {
            languages = 'en';
        }
        if (token) {
            if (params.indexOf("?") >= 0) {
                params += `&tokenId=${token}`;
            } else {
                params += `?tokenId=${token}`;

            }
        }
        if (params.indexOf("?") >= 0) {
            params += `&languages=${languages}`;
        } else {
            params += `?languages=${languages}`;
        }

        return params;
    };
    /*POST参数拼接函数*/
    this.joinActionsPost = async function (url, actions) {

        let token = await store.get('member').then(member => member && member.token);//获取token

        let languages = await getLanguages().then(languages => languages);//获取语言

        if (languages[0].indexOf("zh") > -1) {
            actions.languages = 'zh_CN';
        } else if (languages[0].indexOf("en") > -1) {
            actions.languages = 'en';
        } else {
            actions.languages = 'en';
        }

        if (token) {
            actions.tokenId = token;
        }

        for (let name in actions) {
            if (actions.hasOwnProperty(name)) {
                if (url.indexOf("?") >= 0) {

                    url += `&${name}=${actions[name]}`;

                } else {

                    url += `?${name}=${actions[name]}`;

                }
            } else {
                console.log('没有包含的属性 =>', name);
            }
        }
        return url;
    };
    /*post请求*/
    this.post = async function (url, actions) {

        if (actions) {
            console.log('进入参数拼接函数');
            url = await this.joinActionsPost(`${config.api.host}${url}`, actions);
        } else {

            url = await this.joinParamsPost(`${config.api.host}${url}`);
        }
        console.log(url);
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => response.json()).catch(error => {
            console.log(error);
            return {ok: true};
        })
    };
    /*获取图片的函数*/
    this.upImage = async function (url, formData, actions) {
        url = await this.joinActionsPost(`${config.api.host}${url}`, actions);

        console.log('图片获取地址 =>');
        console.log(url);
        console.log(actions);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => {

            if (!response.ok){
                console.log('请求失败');
                return {ok: true};
            }

            return response.json()
        }).catch(error => {
            console.log(error);
            return {ok: true};
        })
    };
    /*判断登陆函数*/
    let loginIndex = 1;
    this.manyLogin = async function (props, responseText) {

        console.log("服务器返回的数据------", responseText);

        let routeName = props.navigation.state.routeName;
        const {msg, success} = responseText;

        console.log("routeName------", routeName);

        if (!success && (msg === "请先登录" || msg === "登录已超时" || msg === "未登录" || msg === "请登录或重新登录")) {

            if (routeName === "Login" || loginIndex > 1) {
                return;
            }

            loginIndex++;

            await store.get('member').then((member) => {
                console.log('getMember', member);
                if (member) {

                    Alert.alert('温馨提示', '登录已超时，请重新登录！', [
                        {text: '取消', onPress: () => loginIndex = 1},
                        {
                            text: '确定', onPress: () => {
                                loginIndex = 1;

                                store.delete('member');

                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({routeName: 'Login'})],
                                });

                                props.navigation.dispatch(resetAction);
                            }
                        }
                    ]);
                } else {
                    if (props.index === 0) {
                        return false;
                    }

                    Alert.alert('温馨提示', '是否前往登录', [
                        {text: '取消', onPress: () => loginIndex = 1},
                        {
                            text: '确定', onPress: () => {
                                if (routeName !== "Login") {
                                    props.navigation.navigate('Login');
                                }

                                loginIndex = 1;
                            }
                        }
                    ]);
                }
                return false;
            });

            return false;
        } else if (msg === "未登录" || msg === "请先登录") {
            if (routeName === "Login" || loginIndex > 1) {
                return false;
            }

            loginIndex++;

            Alert.alert('温馨提示', '是否前往登录', [
                {text: '取消', onPress: () => loginIndex = 1},
                {
                    text: '确定', onPress: () => {
                        if (routeName !== "Login") {
                            props.navigation.navigate('Login');
                        }

                        loginIndex = 1;
                    }
                }
            ]);

            return false;
        }

        return true;
    };

    return this;
};

export default request;





