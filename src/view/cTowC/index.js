/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：C2C页面
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import config from '../../utils/config';
import p from '../../utils/tranfrom';
import Request from '../../utils/request';
import Loading from '../../components/loading';
import Item_1 from './item_1';
import Item_2 from './item_2';
import Item_3 from './item_3';
import Item_4 from './item_4';
import CTowModal from './cTowModal';

const {height} = Dimensions.get('window');
const request = new Request();

export default class CTwoC extends PureComponent {

    static defaultProps = {};

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isLoading: true,
            isOpen: false,
            c2cBuySellList: [],
            loading: false,
            canBack: false,
        };
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        let {params} = this.props.navigation.state;
        if (params) {
            this.setState({
                canBack: params.canBack
            })
        }
        //查询币
        let url = config.api.ctc.c2c;
        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            if (responseText.success) {
                const {obj} = responseText;
                const {coinList} = obj;
                this.setState({
                    coinAccount: coinList,
                    loadData: true,
                    busTitle: coinList[0],
                    picturePath: '',
                });
                this.c2cBuySellFunction(coinList[0]);
            }
        }).catch(error => {
            console.log('进入失败函数=>', error);
        });
    }

    //默认查询第一个币的信息
    c2cBuySellFunction = (coinCode) => {
        //地址
        let url = config.api.ctc.c2c;
        //参数
        const actions = {
            coinCode: coinCode,
        };

        request.post(url, actions, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            if (responseText.success) {
                const {obj} = responseText;
                this.setState({
                    c2cBuySellList: obj,
                    loading: false
                });
            }
        }).catch(error => {
            console.log('进入失败函数 =>', error);
        });
    };

    setOpen = (isOpen) => {
        this.setState({
            isOpen: isOpen
        })
    };

    setItemText = (coinCode, picturePath) => {
        this.setState({
            busTitle: coinCode,
            picturePath: picturePath,
        });
        this.c2cBuySellFunction(coinCode);
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    {/*顶部标签组件*/}
                    <View style={[styles.header, {
                        flexDirection: 'row',
                        backgroundColor: '#252932',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#1F2229'
                    }]}>
                        {
                            this.state.canBack ?
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="ios-arrow-back-outline" size={25}
                                          color={'#fff'}
                                          style={{paddingHorizontal: p(20)}}/>
                                </TouchableOpacity>

                                : null
                        }

                        <TouchableOpacity
                            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1}}
                            onPress={() => this.setOpen(true)}>
                            {
                                this.state.picturePath ?
                                    <Image
                                        resizeMode='stretch'
                                        style={{width: p(40), height: p(40), marginRight: p(10)}}
                                        source={{uri: config.api.host + this.state.picturePath}}/>

                                    : null
                            }
                            {
                                this.state.busTitle ?
                                    <Text style={styles.headerTitle}>
                                        {this.state.busTitle}
                                    </Text>
                                    :
                                    null
                            }
                            <Image
                                style={{width: p(32), height: p(32), marginLeft: p(15)}}
                                source={this.state.isOpen ?
                                    require('../../static/cTowC/upper.png')
                                    :
                                    require('../../static/cTowC/lower.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    {/*选择币种组件*/}
                    <CTowModal
                        coinAccount={this.state.coinAccount}
                        isOpen={this.state.isOpen}
                        setOpen={this.setOpen}
                        setItemText={this.setItemText}
                        {...this.props}
                    />
                    {/*四个选项界面*/}
                    <ScrollableTabView
                        locked={false}
                        onChangeTab={(item) => {
                            if (item.i > 1) {
                                this.c2cBuySellFunction(this.state.busTitle);
                            }
                        }}
                        tabBarUnderlineStyle={{backgroundColor: '#00c2d2', height: 3}}
                        tabBarBackgroundColor='#FFF'
                        tabBarActiveTextColor='#00c2d2'
                        tabBarInactiveTextColor='#686868'
                        tabBarTextStyle={{fontSize: p(28), fontWeight: '400', paddingTop: p(10)}}
                    >
                        {/*买入界面*/}
                        <Item_1
                            {...this.props}
                            tabLabel='买入'
                            c2cBuySellFunction={this.c2cBuySellFunction}
                            coinCode={this.state.busTitle}
                            c2cBuySellList={this.state.c2cBuySellList}
                        />
                        {/*卖出界面*/}
                        <Item_2
                            {...this.props}
                            tabLabel='卖出'
                            c2cBuySellFunction={this.c2cBuySellFunction}
                            coinCode={this.state.busTitle}
                            c2cBuySellList={this.state.c2cBuySellList}
                        />
                        {/*兑换记录*/}
                        <Item_3
                            {...this.props}
                            tabLabel='兑换记录'
                            c2cBuySellFunction={this.c2cBuySellFunction}
                            coinCode={this.state.busTitle}
                            c2cBuySellList={this.state.c2cBuySellList}
                        />
                        {/*交易记录*/}
                        <Item_4
                            {...this.props}
                            tabLabel='交易记录'
                            coinCode={this.state.busTitle}
                            c2cBuySellList={this.state.c2cBuySellList}
                        />
                    </ScrollableTabView>
                    <Loading visible={this.state.loading}/>
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
        borderBottomColor: '#1F2229'
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(34),
        textAlign: 'center',
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

});