/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：银行卡管理
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';

import config from '../../../utils/config';
import p from '../../../utils/tranfrom';
import request from '../../../utils/request';
import Title from '../../../components/title';

const {height} = Dimensions.get('window');

export default class BankCard extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this._dataClosing = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            trueName: null,
            surname: null,
            dataClosing: this._dataClosing.cloneWithRows([])
        }
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        const {truename, surname} = this.props.navigation.state.params.member;

        this.setState({
            trueName: truename,
            surname: surname,
        });

        this.getBankList();
    }

    getBankList = () => {
        let url = `${config.api.main.bankCard}?offset=0&limit=10`;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);
            console.log("responseText", responseText);

            const {obj} = responseText;

            this.setState({
                loadData: true,
                dataClosing: this.state.dataClosing.cloneWithRows(obj),
            });
        });
        const {params} = this.props.navigation.state;
        if (params.getBankCard) {
            params.getBankCard();
        }
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, backgroundColor: '#1F2229', paddingBottom: p(80)}}>
                    <Title titleName="银行卡管理" canBack={true} {...this.props}/>
                    <ListView
                        horizontal={false}
                        dataSource={this.state.dataClosing}
                        renderRow={this._quotRow}
                        onEndReachedThreshold={20}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.list}
                        removeClippedSubviews={true}
                    />
                    {/*添加银行卡*/}
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.props.navigation.navigate('AddBankCard', {
                                trueName: this.state.trueName,
                                getBankCard: this.getBankList,
                                surname: this.state.surname,
                            });
                        }}
                        style={styles.footerAll}>
                        <Image
                            style={{width: p(50), height: p(50)}}
                            source={require('../../../static/mySelf/plus.png')}
                        />
                    </TouchableOpacity>

                    <Toast
                        ref="toast"
                        style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                        position='top'
                        textStyle={{color: 'white'}}
                    />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height}}
                    size="large"
                />
            )
        }
    }

    deleteBank = id => {
        const {toast} = this.refs;

        Alert.alert(
            '提示',
            '确认删除银行卡',
            [{
                text: '确认',
                onPress: () => {
                    let URL = config.api.host + config.api.main.removeBank + id;
                    request.post(URL).then(responseText => {

                        if (responseText.ok) {//判断接口是否请求成功
                            console.log('接口请求失败进入失败函数');
                            return;
                        }

                        const {msg} = responseText;
                        request.manyLogin(this.props, responseText);

                        if (!responseText.success) {
                            toast.show(msg, DURATION.LENGTH_SHORT);
                        } else {
                            toast.show("删除成功", DURATION.LENGTH_SHORT);
                            this.getBankList();
                        }
                    });
                }
            },
                {
                    text: '取消', onPress: () => {
                    }
                }
            ]
        );
    };

    _quotRow = row => {
        const {cardBank, id, cardNumber, surName, cardName, trueName, bankProvince, bankAddress, subBank} = row;
        return (
            <View style={{
                backgroundColor: '#323840',
                padding: p(20),
                marginTop: p(20),
                marginHorizontal: p(20),
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#ACB3B9', fontSize: p(26)}}>{cardBank}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.deleteBank(id)
                        }}
                        activeOpacity={.8}>
                        <Image
                            style={{width: p(40), height: p(40)}}
                            source={require('../../../static/mySelf/delete.png')}/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textViewTop}>卡号：{cardNumber}</Text>
                <Text style={styles.textViewTop}>姓氏：{surName}</Text>
                <Text style={styles.textViewTop}>户名：{cardName ? cardName : trueName}</Text>
                <Text style={styles.textViewTop}>城市：{bankProvince}-{bankAddress}</Text>
                <Text style={styles.textViewTop}>支行：{subBank}</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    textViewTop: {
        color: '#ACB3B9',
    },
    quotView: {
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textRecord: {
        color: '#ACB3B9',
        textAlign: 'center'
    },
    footerAll: {
        backgroundColor: '#FF504B',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: p(80),
        borderTopColor: '#313840',
        borderTopWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: p(20),
    }
});