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
    TouchableOpacity,
    Dimensions,
    FlatList,
    Alert
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';

import config from '../../../utils/config';
import p from '../../../utils/tranfrom';
import Request from '../../../utils/request';
import I18n from '../../../utils/i18n';
import Loading from '../../../components/loading';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class Item_1 extends PureComponent {
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

    //真实结构被渲染出来后调用
    componentDidMount() {

        this.entrustList(0);
    }

    entrustList = () => {
        this.setState({
            visible: true,
            killData: [],
            offset: 0
        }, () => {
            //地址
            let url = config.api.trades.list;
            //参数
            const actions = {
                type: 'current',
                limit: 10,
                offset: 0,
                typeone: 0,
                sortOrder: 'asc',
                querypath: 'enter',
            };

            const {toast} = this.refs;

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

                let kill = [];

                if (obj.rows.length > 0) {
                    obj.rows.map((item, index) => {
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

            }).catch(error => {
                console.log('进入失败函数 =>', error);
                toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
                this.setState({
                    visible: false
                })
            });
        });
    };

    reachedKill = () => {
        let offsetValue = this.state.offset * 10;
        if (offsetValue > this.state.total) {
            return;
        }

        const {toast} = this.refs;
        //地址
        let url = config.api.trades.list;
        //参数
        const actions = {
            type: 'current',
            limit: 10,
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
                visible: false,
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
                visible: false,
            })
        });

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
                    padding: p(10)
                }}>
                    <Text style={[styles.textRecord, {width: '16%'}]}>时间</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>类型</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>种类</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>价格</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>数量</Text>
                    <Text style={[styles.textRecord, {width: '15%'}]}>状态</Text>
                    <Text style={[styles.textRecord, {flex: 1}]}>操作</Text>
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
                    onRefresh={() => this.entrustList}
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

    /**
     * 刷新数据
     */
    refreshKill = () => {
        let offsetValue = this.state.offset * 10;

        let url = `${config.api.trades.list}current&limit=${offsetValue}&offset=0&typeone=${this.state.initId}&sortOrder=asc&querypath=enter`;
        const {toast} = this.refs;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                return;
            }


            request.manyLogin(this.props, responseText);

            this.setState({
                visible: false,
            });

            const {obj} = responseText;

            if (obj) {
                let rows = obj.rows;
                let kill = [];
                if (rows.length > 0) {
                    rows.map((item, index) => {
                        kill.push({
                            key: index,
                            value: item,
                        });
                    });
                    this.setState({
                        balance: false,
                        killData: kill,
                        total: obj.total,
                    })
                } else {
                    this.setState({
                        balance: false,
                        killData: []
                    })
                }
            }
        }).catch((error) => {
            console.log('进入失败函数 =>', error);
            toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
            this.setState({
                visible: false,
            })
        });
    };


    //撤销委托
    revokeKill = (item) => {
        Alert.alert('温馨提醒', '是否撤销委托', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    this.setState({
                        visible: true
                    });

                    const {type, fixPriceCoinCode, coinCode, entrustPrice, entrustNum} = item;
                    const {toast} = this.refs;

                    let url = `${config.api.trades.cancelExEntrust}?type=${type}&fixPriceCoinCode=${fixPriceCoinCode}&coinCode=${coinCode}&entrustPrice=${entrustPrice}&entrustNums=${entrustNum}`;

                    request.post(url).then(responseText => {

                        if (responseText.ok) {//判断接口是否请求成功
                            console.log('接口请求失败进入失败函数');
                            toast.show('接口请求失败', DURATION.LENGTH_SHORT);
                            return;
                        }

                        const {msg, success} = responseText;

                        request.manyLogin(this.props, responseText);
                        toast.show(msg, DURATION.LENGTH_SHORT);
                        if (success) {
                            this.refreshKill();
                        }
                    }).catch((error) => {
                        console.log('进入失败函数 =>', error);
                        toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
                        this.setState({
                            visible: false,
                        })
                    });
                }
            }
        ])

    };

    killType = type => {
        if (type === 1) {
            return (
                <Text style={[styles.textRecord, {width: '15%', color: '#F6574D'}]}>买</Text>
            )
        } else {
            return (
                <Text style={[styles.textRecord, {width: '15%', color: '#28D74E'}]}>卖</Text>
            )
        }
    };

    killStatus = status => {
        if (status === 0) {
            return (
                <Text style={[styles.textRecord, {width: '15%'}]}>未成交</Text>
            )
        } else {
            return (
                <Text style={[styles.textRecord, {width: '15%'}]}>部分成交</Text>
            )
        }
    };

    renderKillRow = ({item}) => {
        let {entrustTime, entrustPrice, entrustCount, coinCode} = item.value;
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
                <Text style={[styles.textRecord, {width: '16%'}]}>{time}</Text>
                {this.killType(item.value.type)}
                <Text style={[styles.textRecord, {width: '15%'}]}>{coinCode}</Text>
                <Text style={[styles.textRecord, {width: '15%'}]}>{num}</Text>
                <Text style={[styles.textRecord, {width: '15%'}]}>{parseFloat(entrustCount)}</Text>
                {this.killStatus(item.value.status)}
                <TouchableOpacity
                    onPress={() => this.revokeKill(item.value)}
                    style={{flex: 1}}>
                    <Text style={[styles.textRecord, {color: '#D95411'}]}>撤销</Text>
                </TouchableOpacity>
            </View>
        )
    };
}

let styles = StyleSheet.create({
    textViewTop: {
        color: '#ACB3B9',
        fontSize: p(24),
        marginLeft: p(8),
    },
    quotView: {
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textFont: {
        color: '#FFFFFF',
        fontSize: p(24),
    },
    textRecord: {
        color: '#ACB3B9',
        textAlign: 'center'
    },
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width,
    },
    loadingText: {
        fontSize: p(25),
        color: '#ACB3B9'
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