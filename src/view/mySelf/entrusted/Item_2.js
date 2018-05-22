/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：扫码转币页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';

import config from '../../../utils/config';
import p from '../../../utils/tranfrom';
import Request from '../../../utils/request';
import I18n from '../../../utils/i18n';
import Loading from '../../../components/loading';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class Item_2 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            initItem: '',
            initId: '0',
            data: true,
            isLogin: false,
            member: null,
            tranDate: null,
            killData: [],
            balance: true,
            visible: true,
            offset: 0,
            total: 10
        }
    }

    //真实结构渲染出来之后
    componentDidMount() {
        this.queryKill(0)
    }

    //加载列表
    queryKill = () => {
        this.setState({
            visible: true,
            killData: [],
            offset: 0
        }, () => {
            const {toast} = this.refs;
            //地址
            let url = config.api.trades.list;
            //参数
            const actions = {
                type: 'history',
                limit: 12,
                offset: 0,
                typeone: 0,
                sortOrder: 'asc',
                querypath: 'enter',
            };

            request.post(url, actions).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                    return;
                }

                this.setState({
                    visible: false
                });
                request.manyLogin(this.props, responseText);

                const {obj} = responseText;

                let rows = obj.rows;
                let kill = [];

                if (rows.length > 0) {
                    rows.map((item, index) => {
                        kill.push({
                            key: index,
                            value: item
                        });
                    });

                    let offsets = this.state.offset;
                    offsets++;

                    this.setState({
                        balance: false,
                        killData: kill,
                        total: obj.total,
                        offset: offsets,
                    })
                } else {
                    this.setState({
                        balance: false
                    })
                }

            }).catch((error) => {
                console.log('进入失败函数 =>', error);
                toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
                this.setState({
                    visible: false
                })
            });
        });
    };

    reachedKill = () => {
        let offsetValue = this.state.offset * 12;
        if (offsetValue > this.state.total) {
            return;
        }

        const {toast} = this.refs;
        //地址
        let url = `${config.api.trades.list}history&limit=12&offset=${offsetValue}&typeone=0&sortOrder=asc&querypath=enter`;
        //参数
        const actions = {
            tyep: 'history',
            limit: 12,
            offset: offsetValue,
            typeone: 0,
            sortOrder: 'asc',
            querypath: 'enter',
        };

        request.post(url, actions).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                return;
            }

            request.manyLogin(this.props, responseText);

            this.setState({
                visible: false
            });

            const {obj} = responseText;

            if (obj) {
                let rows = obj.rows;
                let kill = [];

                if (rows.length > 0) {
                    rows.map((item, index) => {
                        kill.push({
                            key: offsetValue + index,
                            value: item
                        });
                    });

                    let arr = this.state.killData;
                    arr.push(...kill);
                    let offsets = this.state.offset;
                    offsets++;

                    this.setState({
                        balance: false,
                        killData: arr,
                        offset: offsets
                    })
                } else {
                    this.setState({
                        balance: false
                    })
                }
            }
        }).catch((error) => {
            console.log('进入失败函数 =>', error);
            toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
            this.setState({
                visible: false
            })
        });
    };

    killType = type => {
        if (type === 1) {
            return (
                <Text style={[styles.textPrice, {width: '8%', color: '#F6574D', right: -p(16)}]}>买</Text>
            )
        } else {
            return (
                <Text style={[styles.textPrice, {width: '8%', color: '#28D74E', right: -p(16)}]}>卖</Text>
            )
        }
    };

    killStatus = status => {
        if (status === 2) {
            return (
                <Text style={[styles.textRecord, {width: '20%'}]}>已完成</Text>
            )
        } else if (status === 3) {
            return (
                <Text style={[styles.textRecord, {width: '20%'}]}>部分成交已撤销</Text>
            )
        } else if (status === 4) {
            return (
                <Text style={[styles.textRecord, {width: '20%'}]}>已撤销</Text>
            )
        } else if (status === 1) {
            return (
                <Text style={[styles.textRecord, {width: '20%'}]}>部分成交</Text>
            )
        } else {
            return (
                <Text style={[styles.textRecord, {width: '20%'}]}>未成交</Text>
            )
        }
    };

    renderKillRow = ({item}) => {
        let {entrustTime, entrustPrice, type, coinCode, entrustCount, status} = item.value;


        let time = entrustTime.substring(5);

        let num = new Number(entrustPrice);

        num = parseFloat(num).toFixed(8);

        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#313840',
                padding: p(10),
            }}>
                <Text style={[styles.textRecord, {width: '20%'}]}>{time}</Text>
                {this.killType(type)}
                <Text style={[styles.textRecord, {width: '15%', right: -p(12)}]}>{coinCode}</Text>
                <Text style={[styles.textRecord, {width: '20%'}]}>{num}</Text>
                <Text style={[styles.textRecord, {flex: 1}]}>{parseFloat(entrustCount)}</Text>
                {this.killStatus(status)}
            </View>
        )
    };

    renderEmpty = () => {
        return (
            <View style={styles.viewStyle3}>
                {
                    !this.state.visible ?
                        <View style={styles.viewStyle4}>
                            <Text style={styles.textRecord}>亲,您还没有委托订单数据！</Text>
                        </View>
                        :
                        <View/>

                }
            </View>
        )
    };

    render() {
        return (
            <View style={{minHeight: height * .8, backgroundColor: '#1F2229'}}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#313840',
                    padding: p(10),
                }}>
                    <Text style={[styles.textRecord, {width: '20%'}]}>时间</Text>
                    <Text style={[styles.textRecord, {width: '10%'}]}>类型</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>种类</Text>
                    <Text style={[styles.textRecord, {width: '20%'}]}>价格</Text>
                    <Text style={[styles.textRecord, {width: '20%'}]}>数量</Text>
                    <Text style={[styles.textRecord, {flex: 1}]}>状态</Text>
                </View>
                <FlatList
                    style={{marginBottom: p(10)}}
                    horizontal={false}
                    data={this.state.killData}
                    renderItem={this.renderKillRow}
                    onEndReached={this.reachedKill}
                    onEndReachedThreshold={1}
                    ListEmptyComponent={this.renderEmpty}
                    refreshing={false}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color: 'white'}}
                />

                <Loading visible={this.state.visible}/>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    textViewTop: {
        color: '#ACB3B9',
        marginLeft: p(8)
    },
    quotView: {
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textFont: {
        color: '#FFFFFF',
    },
    textRecord: {
        color: '#ACB3B9',
        textAlign: 'center',
    },
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width,
    },
    loadingText: {
        fontSize: p(25),
        color: '#ACB3B9',
    },
    viewStyle4: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: p(200),
    },
    viewStyle3: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});