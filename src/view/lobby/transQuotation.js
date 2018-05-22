/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：交易大厅页面 => 交易详情页面
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    Platform,
    ScrollView,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../utils/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import config from '../../utils/config';
import p from '../../utils/tranfrom';

const {height} = Dimensions.get('window');

class TransQuotation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rowPanDate: '',
            isLoading: false,
            tradesData: [],
            priceLastT: null,
            priceLowT: null,
            priceNewT: null,
            totalAmount: null,
            priceOpen: null,
            priceHigh: null
        }
    }

    //真实的DOM渲染出来以后调用
    async componentDidMount() {
        const {params} = this.props.navigation.state;
        this.setState({
            rowPanDate: params.rowDate,
            coinCode: params.coinCode
        });
    }

    //接收到一个新的props之后调用
    componentWillReceiveProps(props) {
        const {TradingReducer, IndexLoopReducer} = props;
        let trans = this.state.rowPanDate;

        if (trans && !TradingReducer.tradingLoading) {
            const {marketDetail} = TradingReducer.tradingData;
            let coinData = marketDetail[trans.coinCode][0].payload;
            let homeData = IndexLoopReducer.homeData;

            this.setState({
                priceLastT: coinData.priceLast,//最后
                priceLowT: coinData.priceLow,//最低
                priceNewT: coinData.priceNew,//最新
                totalAmount: coinData.totalAmount,
                priceHigh: coinData.priceHigh//最高
            });

            homeData.map(item => {
                if (trans.coinCode === item.coinCode) {
                    this.setState({
                        rowPanDate: item
                    })
                }
            });

            let asks = coinData.trades.price;
            let amount = coinData.trades.amount;
            let time = coinData.trades.time;
            let direction = coinData.trades.direction;
            let trades = [];

            if (asks) {
                asks.map(function (item, index) {
                    trades.push({
                        key: index,
                        value: {price: item, amount: amount[index], time: time[index], direction: direction[index]}
                    });
                });

                this.setState({
                    tradesData: trades,
                    isLoading: true
                });
            } else {
                this.setState({
                    tradesData: trades,
                    isLoading: true
                });
            }
        }
    }

    rowContent(currentExchangPrice, lastExchangPrice) {

        if (currentExchangPrice < lastExchangPrice) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#28D74E'}}>{currentExchangPrice}</Text>
                    <Image style={{width: p(30), height: p(30)}}
                           source={require('../../static/home/lowarrow.png')}
                    />
                </View>
            )
        } else if (currentExchangPrice > lastExchangPrice) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#F6574D'}}>{currentExchangPrice}</Text>
                    <Image style={{width: p(30), height: p(30)}}
                           source={require('../../static/home/uparrow.png')}
                    />
                </View>
            )
        } else {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#FFFFFF'}}>
                        {currentExchangPrice}
                    </Text>
                </View>
            )
        }
    }

    render() {
        if (this.state.isLoading) {
            const {rowPanDate, priceLowT, priceHigh, totalAmount, tradesData} = this.state;
            let {RiseAndFall, picturePath, coinCode, currentExchangPrice, lastExchangPrice} = rowPanDate;
            RiseAndFall = parseFloat(RiseAndFall).toFixed(3);

            return (
                <View style={{flex: 1, backgroundColor: '#1F2229'}}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <Icon
                                name="ios-arrow-back-outline" size={25}
                                color='#fff'
                                style={{paddingHorizontal: p(20)}}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{I18n.t('transquo')}</Text>
                        <View/>
                    </View>
                    <View style={{
                        padding: p(20),
                        backgroundColor: '#313840',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{width: p(35), height: p(35)}}
                            source={{uri: config.api.host + picturePath}}
                        />
                        <Text style={styles.textViewTop}>{coinCode}</Text>
                    </View>

                    <View style={{margin: p(20)}}>
                        <View style={styles.quotView}>
                            <View style={[styles.contentView, {backgroundColor: '#1F2229'}]}>
                                {this.rowContent(currentExchangPrice, lastExchangPrice)}
                                <Text style={{
                                    fontSize: p(28),
                                    color: RiseAndFall > 0 ? '#FF0000' : RiseAndFall < 0 ? '#018F67' : '#919191'
                                }}>{RiseAndFall}%</Text>
                            </View>
                        </View>

                        <View style={{margin: p(20)}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: p(20)}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.textFont}>{I18n.t('zuiGao')}：</Text>
                                    <Text style={styles.textFont}>{priceHigh}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.textFont}>{I18n.t('zuiDi')}：</Text>
                                    <Text style={styles.textFont}>{priceLowT}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{margin: p(20)}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.textFont}>当日成交总额：</Text>
                                <Text style={styles.textFont}>{totalAmount}</Text>
                            </View>
                        </View>

                        <View style={[styles.quotView, {flexDirection: 'row', alignItems: 'center'}]}>
                            <Image style={{width: p(40), height: p(40)}}
                                   source={require('../../static/mySelf/record.png')}
                            />
                            <Text style={{
                                fontSize: p(26),
                                color: '#FFFFFF',
                                marginLeft: p(10)
                            }}>{I18n.t('transrecord')}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: '#313840',
                            padding: p(20),
                        }}>
                            <Text style={[styles.textRecord, {width: '30%'}]}>{I18n.t('time')}</Text>
                            <Text style={[styles.textRecord, {width: '40%'}]}>{I18n.t('price')}</Text>
                            <Text style={[styles.textRecord, {width: '40%'}]}>{I18n.t('number')}</Text>
                        </View>
                    </View>

                    <ScrollView style={{margin: p(20), flex: 1}}>

                        <FlatList
                            horizontal={false}
                            data={tradesData}
                            renderItem={this._quotRow}
                            onEndReachedThreshold={1}
                            initialNumToRender={10}
                            refreshing={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
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

    _quotRow = ({item}) => {
        let itemV = item.value;
        let newTime = moment(itemV.time * 1000).format("YYYY-MM-DD HH:mm:ss");
        newTime = newTime.split(" ")[1];

        return (
            <View style={{flexDirection: 'row', padding: p(10)}}>
                <Text style={[styles.textRecord, {width: '30%'}]}>{newTime}</Text>
                <Text style={[styles.textRecord, {width: '40%'}]}>{itemV.price}</Text>
                {
                    itemV.direction === 1 ?
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.textRecord, {width: '45%', color: '#F6574D'}]}>{itemV.amount}</Text>
                            <Image style={{width: p(20), height: p(20)}}
                                   source={require('../../static/home/uparrow.png')}
                            />
                        </View>
                        :
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.textRecord, {width: '45%', color: '#28D74E'}]}>{itemV.amount}</Text>
                            <Image style={{width: p(20), height: p(20)}}
                                   source={require('../../static/home/lowarrow.png')}
                            />
                        </View>
                }
            </View>
        )
    }
}

let styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(110),
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#1F2229'
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(30),
        textAlign: 'center',
        fontWeight: '400'
    },
    goBack: {
        borderLeftWidth: p(4),
        borderBottomWidth: p(4),
        borderColor: '#313840',
        width: p(26),
        height: p(26),
        transform: [{rotate: '45deg'}],
        marginLeft: p(30)
    },
    textViewTop: {
        color: '#FFF',
        marginLeft: p(8),
        fontSize: p(30),
        fontWeight: '600'
    },
    quotView: {
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textFont: {
        color: '#FFFFFF',
        fontSize: p(26)
    },
    textRecord: {
        color: '#ACB3B9',
        fontSize: p(26)
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: p(10)
    }
});

export default connect((state) => {
    const {TradingReducer, IndexLoopReducer} = state;
    return {
        TradingReducer,
        IndexLoopReducer
    }
})(TransQuotation);