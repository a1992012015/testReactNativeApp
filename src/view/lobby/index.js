/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：交易大厅页面
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    DeviceEventEmitter,
    NativeModules,
    NativeEventEmitter,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client/dist/socket.io';
import store from 'react-native-simple-store';
import { connect } from 'react-redux';

import p from '../../utils/tranfrom';
import config from '../../utils/config';
import request from '../../utils/request';
import I18n from '../../utils/i18n';
import Purchase from './trading/purchase';
import SellOut from './trading/sellOut';
import CurrentEntrust from './trading/currentEntrust';
import HistoryEntrust from './trading/historyEntrust';
import BuessModal from './buessModal/buessModal';
import { tradingHall } from '../../store/actions/TradingAction';
import { InitUserInfo } from '../../store/actions/HomeAction';
import { homeLoop } from '../../store/actions/IndexLoopAction';

const { height } = Dimensions.get('window');
const { PushCandlestickChart } = NativeModules;

class Business extends PureComponent {

    static defaultProps = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        console.log('输出怀疑变量0');
        this.state = {
            areaList: [],
            headList: [],
            indexData: [],
            buyData: [],//买
            sellData: [],//卖
            isLoading: false,
            priceLast: 0.00,
            priceLow: 0.00,
            priceNew: 0.00,
            itemText: 'CNY',
            businessData: null,
            isLogin: false,
            coinCode: null,
            balance: true,
            personal: {
                available: 0.00,
                frozen: 0.00,
                buyFeeRate: 0,//买的手续费
                sellFeeRate: 0,//卖的
                canBuyCoin: 0,
                canSellMoney: 0,
            },
            isOpen: false,
            busTitle: 'MS/SS',
            user: null,
            totalAmount: null,
            priceHigh: null,//最高
            time: '1day',
            page: 0,

        };

        this.socket = io(config.api.socketIOUrl, {
            transports: ['websocket', 'polling'], // you need to explicitly tell it to use websockets
            secure: true
        });
        this.twoLoad = 1;
    }
    //真实的DOM渲染出来之后调用
    componentDidMount() {
        this.getSocket();

        if(this.props.tabTitle){
            let coinCodes = this.props.tabTitle.split("_");
            this.setState({
                coinCode: this.props.tabTitle,
                itemText: coinCodes[1],
                busTitle: coinCodes[0] + '/' + coinCodes[1],
            }, () => this.queryCoin());
        }

        store.get('member').then(member => {
            if (!member) {
                this.setState({
                    isLogin: false,
                })
            } else {
                const {dispatch} = this.props;
                dispatch(InitUserInfo(this.props));
                this.setState({
                    username: member.memberInfo.username,
                    memberInfo: member.memberInfo,
                    isLogin: true,
                })
            }
        });
    }
    //组件被销毁的时候调用
    componentWillUnmount() {

        this.socket && this.socket.close();
        this.timeName && this.timeName.remove();
    }
    //接受到一个新的props调用
    componentWillReceiveProps(props) {

        if (props.tabTitle) {
            let coinCodes = props.tabTitle.split("_");
            this.setState({
                coinCode: props.tabTitle,
                itemText: coinCodes[1],
                busTitle: coinCodes[0] + '/' + coinCodes[1]
            }, () => {
                this.queryCoin();
                this.getKline();
                this.getKlineData();
            });
        }

        const { TradingReducer, IndexLoopReducer, HomeReducer } = props;

        if (!IndexLoopReducer.homeLoading && IndexLoopReducer.homeData) {
            this.coreData(IndexLoopReducer.homeData);
        }

        if (this.state.isLogin && this.state.balance) {
            this.queryCoin();

            this.setState({
                balance: false,
                user: HomeReducer.userAssets.obj
            })
        }

        let trans = this.state.coinCode;

        if (trans && !TradingReducer.tradingLoading && TradingReducer.tradingData) {
            const { marketDetail } = TradingReducer.tradingData;

            if (marketDetail && marketDetail[trans]) {
                let coinData = marketDetail[trans][0].payload;
                const { asks, bids } = coinData;

                //let asks = coinData.asks.price;
                let amount = asks.amount;
                //let bids = coinData.bids.price;
                let bidsAM = bids.amount;
                let sell = [];
                let buy = [];

                if (asks.price) {
                    let sellLength = asks.price.length < 5 ? asks.price.length : 7;
                    for (let i = sellLength; i >= 0; i--) {
                        sell.push({
                            key: i,
                            value: {price: asks.price[i], amount: amount[i]}
                        });
                    }
                }
                if (bids.price) {
                    let buyLength = bids.price.length < 5 ? bids.price.length : 7;
                    for (let j = 0; j <= buyLength; j++) {
                        buy.push({
                            key: j,
                            value: {price: bids.price[j], amount: bidsAM[j]}
                        });
                    }
                }

                this.setState({
                    tradingData: coinData,
                    sellData: sell,
                    buyData: buy,
                    isLoading: true,
                    priceLast: coinData.priceLast,
                    priceLow: coinData.priceLow,
                    priceNew: coinData.priceNew,
                    totalAmount: this.state.businessData && parseFloat(this.splitData(this.state.businessData)),
                    priceHigh: coinData.priceHigh,//最高
                });
            }
        }
    }
    //结构赋值 => 强迫症复发
    splitData = data => {
        const { transactionSum } = data;
        return transactionSum;
    };

    queryCoin = () => {
        //地址
        let url = config.api.trades.appgetAccountInfo;
        //参数
        const actions = {
            symbol: this.state.coinCode,
        };

        request.post(url, actions).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            if (responseText.obj) {

                const account = responseText.obj;
                const { coinAccount, myAccount, coinFee } = account;
                console.log(account);

                this.setState({
                    balance: false,
                    personal: {
                        available: parseFloat(coinAccount.hotMoney),
                        frozen: parseFloat(myAccount.hotMoney),
                        buyFeeRate: parseFloat(coinFee.buyFeeRate),//买的手续费
                        sellFeeRate: parseFloat(coinFee.sellFeeRate),//卖的
                    }
                })
            } else {
                this.setState({
                    balance: false,
                })
            }
        })
    };

    coreData = homeData => {
        let areaData = {};
        let headData = [];
        let coinCodeArray = "";
        let businessData = null;

        if(homeData){
            homeData.map((item, index) => {

                if (index === 0 && this.twoLoad === 1) {
                    coinCodeArray = item.coinCode.split("_");
                    this.state.coinCode = item.coinCode;
                }

                let coinCode = item.coinCode.split("_")[1];

                if (headData.indexOf(coinCode) === -1) {
                    headData.push(coinCode);
                }

                if (areaData[`${coinCode}`]) {
                    areaData[`${coinCode}`].push({
                        key: item.coinCode,
                        value: item
                    });
                } else {
                    areaData[`${coinCode}`] = [{
                        key: item.coinCode,
                        value: item
                    }];
                }

                if (item.coinCode === this.state.coinCode) {
                    businessData = item;
                }
            });
        }

        if (this.twoLoad === 1) {
            this.state.itemText = headData[0];
            this.state.busTitle = coinCodeArray[0] + '/' + coinCodeArray[1];
            this.twoLoad++;
        }

        this.setState({
            areaList: areaData,
            headList: headData,
            indexData: areaData[this.state.itemText],
            businessData: businessData,
        });
    };

    getSocket = () => {
        const { dispatch } = this.props;

        // 告诉服务器端有用户登录
        this.socket.emit('login', {
            userid: "1",
            username: "游客登录",
            room: 'index'
        });

        // 监听新用户登录
        this.socket.on('login', function (o) {
            console.log('有用户登录 =>', o);
        });

        // 监听用户退出
        this.socket.on('logout', function (o) {
            console.log('用户退出 =>', o);
        });

        this.socket.on("index", function (data) {
            dispatch(tradingHall(data));
        });

        this.socket.connect();
    };

    setOpen = isOpen => {
        console.log("isOpen", isOpen);
        this.setState({
            isOpen: isOpen,
        })
    };

    setItemText = value => {
        let coinCodes = value.split("_");

        this.setState({
            coinCode: value,
            itemText: coinCodes[1],
            busTitle: coinCodes[0] + '/' + coinCodes[1],
        }, () => this.queryCoin())
    };

    toIOS = () => {
        //地址
        let url = config.api.main.kLine;
        //参数
        const actions = {
            symbol: this.state.coinCode,
            period: this.state.time,
        };

        request.post(url, actions).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            const { businessData, priceLow, priceNew, priceHigh, totalAmount } = this.state;
            const { RiseAndFall, currentExchangPrice, lastExchangPrice } = businessData;
            const { setkchart } = PushCandlestickChart;

            setkchart(
                responseText,
                parseFloat(RiseAndFall),
                parseFloat(currentExchangPrice),
                parseFloat(lastExchangPrice),
                parseFloat(priceNew),
                parseFloat(priceLow),
                parseFloat(priceHigh),
                parseFloat(totalAmount)
            );
        });
    };

    getKline = () => {
        let that = this;
        that.getKlineData();
    };

    componentWillMount() {
        let that = this;
        Platform.OS === 'android' ? this.timeName = DeviceEventEmitter.addListener('TimeName', function  (msg) {
            if(msg){
                that.setState({
                    time:msg
                }, () => that.getKlineData())
            }else{
                that.getKlineData();
            }
        }) : new NativeEventEmitter(PushCandlestickChart).addListener('EventReminder', reminder => {
                if(reminder.name){
                    that.setState({
                        time: reminder.name,
                    }, () => that.toIOS())
                }else{
                    that.toIOS();
                }
            }
        );
    }

    getKlineData = () => {
        //获取首页数据  进入原生页面后定时器暂停了 只能重新获取
        const { dispatch } = this.props;
        //地址
        let url = config.api.index.indexList;

        request.post(url, {}).then(responseText => {

            dispatch(homeLoop(responseText));

        });
        //获取K线数据 => 地址
        let url_K = config.api.main.kLine;
        //参数
        const actions = {
            symbol: this.state.coinCode,
            period: this.state.time,
        };

        request.post(url_K, actions).then(responseText => {

            const { reqKLine } = responseText;
            let Kline = '';
            let payload = reqKLine.payload;
            let { priceOpen } = payload;
            let period = reqKLine.payload.period;

            priceOpen.map((item,index)=>{
                Kline += item +"|";
                Kline += payload.priceHigh[index] + "|";
                Kline += payload.priceLow[index] + "|";
                Kline += payload.priceLast[index] + "|";
                Kline += parseInt(payload.amount[index]) + "|";

                let commonTime = this.formatDate(payload.time[index] * 1000);

                if(index === (priceOpen.length - 1)){
                    Kline += commonTime;
                }else{
                    Kline += commonTime + ",";
                }
            });

            if(period !== this.state.time){
                return;
            }

            const { businessData, priceLow, priceNew, priceHigh, totalAmount } = this.state;
            const { price_keepDecimalFor, RiseAndFall, currentExchangPrice, lastExchangPrice } = businessData;
            const { KCharts } = NativeModules;
            const { setkchart } = KCharts;
            let keepDecimal = price_keepDecimalFor === null ? 4 : price_keepDecimalFor;

            setkchart(
                Kline,
                parseFloat(RiseAndFall.toFixed(keepDecimal)),
                parseFloat(currentExchangPrice.toFixed(keepDecimal)),
                parseFloat(lastExchangPrice.toFixed(keepDecimal)),
                parseFloat(priceNew.toFixed(keepDecimal)),
                parseFloat(priceLow.toFixed(keepDecimal)),
                parseFloat(priceHigh.toFixed(keepDecimal)),
                parseFloat(totalAmount.toFixed(keepDecimal))
            );
        });
    };

    formatDate = now => {
        let date = new Date(now);
        let h = date.getHours() + ':';
        let m = date.getMinutes();
        return h + m;
    };

    transQuo = () => {
        this.props.navigation.navigate('TransQuotation', {
            rowDate: this.state.businessData,
            coinCode: this.state.coinCode
        })
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    {/*顶部标签组件*/}
                    <View style={styles.header}>
                        {/*查看K线图*/}
                        <TouchableOpacity
                            onPress={() => {
                                /*Platform.OS === 'android' ?
                                    (() => {
                                        const { KCharts } = NativeModules;
                                        const { kchart } = KCharts;
                                        console.log(this.state.coinCode);
                                        kchart(this.state.coinCode, page => {
                                            this.setState({
                                                page: page,
                                            })
                                        })
                                    })()
                                    :
                                    (() => {
                                        const { RNOpenOneVC } = PushCandlestickChart;
                                        RNOpenOneVC(this.state.coinCode, page => {
                                            this.setState({
                                                page: page,
                                            })
                                        });
                                    })();*/
                            }}
                        >
                            <Image
                                style={{width: p(50), height: p(50), marginHorizontal: p(20)}}
                                source={require('../../static/lobby/trend.png')}
                            />
                        </TouchableOpacity>
                        {/*中间切换币种*/}
                        <TouchableOpacity
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => this.setOpen(true)}>
                            <Text style={styles.headerTitle}>{this.state.busTitle}</Text>
                            <Image
                                style={{width: p(32), height: p(32), marginLeft: p(5)}}
                                source={this.state.isOpen ?
                                    require('../../static/cTowC/upper.png')
                                    :
                                    require('../../static/cTowC/lower.png')}
                            />
                        </TouchableOpacity>
                        {/*查看交易详情*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.transQuo()
                            }}
                        >
                            <Icon
                                name="ios-list-outline"
                                size={35}
                                color='#fff'
                                style={{paddingHorizontal: p(20)}}
                            />
                        </TouchableOpacity>
                    </View>
                    {/*顶部切换币种组件*/}
                    <BuessModal
                        isOpen={this.state.isOpen}
                        {...this.props}
                        headList={this.state.headList}
                        areaList={this.state.areaList}
                        setOpen={this.setOpen}
                        setItemText={this.setItemText}
                    />
                    {/*选项卡组件*/}
                    <ScrollableTabView
                        locked={false}
                        page={this.state.page}
                        tabBarUnderlineStyle={{backgroundColor: '#EA2000', height: 3}}
                        tabBarBackgroundColor='#FFF'
                        tabBarActiveTextColor='#EA2000'
                        tabBarInactiveTextColor='#686868'
                        tabBarTextStyle={{fontSize: p(28), fontWeight: '400', paddingTop: p(10)}}
                        onChangeTab={(obj) => {
                            this.setState({
                                numIndex: obj.i,
                                page: obj.i,
                            })
                        }}
                    >
                        {/*买入*/}
                        <Purchase
                            tabLabel={I18n.t('buy')}
                            {...this.props}
                            buyData={this.state.buyData}
                            sellData={this.state.sellData}
                            personal={this.state.personal}
                            tradingData={this.state.tradingData}
                            member={this.state.memberInfo}
                            isLogin={this.state.isLogin}
                            businessData={this.state.businessData}
                            coinCode={this.state.coinCode}
                            user={this.state.user}
                            queryCoinEntrust={this.queryCoin}
                        />
                        {/*卖出*/}
                        <SellOut
                            tabLabel={I18n.t('sell')}
                            {...this.props}
                            buyData={this.state.buyData}
                            sellData={this.state.sellData}
                            personal={this.state.personal}
                            tradingData={this.state.tradingData}
                            member={this.state.memberInfo}
                            isLogin={this.state.isLogin}
                            businessData={this.state.businessData}
                            coinCode={this.state.coinCode}
                            user={this.state.user}
                            queryCoinEntrust={this.queryCoin}
                        />
                        {/*当前委托*/}
                        <CurrentEntrust
                            tabLabel={I18n.t('orders')}
                            coinCode={this.state.coinCode}
                            numIndex={this.state.numIndex}
                            {...this.props}
                            businessData={this.state.businessData}
                            queryCoinEntrust={this.queryCoin}
                        />
                        {/*历史委托*/}
                        <HistoryEntrust
                            tabLabel={I18n.t('history')}
                            coinCode={this.state.coinCode}
                            businessData={this.state.businessData}
                            {...this.props}
                        />
                    </ScrollableTabView>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(120),
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#1F2229',
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(34),
        textAlign: 'center',
        marginLeft: p(50),
    },
    goBack: {
        borderLeftWidth: p(4),
        borderBottomWidth: p(4),
        borderColor: '#313840',
        width: p(26),
        height: p(26),
        transform: [{rotate: '45deg'}],
        marginLeft: p(30),
    },

});

export default connect((state) => {
    const { IndexLoopReducer, TradingReducer, HomeReducer } = state;
    return {
        IndexLoopReducer,
        TradingReducer,
        HomeReducer
    }
})(Business);