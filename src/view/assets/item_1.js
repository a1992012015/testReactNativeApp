/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人资产页面 => 账单页面 => 充币
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class Item_1 extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this._dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            loadData: false,
            dataSource: this._dataSource.cloneWithRows([]),
            data: [],
            refreshing: false,
            hasMore: true,
        }
    }

    //接收到一个新的props之后调用
    componentWillReceiveProps(props) {
        let {coinCode} = props;

        this.setState({
            coinCode: coinCode
        }, () => {
            if (this.props.coinCode === 'CNY') {
                this.reRMBList();
            } else {
                this.getCurrencyRen()
            }
        })
    }

    //真实的DOM渲染出来后调用
    componentDidMount() {
        if (this.props.coinCode) {
            this.setState({
                coinCode: this.props.coinCode
            }, () => {
                if (this.props.coinCode === 'CNY') {
                    this.reRMBList();
                } else {
                    this.getCurrencyRen()
                }
            })
        }
    }

    reRMBList = () => {
        //地址
        let url = config.api.rmb.rmbFlowing;
        //参数
        const actions = {
            transactionType: 'chongzhi',
            status: 0,
            offset: 0,
            limit: 10,
        };

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            let data = responseText.obj.rows;
            let listLength = responseText.obj.rows.length;

            this.setState({
                loadData: true,
                dataSource: this.state.dataSource.cloneWithRows(data),
                data: data,
            });
            if (listLength < 10 || this.pageIndex * 10 >= responseText.obj.total) {
                this.setState({
                    hasMore: false
                });
            } else {
                this.pageIndex = 2;
            }
        });
    };

    rmbPullUP = () => {
        if (this.pageIndex > 1) {
            //地址
            let url = config.api.rmb.rmbFlowing;
            //参数
            const actions = {
                transactionType: 'chongzhi',
                status: 0,
                offset: (this.pageIndex - 1) * 10,
                limit: 10,
            };

            request.post(url, actions, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                let listLength = responseText.obj.rows.length;

                if (listLength > 0) {
                    let arr = this.state.data;
                    arr.push(...responseText.obj.rows);

                    this.setState({
                        loadData: true,
                        dataSource: this.state.dataSource.cloneWithRows(arr),
                        data: arr
                    });

                    if (listLength < 10 || this.pageIndex * 10 >= responseText.obj.total) {
                        /* this.setState({
                             hasMore: falses
                         });*/
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex++;
                    }

                } else {
                    this.setState({
                        hasMore: false
                    });
                    this.pageIndex = 1;
                }
            });
        }
    };

    getCurrencyRen = () => {
        //地址
        let url = config.api.currency.cunList;
        //参数
        const actions = {
            transactionType: 1,
            offset: 0,
            limit: 10,
            coinCode: this.state.coinCode,
        };
        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            let data = responseText.obj.rows;
            let listLength = responseText.obj.rows.length;

            this.setState({
                loadData: true,
                dataSource: this.state.dataSource.cloneWithRows(data),
                data: data
            });

            if (listLength < 10 || this.pageIndex * 10 >= responseText.obj.total) {
                this.setState({
                    hasMore: false
                })
            } else {
                this.pageIndex = 2;
            }
        });
    };

    pullUP = () => {
        if (this.pageIndex > 1) {
            //地址
            let url = config.api.currency.cunList;
            //参数
            const actions = {
                transactionType: 1,
                offset: (this.pageIndex - 1) * 10,
                limit: 10,
                coinCode: this.state.coinCode,
            };

            request.post(url, actions, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    return;
                }

                let listLength = responseText.obj.rows.length;

                if (listLength > 0) {
                    let arr = this.state.data;
                    arr.push(...responseText.obj.rows);

                    this.setState({
                        loadData: true,
                        dataSource: this.state.dataSource.cloneWithRows(arr),
                        data: arr
                    });
                    if (listLength < 10 || this.pageIndex * 10 >= responseText.obj.total) {
                        this.setState({
                            hasMore: false
                        });
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex++;
                    }
                } else {
                    this.setState({
                        hasMore: false
                    });
                    this.pageIndex = 1;
                }
            });
        }
    };

    _renderFooter = () => {
        if (!this.state.hasMore) {
            return (
                <View style={[styles.loadingMore, {height: this.state.viewType === 0 ? p(50) : p(50)}]}>
                    <Text style={styles.loadingText}>没有更多数据了</Text>
                </View>
            )
        }
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, backgroundColor: '#1F2229'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#313840',
                        padding: p(10),
                    }}>
                        <Text style={[styles.textRecord, {width: '34%'}]}>时间</Text>
                        <Text style={[styles.textRecord, {width: '22%'}]}>数量</Text>
                        <Text style={[styles.textRecord, {width: '22%'}]}>手续费</Text>
                        <Text style={[styles.textRecord, {width: '22%'}]}>状态</Text>
                    </View>
                    <ListView
                        horizontal={false}
                        dataSource={this.state.dataSource}
                        renderRow={this._quotRow}
                        renderFooter={this._renderFooter}
                        onEndReachedThreshold={20}
                        onEndReached={this.state.coinCode === 'CNY' ? this.rmbPullUP : this.pullUP}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.list}
                        removeClippedSubviews={true}
                    />
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

    feeType = fee => {
        if (fee !== null && fee !== "") {
            return (
                <Text style={[styles.textRecord, {width: '22%'}]}>{fee}</Text>
            )
        } else {
            return (
                <Text style={[styles.textRecord, {width: '22%'}]}>0.00</Text>
            )
        }
    };

    statusType = status => {
        if (status !== "" || status !== null) {
            if (status === 1) {
                return (
                    <Text style={[styles.textRecord, {width: '22%'}]}>等待</Text>
                )
            } else if (status === 2) {
                return (
                    <Text style={[styles.textRecord, {width: '22%'}]}>成功</Text>
                )
            } else if (status === 3) {
                return (
                    <Text style={[styles.textRecord, {width: '22%'}]}>失败</Text>
                )
            }
        } else {
            return (
                <Text style={[styles.textRecord, {width: '22%'}]}>审核中</Text>
            )
        }
    };

    _quotRow = row => {
        const {created, transactionMoney, fee, status} = row;

        return (
            <View style={{
                flexDirection: 'row',
                padding: p(10),
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#41484F',
                alignItems: 'center',
            }}>
                <View style={{width: '34%', alignItems: 'center'}}>
                    <Text style={{color: "#D95411", textAlign: 'center'}}>{created}</Text>
                </View>
                <Text style={[styles.textRecord, {width: '22%'}]}>{transactionMoney}</Text>
                {this.feeType(fee)}
                {this.statusType(status)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        fontSize: p(24),
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
        color: '#828282',
    }
});