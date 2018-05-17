/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：钱包地址管理
 *
 */
'use strict';

import React, { PureComponent } from 'react';
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
import Toast, { DURATION } from 'react-native-easy-toast';

import config from '../../../utils/config';
import p from '../../../utils/tranfrom';
import request from '../../../utils/request';
import Title from '../../../components/title';

const { width, height }=Dimensions.get('window');

export default class Address extends PureComponent {
    constructor(props){
        super(props);
        this._dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            loadData:false,
            dataSource:this._dataSource.cloneWithRows([]),
            refreshing: false,
            hasMore: true,
        }
    }
    //真实的DOM渲染出来之后调用
    componentDidMount() {
        this.getAddress();
    }

    getAddress = () => {
        let url = `${config.api.currency.wallet}?offset=0&limit=10`;

        request.post(url).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                console.log(responseText);
                console.log(responseText.status);
                this.props.navigation.goBack(null);
                return;
            }

            request.manyLogin(this.props,responseText);

            const { obj } = responseText;

            this.setState({
                loadData: true,
                dataSource: this.state.dataSource.cloneWithRows(obj),
                hasMore: false
            });
        });
        const { params } = this.props.navigation.state;
        let jumType = params.jumType;
        if(jumType){
            const { params } = this.props.navigation.state;
            params.getJumCode();
        }
    };

    _renderFooter = () => {
        if (!this.state.hasMore) {
            return (
                <View style={[styles.loadingMore,{height:this.state.viewType === 0 ? p(50) : p(50)}]}>
                    <Text style={styles.loadingText}> 没有更多数据了</Text>
                </View> )
        }
    };

    render(){
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, backgroundColor: '#1F2229', paddingBottom: p(80)}}>
                    <Title titleName="钱包地址" canBack={true} {...this.props}/>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#313840',
                        padding: p(10),
                    }}>
                        <Text style={[styles.textRecord, {width: '70%'}]}>公钥号/时间</Text>
                        <Text style={[styles.textRecord, {width: '15%'}]}>币的类</Text>
                        <Text style={[styles.textRecord, {width: '15%'}]}>操作</Text>
                    </View>
                    <ListView
                        horizontal={false }
                        dataSource={this.state.dataSource}
                        renderRow={this._quotRow}
                        renderFooter={this._renderFooter}
                        onEndReachedThreshold={20}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={styles.list}
                        removeClippedSubviews={true}
                    />
                    {/*添加币账户*/}
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.props.navigation.navigate('AddAddress', {getAddress:this.getAddress});
                        }}
                        style={styles.footerAll}>
                        <Image
                            style={{width: p(50), height: p(50)}}
                            source={require('../../../static/mySelf/plus.png')}
                        />
                    </TouchableOpacity>
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'rgba(0,0,0,.6)'}}
                        position='top'
                        textStyle={{color:'white'}}
                    />
                </View>
            )
        }else{
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height / 2}}
                    size="large"
                />
            )
        }
    }

    deleteAddress = id => {
        const { toast }= this.refs;

        Alert.alert('温馨提醒', '是否删除', [
            {text: '取消', onPress: () => {}},
            {text: '确定', onPress: () => {
                    let url = `${config.api.currency.dlWallet}?id=${id}`;
                    request.post(url).then(responseText => {

                        if(responseText.ok){//判断接口是否请求成功
                            console.log('接口请求失败进入失败函数');
                            return;
                        }

                        request.manyLogin(this.props,responseText);

                        const { msg } = responseText;
                        if(responseText.success){
                            toast.show('删除成功', DURATION.LENGTH_SHORT);
                            this.getAddress();
                        }else{
                            toast.show(msg, DURATION.LENGTH_SHORT);
                        }
                    });
                }
            }
        ])
    };

    _quotRow = row =>{
        const { publicKey, remark, created, currencyType, id } = row;

        return(
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#313840',
                padding: p(10),
            }}>
                <View style={{width:'70%', alignItems:'center'}}>
                    <Text style={{color:"#D95411", textAlign: 'center', fontSize:p(22)}}>{publicKey}</Text>
                    <Text style={{color:"#D95411", fontSize: p(22)}}>{remark == null || remark === 'null' ? "" : remark}</Text>
                    <Text style={{color:"#D95411", fontSize: p(22)}}>{created}</Text>
                </View>
                <Text style={[styles.textRecord,{width:'15%'}]}>{currencyType}</Text>
                <TouchableOpacity
                    onPress={()=>{this.deleteAddress(id)}}
                    activeOpacity={.8}
                    style={{width:'15%', alignItems:'center'}}>
                    <Text style={{
                        color: '#FFF',
                        backgroundColor: '#D95411',
                        paddingHorizontal: p(14),
                        paddingVertical: p(5),
                        fontSize: p(22),
                    }}>删除</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    textViewTop:{
        color: '#ACB3B9',
        fontSize: p(24),
    },
    quotView:{
        padding: p(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#313840',
    },
    textRecord:{
        color: '#ACB3B9',
        fontSize: p(24),
        textAlign: 'center',
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