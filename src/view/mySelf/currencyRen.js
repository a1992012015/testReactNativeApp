/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：币种充值流水
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
    Dimensions
} from 'react-native';

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';
import Title from '../../components/title';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class CurrencyRen extends PureComponent {
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

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        this.getCurrencyRen()
    }

    getCurrencyRen = () => {
        let url = `${config.api.currency.cunList}?transactionType=1&offset=0&limit=10`;
        console.log('entrusURL', url);

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);
            console.log("responseText", responseText);

            const {obj} = responseText;
            let data = obj.rows;
            let listLength = obj.rows.length;

            this.setState({
                loadData: true,
                dataSource: this.state.dataSource.cloneWithRows(data),
                data: data
            });
            if (listLength < 10 || this.pageIndex * 10 >= obj.total) {
                this.setState({
                    hasMore: false,
                })
            } else {
                this.pageIndex = 2;
            }
        });
    };

    pullUP = () => {
        if (this.pageIndex > 1) {
            let url = `${config.api.currency.cunList}?transactionType=1&offset=${(this.pageIndex - 1) * 10}&limit=10`;
            console.log('ClosingURL', url);

            request.post(url).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    return;
                }

                request.manyLogin(this.props, responseText);

                const {obj} = responseText;
                let listLength = obj.rows.length;

                if (listLength > 0) {
                    let arr = this.state.data;
                    arr.push(...obj.rows);

                    this.setState({
                        loadData: true,
                        dataSource: this.state.dataSource.cloneWithRows(arr),
                        data: arr
                    });

                    if (listLength < 10 || this.pageIndex * 10 >= obj.total) {
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
                    <Text style={styles.loadingText}> 没有更多数据了</Text>
                </View>)
        }
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, backgroundColor: '#1F2229'}}>
                    <Title titleName="币种充值流水" canBack={true} {...this.props}/>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#313840',
                        padding: p(10),
                    }}>
                        <Text style={[styles.textRecord, {width: '41%'}]}>币种/时间</Text>
                        <Text style={[styles.textRecord, {width: '22%'}]}>数量</Text>
                        <Text style={[styles.textRecord, {width: '22%'}]}>手续费</Text>
                        <Text style={[styles.textRecord, {width: '15%'}]}>状态</Text>
                    </View>
                    <ListView
                        horizontal={false}
                        dataSource={this.state.dataSource}
                        renderRow={this._quotRow}
                        renderFooter={this._renderFooter}
                        onEndReachedThreshold={20}
                        onEndReached={this.pullUP}
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
                    <Text style={[styles.textRecord, {width: '15%'}]}>等待</Text>
                )
            } else if (status === 2) {
                return (
                    <Text style={[styles.textRecord, {width: '15%'}]}>成功</Text>
                )
            } else if (status === 3) {
                return (
                    <Text style={[styles.textRecord, {width: '15%'}]}>失败</Text>
                )
            }
        } else {
            return (
                <Text style={[styles.textRecord, {width: '15%'}]}>审核中</Text>
            )
        }
    };

    _quotRow = row => {
        const {coinCode, created, transactionMoney, fee, status} = row;
        return (
            <View style={{
                flexDirection: 'row', padding: p(10), borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#41484F', alignItems: 'center'
            }}>
                <View style={{width: '41%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.textRecord, {color: "#D95411"}]}>{coinCode}</Text>
                    <Text style={{color: "#D95411", textAlign: 'center'}}>{created}</Text>
                </View>
                <Text style={[styles.textRecord, {width: '22%'}]}>{transactionMoney}</Text>
                {this.feeType(fee)}
                {this.statusType(status)}
            </View>
        )
    }
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