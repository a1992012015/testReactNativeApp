/**
 * Created by fandongyang on 2017/1/11.
 *
 * 功能：全部的请求方式
 *
 */
'use strict';

import {
    Alert
} from 'react-native';
import {NavigationActions} from 'react-navigation'
import store from 'react-native-simple-store';
import {getLanguages} from 'react-native-i18n';

const request = {};
/*get请求*/
request.get = async function (url) {
    console.log("请求 get==" + url);
    return fetch(url, {credentials: 'include'})
        .then((response) => response.json())
        .catch(error => {
            console.log(error)
        })
};
/*拼接post接口的参数*/
const joinParamsPost = async function (params) {
    let token = await store.get('member').then(member => member && member.token);
    let languages = await getLanguages().then(languages => languages);
    if(languages[0].indexOf("zh") > -1){
        languages = 'zh_CN';
    }else if(languages[0].indexOf("en") > -1){
        languages = 'en';
    }else{
        languages = 'en';
    }
    if (token) {
        if (params.indexOf("?") >= 0) {
            params += '&tokenId=' + token;
        } else {
            params += '?tokenId=' + token;

        }
    }
    if (params.indexOf("?") >= 0) {
        params += '&languages=' + languages;
    }else{
        params += '?languages=' + languages
    }
    return params;

};
/*post请求*/
request.post = async function (url) {
    url = await joinParamsPost(url);
    console.log(url);
    return fetch(url,{
        method: 'POST',
        headers: {
            "Accept": "application/json;charset=utf-8",
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((response) => response.json()).catch(error => error);
};

request.setPost = async function (url) {
    url = await  joinParamsPost(url);
    return fetch(url,{
        method: 'POST',
        headers: {
            "Accept": "application/json;charset=utf-8",
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then((response) => response.json()).catch(error => {
        console.log(error)
    })
};

request.upImage = async function (url, formData) {
    url = await  joinParamsPost(url);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData
    }).then((response) => response.json()).catch(error => {
        console.log(error)
    })
};
/*猜测为图片参数拼接函数，并未使用*/
/*const joinParamImage = async function (url) {
    let token = await  store.get('member').then(member => member && member.token);

    if (token) {
        url += '&tokenId=' + token;
    }

    console.log("params==" + url);
    return url;
};*/
/*登陆*/
let loginIndex = 1;
request.manyLogin = function (props, responseText) {

    console.log("服务器返回的数据------",responseText);
    let routeName = props.navigation.state.routeName;
    const {msg, success} = responseText;
    console.log("routeName------",routeName);
    if(!success && (msg === "请先登录"
        || msg === "登录已超时" || msg === "未登录"|| msg === "请登录或重新登录")){

        if(routeName === "Login" || loginIndex > 1){
            return;
        }
        loginIndex ++;
        store.get('member').then((member) => {
           if(member){

               Alert.alert('温馨提示', '登录已超时，请重新登录！',
                   [{text: '取消', onPress: () => loginIndex = 1},
                       {
                           text: '确定',
                           onPress: () =>{
                               loginIndex = 1;
                           }
                       }]);
               store.delete('member');
               const resetAction = NavigationActions.reset({
                   index: 0,
                   actions: [
                       NavigationActions.navigate({routeName: 'Login'})
                   ]
               });
               props.navigation.dispatch(resetAction);
           }else{
               if(props.index === 0){
                   return;
               }
               Alert.alert('温馨提示', '是否前往登录',
                   [{text: '取消', onPress: () => loginIndex = 1},
                       {
                           text: '确定',
                           onPress: () =>{
                               if(routeName !== "Login"){
                                   props.navigation.navigate('Login');
                               }
                               loginIndex = 1;
                           }
                       }])
           }
        });
    }else if(msg === "未登录" || msg === "请先登录"){
        if(routeName === "Login" || loginIndex > 1){
            return;
        }
        loginIndex ++;
        Alert.alert('温馨提示', '是否前往登录',
            [{text: '取消', onPress: () => loginIndex = 1},
                {
                    text: '确定',
                    onPress: () =>{
                        if(routeName !== "Login"){
                            props.navigation.navigate('Login');
                        }
                        loginIndex = 1;
                    }
                }])
    }
};

export default request;





