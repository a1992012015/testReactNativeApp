/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：配置所有的地址
 *
 * */
'use strict';

import {Platform} from "react-native";

import upDate from '../../update';

const Android = upDate[Platform.OS];

const urlConfig = {
    api: {
        //app请求路径
        host: 'https://www.lockcoin.net/',//正式地址
        //host: 'http://192.168.1.254/',//测试地址 => 何彬
        //host: 'http://47.104.154.204/',//测试地址
        //交易大厅ioUrl
        socketIOUrl: 'wss://hq.lockcoin.net',
        //热更新下载最新app路径
        appReleaseApk: 'https://www.lockcoin.net/app/app-release.apk',
        //第一次打开app启动图
        guideImage: [
            require("../static/startPicture/guide_1_1.png"),
            require("../static/startPicture/guide_2_2.png"),
        ],
        //第二次打开app启动图
        splash: [
            require("../static/startPicture/guide_1_1.png"),
        ],
        //热更新appID
        android: {
            //"appId": 11534,//正式
            "appId": Android.appId,//测试
            //"appKey": "_LH2pJOAncZC96MxMcnIl7ivZojRy0Dw"//正式
            "appKey": Android.appKey//测试
        },
        ios: {
            "appId": 11534,
            "appKey": "_LH2pJOAncZC96MxMcnIl7ivZojRy0Dw"
        },
        versionApp: 3.0,//判断是否有杠杆资产 ps：3.1有
        isRMB: false,//是否有人民币，(人民币充值、人民币提现)
        isTabView: true,//首页tab排版
        isPhone: false//是否有手机注册
    },
};

export default urlConfig;
