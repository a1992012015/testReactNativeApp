/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：交易大厅页面 => 当前委托组件
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import RadioModal from 'react-native-radio-master';
import Toast, { DURATION } from 'react-native-easy-toast';

import p from '../../../utils/tranfrom';
import config from '../../../utils/config';
import request from '../../../utils/request';
import I18n from '../../../utils/i18n';
import Loading from '../../../components/loading';
import { InitUserInfo } from '../../../store/actions/HomeAction';

const { width } = Dimensions.get('window');

class CurrentEntrust extends PureComponent  {

    static defaultProps = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            initItem:'',
            initId:'0',
            data:true,
            isLogin:false,
            member:null,
            tranDate:null,
            killData:[],
            balance:true,
            visible:true,
            KeepDecimalForCoin:4,
            coinCode:null,
            coinCodes:null,
            offset:0,
            total:10
        };
    }
    //接收到一个新的props之后调用
    componentWillReceiveProps(nextProps) {
        let { coinCode, businessData } = nextProps;
        const { price_keepDecimalFor } = businessData;

        if(coinCode !== this.state.coinCode){
            let coinCodes = coinCode.split("_");
            this.setState({
                coinCode: coinCode ? coinCode : null,
                coinCodes: coinCodes[0] + "-" + coinCodes[1],
            }, () => this.queryKill(0));
        }
        this.setState({
            KeepDecimalForCoin: price_keepDecimalFor == null ? 4 : price_keepDecimalFor,
        })
    }
    //加载列表
    queryKill = () => {

        this.setState({
            visible: true,
            killData:[],
            offset:0,
        }, () => {
            //地址
            let url = config.api.trades.list;
            //参数
            const actiosn = {
                type: 'current',
                limit: 10,
                offset: 0,
                typeone: this.state.initId,
                sortOrder: 'asc',
                querypath: 'enter',
            };
            const { toast } = this.refs;

            request.post(url, actiosn).then(responseText => {

                if(responseText.ok){//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    return;
                }

                request.manyLogin(this.props,responseText);

                this.setState({
                    visible: false,
                });

                if(responseText.obj){
                    let rows = responseText.obj.rows;
                    let kill = [];
                    if(rows.length > 0){
                        rows.map((item,index)=>{
                            if(item.coinCode === this.state.coinCodes){
                                kill.push({
                                    key: index,
                                    value: item,
                                });
                            }
                        });

                        let offsets = this.state.offset;
                        offsets++;

                        this.setState({
                            balance:false,
                            killData:kill,
                            total:responseText.obj.total,
                            offset:offsets
                        });

                    }else{
                        this.setState({
                            balance:false
                        })
                    }
                }
            }).catch((error) => {
                toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
                console.log(error);
                this.setState({
                    visible: false
                })
            });
        });
    };

    reachedKill = () => {
        let offsetValue = this.state.offset * 10;

        if(offsetValue > this.state.total){
            return;
        }
        //地址
        let url = config.api.trades.list+"current&limit=10&offset="+offsetValue+"&typeone="+this.state.initId+"&sortOrder=asc&querypath=enter";
        //参数
        const actions ={
            type: 'current',
            limit: 10,
            offset: offsetValue,
            typeone: this.state.initId,
            sortOrder: 'asc',
            querypath: 'enter',
        };
        const { toast } = this.refs;

        request.post(url, actions).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);

            this.setState({
                visible:false
            });

            if(responseText.obj){
                let rows = responseText.obj.rows;
                let kill = [];

                if(rows.length > 0){
                    rows.map((item,index)=>{
                        if(item.coinCode === this.state.coinCodes){
                            kill.push({
                                key: offsetValue + index,
                                value: item
                            });
                        }
                    });

                    let arr = this.state.killData;
                    arr.push(...kill);
                    let offsets = this.state.offset;
                    offsets++;

                    this.setState({
                        balance:false,
                        killData:arr,
                        offset:offsets
                    })
                }else{
                    this.setState({
                        balance:false
                    })
                }
            }
        }).catch(error => {
            toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
            console.log(error);
            this.setState({
                visible: false
            })
        });
    };

    _radioModal = (id, item) => {
        this.queryKill(id);
        this.setState({initId: id, initItem: item})
    };

    killType = type => {
        if(type === 1){
            return(
                <Text style={[styles.textPrice, {width: '10%', color: '#F6574D'}]}>买</Text>
            )
        }else{
            return(
                <Text style={[styles.textPrice, {width: '10%', color: '#28D74E'}]}>卖</Text>
            )
        }
    };

    killStatus = status => {
        if(status === 0){
            return(
                <Text style={[styles.textPrice, {width: '15%'}]}>未成交</Text>
            )
        }else{
            return(
                <Text style={[styles.textPrice, {width: '15%'}]}>部分成交</Text>
            )
        }
    };
    //倒计时
    _setInterval = () => {
        this.refreshKill();
    };

    /**
     * 刷新数据
     */
    refreshKill = () => {
        let offsetValue = this.state.offset * 10;
        //地址
        let url = config.api.trades.list;
        //参数
        const actions = {
            type: 'current',
            limit: offsetValue,
            offset: 0,
            typeone: this.state.initId,
            sortOrder: 'asc',
            querypath: 'enter',
        };
        const { toast } = this.refs;

        request.post(url, actions).then(responseText => {

            if(responseText.ok){//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props,responseText);

            this.setState({
                visible:false
            });

            if(responseText.obj){
                let rows = responseText.obj.rows;
                let kill = [];

                if(rows.length > 0){
                    rows.map((item,index)=>{
                        if(item.coinCode === this.state.coinCodes){
                            kill.push({
                                key: index,
                                value: item
                            });
                        }
                    });

                    this.setState({
                        balance:false,
                        killData:kill,
                        total:responseText.obj.total,
                    })

                }else{
                    this.setState({
                        balance:false,
                        killData:[]
                    })
                }
            }
        }).catch((error) => {
            toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
            console.log(error);
            this.setState({
                visible: false
            })
        });
    };
    //撤销委托0.2
    revokeKill = item => {
        Alert.alert('温馨提醒', '是否撤销委托', [
            {text: '取消', onPress: () => {}},
            {text: '确定', onPress: () => {
                    this.setState({
                        visible:true
                    });
                    //地址
                    let url = config.api.trades.cancelExEntrust;
                    const { type, fixPriceCoinCode, coinCode, entrustPrice, entrustNum } = item;

                    //参数
                    const actions = {
                        type: type,
                        fixPriceCoinCode: fixPriceCoinCode,
                        coinCode: coinCode,
                        entrustPrice: entrustPrice,
                        entrustNums: +entrustNum,
                    };
                    const { toast } = this.refs;

                    request.post(url, actions).then(responseText => {

                        if(responseText.ok){//判断接口是否请求成功
                            console.log('接口请求失败进入失败函数');
                            return;
                        }

                        request.manyLogin(this.props,responseText);

                        this.setState({
                            visible:false
                        });
                        const { queryCoinEntrust } = this.props;
                        const { msg } = responseText;

                        toast.show(msg, DURATION.LENGTH_SHORT);

                        if(responseText.success){
                            const {dispatch} = this.props;
                            dispatch(InitUserInfo(this.props));
                            this._setInterval();
                            queryCoinEntrust();
                        }
                    }).catch(error => {
                        toast.show(I18n.t("exception"), DURATION.LENGTH_SHORT);
                        console.log(error);
                        this.setState({
                            visible: false
                        })
                    });
                }
            }
        ])
    };
    //撤销全部委托
    cancelAllExEntrust = () => {
        const { toast } = this.refs;

        if(this.state.killData.length < 1){
            toast.show("当前没有委托", DURATION.LENGTH_SHORT);
            return;
        }

        Alert.alert('温馨提醒', '是否撤销全部委托', [
            {text: '取消', onPress: () => {}},
            {text: '确定', onPress: () => {
                    this.setState({
                        visible:true
                    });
                    //地址
                    let url = config.api.trades.cancelAllExEntrust;

                    request.post(url, {}).then(responseText => {

                        if(responseText.ok){//判断接口是否请求成功
                            console.log('接口请求失败进入失败函数');
                            return;
                        }

                        request.manyLogin(this.props,responseText);
                        const { success, msg } = responseText;

                        toast.show(msg, DURATION.LENGTH_SHORT);
                        const { queryCoinEntrust } = this.props;

                        if(success){
                            this._setInterval();
                            queryCoinEntrust();
                        }

                    }).catch((error) => {
                        toast.show(I18n.t("exceptionLogin"), DURATION.LENGTH_SHORT);
                        console.log(error);
                        this.setState({
                            visible: false
                        })
                    });
                }
            }
        ])

    };

    renderKillRow = ({item}) => {
        let time = item.value.entrustTime.substring(5);
        let num = new Number(item.value.entrustPrice);
        num = parseFloat(num).toFixed(this.state.KeepDecimalForCoin);

        return(
            <View style={styles.killView}>
                <Text style={[styles.textPrice, {width: '20%'}]}>{time}</Text>
                {this.killType(item.value.type)}
                <Text style={[styles.textPrice, {width: '20%'}]}>{num}</Text>
                <Text style={[styles.textPrice, {width: '20%'}]}>{item.value.entrustCount}</Text>
                {this.killStatus(item.value.status)}
                <TouchableOpacity
                    onPress={()=>this.revokeKill(item.value)}
                    style={{width: '18%'}}
                >
                    <Text style={[styles.textPrice, {color:'#D95411'}]}>撤销</Text>
                </TouchableOpacity>
            </View>
        )
    };

    renderEmpty = () => {
        return(
            <View style={styles.viewStyle3}>
                {
                    !this.state.visible ?
                        <View style={styles.viewStyle4}>
                            <Text style={styles.textPrice}>亲,您还没有委托订单数据！</Text>
                        </View>
                        :
                        <View/>
                }
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewStyle0}>
                    <View style={styles.viewStyle1}>
                        <RadioModal
                            selectedValue={this.state.initId}
                            onValueChange={(id,item) => this._radioModal(id, item)}
                            style={{
                                alignItems: 'flex-start',
                                backgroundColor: '#ffffff',
                                flexDirection: 'row',

                            }}
                            innerStyle={{
                                width: p(100),
                            }}
                        >
                            <Text value="0" style={styles.textStyle}>全部</Text>
                            <Text value="1" style={styles.textStyle}>买入</Text>
                            <Text value="2" style={styles.textStyle}>卖出</Text>
                        </RadioModal>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.cancelAllExEntrust()}
                        style={styles.viewStyle2}
                    >
                        <Text style={styles.textStyle1}>全部撤销</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.viewStyle3}>
                    <View style={styles.killView}>
                        <Text style={[styles.textPrice, {width: '25%'}]}>时间</Text>
                        <Text style={[styles.textPrice, {width: '10%'}]}>类型</Text>
                        <Text style={[styles.textPrice, {width: '20%'}]}>价格</Text>
                        <Text style={[styles.textPrice, {width: '20%'}]}>数量</Text>
                        <Text style={[styles.textPrice, {width: '15%'}]}>状态</Text>
                        <Text style={[styles.textPrice, {width: '18%'}]}>操作</Text>
                    </View>
                    <FlatList
                        style={{flex:1,marginBottom:p(100)}}
                        horizontal={false }
                        data={this.state.killData}
                        renderItem={this.renderKillRow}
                        onEndReached={this.reachedKill}
                        onEndReachedThreshold={1}
                        ListEmptyComponent={this.renderEmpty}
                        refreshing={false}
                        onRefresh={this.queryKill}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                <Toast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,.6)'}}
                    position='top'
                    textStyle={{color:'white'}}
                />

                <Loading visible={this.state.visible}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewStyle4:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: p(200)
    },
    viewStyle3:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle1:{
        color: '#FFF',
        fontSize: 12
    },
    viewStyle2:{
        width: p(140),
        height: p(40),
        backgroundColor: '#ff6722',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: p(10),
        marginBottom: p(20),
    },
    textStyle:{
        color: '#2d2d2d',
        fontSize: 12,
    },
    viewStyle1:{
        marginLeft: p(20),
        flexDirection: 'row',
        marginBottom: p(20),
    },
    viewStyle0:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - p(20),
        marginTop: p(20),
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    textPrice:{
        color: '#ACB3B9',
        textAlign: 'center',
    },
    killView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#d7d7d7',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#d7d7d7',
        paddingTop: p(22),
        paddingBottom: p(22),
        backgroundColor: '#FFF',
    }
});

export default connect((state) => {
    const { HomeReducer } = state;
    return {
        HomeReducer
    }
})(CurrentEntrust);