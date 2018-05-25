/**
 * Created by fandongyang on 2017/1/11.
 *
 * 功能：全部的请求接口
 *
 */
'use strict';

import appUrl from './urlConfig';

const config = {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json'
        }
    },
    api: {
        host: appUrl.api.host,//阿里云服务器地址
        socketIOUrl: appUrl.api.socketIOUrl,
        appReleaseApk: appUrl.api.appReleaseApk,
        isRMB: appUrl.api.isRMB,//是否显示人民币
        isTabView: appUrl.api.isTabView,//首页tab排版
        isPhone: appUrl.api.isPhone,//是否有手机注册
        dEnvironment: true,//开发环境   false 本地   true 正式

        index: {
            indexList: 'mobile/nouser/appmarketlist.do',//首页List数据
            banner: 'mobile/nouser/appbanner.do',//首页轮播图数据
            article: 'mobile/nouser/apparticle.do',//最新公告 => 修改
            articleContent: 'mobile/nouser/getContent.do',//最新公告详情 => 修改
            articleCat: 'mobile/nouser/appindex/'//最新咨询 => 暂无作用
        },
        main: {
            entrust: 'mobile/user/appCenter/appentrustlist?type=',// history历史委托  current当前委托
            apptradeslist: 'mobile/user/appCenter/apptradeslist.do',//交易记录
            rechargeRMBList: 'user/rmbdeposit/list.do',//交易记录 //?order=asc&mycolumn=transactionTime
            myAccount: 'mobile/user/appCenter/myAccount.do',//用户资产
            bankCard: 'mobile/user/appbankcode/findBankCard.do',//查询当前账户下的银行卡
            removeBank: 'mobile/user/appbankcode/removeBankCard.do',//删除银行卡 => 修改
            province: 'mobile/user/appbankcode/findArea.do',//查询省
            city: 'mobile/user/appbankcode/appcity/',//查询市
            saveBank: 'mobile/user/appbankcode/saveBankCard',//保存银行卡
            myMsg: 'mobile/user/appCenter/list',//我的消息-----------------add bug
            kLine: 'klinevtwo/con'//k先数据 => 修改
        },
        login: {
            login: 'mobile/nouser/applogin.do',//登录
            smsCode: 'mobile/nouser/registSmsCode.do',//短信验证码
            reg: 'mobile/nouser/appreg.do',//注册
            regMobile: 'mobile/nouser/appRegMobile.do',//手机注册
            graCode: 'mobile/nouser/regCode.do',//图形验证码
            fotCode: 'mobile/nouser/forgetSmsCode',//找回密码发送验证码
            //stepOne:'mobile/nouser/firststep',//找回密码第一步
            stepOne: '/mobile/nouser/forgetSmsCode',//找回密码第一步
            stepTow: 'mobile/nouser/secondstep',//找回密码第二步
            regreg: 'mobile/nouser/regreg',//注册协议
            googleAuth: 'mobile/user/apppersondetail/googleAuth',//google二次认证
            phoneAuth: '/mobile/user/apppersondetail/PhoneAuth',//手机二次认证
            getPhoneCode: '/mobile/user/apppersondetail/getPhone',//手机认证短信
            resetPwdByPhone: "/mobile/nouser/resetPwdByPhone",//手机重置密码

        },
        rmb: {
            redisBank: 'mobile/user/apprmbdeposit/selectRedisBank.do',//人民币充值银行查询
            rmbPosit: 'mobile/user/apprmbdeposit/rmbdeposit.do',//生成充值汇款单
            selectBank: 'mobile/user/apprmbwithdraw/selectAll.do',//获取可用余额、银行卡
            withdrawCode: 'mobile/user/apprmbwithdraw/getRmbWithdrawCode.do',//提现短信验证码
            withdrawRMB: 'mobile/user/apprmbwithdraw/rmbwithdraw.do',//提现
            rmbFlowing: 'mobile/user/appmoneydetail/rmbSelect.do',//人民币流水查询
            fee: 'mobile/user/apprmbwithdraw/witfee.do',//人民币流水查询
            rmbFee: 'mobile/user/apprmbwithdraw/witfee.do',//提现手续费费率
        },
        person: {
            realName: 'mobile/user/apppersondetail/getrealname.do',//已实名后所需要的信息
            transCode: 'mobile/user/apppersondetail/appjypwdcode.do',//发送重置交易密码验证码
            transPass: 'mobile/user/apppersondetail/appjypwd.do',//重置交易密码提交
            passCode: 'mobile/user/apppersondetail/appdlpwdcode.do',//发送修改登录密码验证码
            loginPass: 'mobile/user/apppersondetail/appdlpwd.do',//修改登录密码提交
            isRealUrl: 'mobile/user/apppersondetail/isrealandpwd.do',//是否实名和密码设置
            setRealName: 'mobile/user/apppersondetail/apprealname',//实名认证 提交
            recommend: 'mobile/user/apppersondetail/getRecommend',//推荐佣金
            getCommendfind: 'mobile/user/apppersondetail/getCommendfind',//推荐佣金
            sendMsg: 'mobile/user/apppersondetail/sendMsg',//手机认证验证码
            setPhone: 'mobile/user/apppersondetail/setPhone',//手机认证保存
            offPhone: 'mobile/user/apppersondetail/offPhone',//关闭手机认证

        },
        currency: {
            cunList: 'mobile/user/appmoneydetail/list.do',//币的流水查询
            wallet: 'mobile/user/appbtc/selectwallet.do',//查询钱包地址
            dlWallet: 'mobile/user/appbtc/delete.do',//删除币账户
            addAccount: 'mobile/user/appbtc/addBiAccount.do',//跳转到币账户页面要显示的一些数据
            addWallet: 'mobile/user/appbtc/appsave.do',//新增币账户
            account: 'mobile/user/appbtc/selectByIdAccount.do',//我要充币页面要显示的一些数据
            coinCode: 'mobile/user/appbtc/getWithdrawCoinCode.do',//提币短信发送
            jumpCoin: 'mobile/user/appbtc/jumpCoin.do',//提币页面信息
            turnoutCoin: 'mobile/user/appbtc/addCoin.do',//提币
            getbtc: 'mobile/user/appbtc/getbtc.do',//提币------------------add bug
            findCurry: '/mobile/user/appbtc/findcurrcy',//提币费率
            createPublicKey: 'mobile/user/appbtc/createPublicKey',//生成币地址
            getPublicKey: 'mobile/user/appbtc/getPublicKey',//获取币地址
        },
        trades: {
            trans: 'mobile/nouser/trades/appadd.do',//type 1 ：买 2 ：卖 => 修改
            weituo: 'mobile/nouser/trades/weituoquery.do?type=current&coinCode=',//查询委托
            query: 'mobile/nouser/trades/queryCoin.do',//查询币的数量
            exEntrust: 'mobile/nouser/trades/appcancelExEntrust',//撤销委托
            accountInfo: 'mobile/nouser/trades/appgetAccountInfo',//获取个人账户资金
            appgetAccountInfo: 'mobile/nouser/appgetAccountInfo',//获取个人账户资金
            list: 'mobile/nouser/trades/list.do',//委托记录 => 修改
            cancelExEntrust: 'mobile/nouser/trades/cancelExEntrust.do',//取消单个委托记录
            cancelAllExEntrust: 'mobile/nouser/trades/cancelAllExEntrust.do',//取消全部委托记录
        },
        assets: {
            appLendTimesApply: 'mobile/user/applend/appLendTimesApply',//倍数申请界面数据
            appLendTimesApplyAdd: 'mobile/user/applend/appLendTimesApplyAdd',//倍数申请
            appLendTimesApplyList: 'mobile/user/applend/appLendTimesApplyList',//倍数申请记录
            appLendcoinMoney: 'mobile/user/applend/appLendcoinMoney',//融币页面数据
            appCoinlist: 'mobile/user/applend/appCoinlist',//融币页面数据切换
            appLendcoinMoneyList: 'mobile/user/applend/appLendcoinMoneyList',//融币记录
            appAddCoin: 'mobile/user/applend/appAddCoin',//申请融币
            appGetRepaymentInfo: 'mobile/user/applend/appGetRepaymentInfo',//还款页面
            appRepayment: 'mobile/user/applend/appRepayment',//还款申请
            appFildIntentlist: 'mobile/user/applend/appFildIntentlist',//还款明细
        },
        ctc: {
            appCreateTransaction: 'mobile/user/appC2c/c2c/AppCreateTransaction',//C2C买入，卖出
            c2c: 'mobile/user/appC2c/c2c',//C2C页面数据
            payc2cTransaction: 'mobile/user/appC2c/c2c/payc2cTransaction',//支付完成
            closec2cTransaction: 'mobile/user/appC2c/c2c/closec2cTransaction',//交易关闭
            failc2cTransaction: 'mobile/user/appC2c/user/failc2cTransaction',//交易失败
            getc2cTransaction: 'mobile/user/appC2c/c2c/getc2cTransaction',//查询支付详情
            confirm: 'mobile/user/appC2c/c2c/confirm',//确认到账
        }
    }
};

export default config;