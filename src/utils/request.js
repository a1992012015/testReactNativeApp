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

import config from './config';

export default function () {
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
    this.post = async function (url, actions, props) {

        url = await this.joinActionsPost(`${config.api.host}${url}`, actions);

        console.log(url);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => {

            if (!response.ok) {
                console.log('请求失败');
                return {ok: true};
            }

            return response.json();
        }).then(response => {

            return this.manyLogin(props, response).then(msg => {

                if (!msg) {
                    console.log('没有登陆！');
                    return {ok: true};
                }

                return response;
            }).catch(error => {
                console.log(error);
                return {ok: true};
            });
        }).catch(error => {
            console.log(error);
            return {ok: true};
        })
    };
    /*获取图片的函数*/
    this.upImage = async function (url, formData, actions, props) {

        url = await this.joinActionsPost(`${config.api.host}${url}`, actions);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => {

            if (!response.ok) {
                console.log('请求失败');
                return {ok: true};
            }

            return response.json();
        }).then(response => {

            return this.manyLogin(props, response).then(msg => {

                if (!msg) {
                    console.log('没有登陆！');
                    return {ok: true};
                }

                return response;
            }).catch(error => {
                console.log(error);
                return {ok: true};
            });
        }).catch(error => {
            console.log(error);
            return {ok: true};
        })
    };
    /*判断登陆函数*/
    this.manyLogin = async function (props, responseText) {

        const {msg, success} = responseText;
        let routeName = props.navigation.state.routeName;
        let loginIndex = await store.get('loginIndex').then(loginIndex => {
            if (!loginIndex) {
                store.save('loginIndex', 1);
                return 1;
            } else {
                return loginIndex;
            }
        });

        console.log("服务器返回的数据------", responseText);
        console.log("routeName------", routeName);
        console.log('loginIndex', loginIndex);

        if (!success && (msg === "请先登录" || msg === "登录已超时" || msg === "未登录" || msg === "请登录或重新登录")) {

            if (routeName === "Login" || loginIndex > 1) {
                return;
            }

            await store.save('loginIndex', 2);

            return await store.get('member').then((member) => {
                console.log('getMember', member);
                if (member) {

                    Alert.alert('温馨提示', '登录已超时，请重新登录！', [
                        {text: '取消', onPress: () => store.save('loginIndex', 1)},
                        {
                            text: '确定', onPress: () => {

                                store.delete('member');

                                props.navigation.navigate('Login');
                            }
                        }
                    ]);
                } else {
                    if (props.index === 0) {
                        return false;
                    }

                    Alert.alert('温馨提示', '是否前往登录', [
                        {text: '取消', onPress: () => store.save('loginIndex', 1)},
                        {
                            text: '确定', onPress: () => {
                                if (routeName !== "Login") {
                                    props.navigation.navigate('Login');
                                }
                            }
                        }
                    ]);
                }
                return false;
            });
        } else if (msg === "未登录" || msg === "请先登录") {

            if (routeName === "Login" || loginIndex > 1) {
                return;
            }

            await store.save('loginIndex', 2);

            Alert.alert('温馨提示', '是否前往登录', [
                {text: '取消', onPress: () => store.save('loginIndex', 1)},
                {
                    text: '确定', onPress: () => {
                        if (routeName !== "Login") {
                            props.navigation.navigate('Login');
                        }
                    }
                }
            ]);

            return false;
        } else if (responseText.obj) {

            const {UUID} = responseText.obj;

            if (UUID) {
                console.log('==============================登陆成功，初始化弹窗变量==============================');
                await store.save('loginIndex', 1);
            }
        }

        return true;
    };

    return this;
};