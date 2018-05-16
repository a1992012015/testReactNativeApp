/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 交易记录界面组件
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'

import config from '../../utils/config';
import p from '../../utils/tranfrom';

const { width } = Dimensions.get('window');

export default class Item_4 extends PureComponent {
    //构建
    constructor(props){
        super(props);
        this.state = {
            customStyleIndex: 0,
        }
    }
    //真实的结构渲染出来之后
    componentDidMount() {
        this.setState({
            buyList:this.props.c2cBuySellList.buyList,
            sellList:this.props.c2cBuySellList.sellList,
            coinCode:this.props.coinCode,
        })
    }
    //接收到一个新的props之后调用
    componentWillReceiveProps(props) {
        let { coinCode, c2cBuySellList } = props;
        this.setState({
            coinCode: coinCode,
            buyList: c2cBuySellList.buyList,
            sellList: c2cBuySellList.sellList,
        })
    }

    handleCustomIndexSelect = index => {
        this.setState({
            customStyleIndex: index,
        });
    };

    render(){
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#fafafa',
                marginBottom: config.api.isTabView ? p(100) : 0,
            }}>
                {/*切换卖出和买入列表的按钮组建*/}
                <View style={{ width: width - p(40), marginLeft: p(20)}}>
                    <SegmentedControlTab
                        values={['买入记录', '卖出记录']}
                        selectedIndex={this.state.customStyleIndex}
                        onTabPress={this.handleCustomIndexSelect}
                        borderRadius={0}
                        tabsContainerStyle={{ height: p(70), backgroundColor: '#acbce3', marginVertical: p(20)}}
                        tabStyle={{
                            backgroundColor: '#f4f4f4',
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: '#dbdbdb',
                        }}
                        activeTabStyle={{backgroundColor: '#f8671b'}}
                        tabTextStyle={{ color: '#313131'}}
                        activeTabTextStyle={{ color: '#FFFFFF'}}
                    />
                </View>

                <View style={{height: p(2), backgroundColor: '#e6e6e6', marginTop:p(10)}}/>
                {/*具体的信息列表组件*/}
                <View style={styles.ViewFlex}>
                    {this.state.customStyleIndex === 0 ?
                        <FlatList
                            horizontal={false}
                            onEndReachedThreshold={10}
                            refreshing={false}
                            data={this.state.buyList}
                            renderItem={({item}) => {
                                const { userName, transactionCount } = item;
                                return (
                                    <View style={{width: width - p(100)}}>
                                        <View style={styles.viewS}>
                                            <Text style={styles.textS}>商户：{userName}</Text>
                                        </View>
                                        <View style={styles.viewS}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={styles.textNum}>数量：</Text>
                                                <Text style={styles.textS}>{transactionCount}</Text>
                                                <Text style={[styles.textS, {marginLeft: p(4)}]}>
                                                    {item.coinCode}
                                                </Text>
                                            </View>
                                            <Text style={{color: '#00c2d2', fontSize: p(24)}}>交易完成</Text>

                                        </View>
                                        <View style={styles.lines}/>
                                    </View>
                                )
                            }}
                        />
                        :
                        <FlatList
                            horizontal={false}
                            onEndReachedThreshold={10}
                            refreshing={false}
                            data={this.state.sellList}
                            renderItem={({item}) => {
                                const { userName, transactionCount } = item;
                                return (
                                    <View style={{width:width-p(100)}}>
                                        <View style={styles.viewS}>
                                            <Text style={styles.textS}>商户：{userName}</Text>
                                        </View>
                                        <View style={styles.viewS}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={styles.textNum}>数量：</Text>
                                                <Text style={styles.textS}>{transactionCount}</Text>
                                                <Text style={[styles.textS, {marginLeft: p(4)}]}>{item.coinCode}</Text>
                                            </View>
                                            <Text style={{color: '#00c2d2', fontSize: p(24)}}>交易完成</Text>

                                        </View>
                                        <View style={styles.lines}/>
                                    </View>
                                )
                            }}
                        />
                    }
                </View>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    textNum:{
        color: '#282828',
        fontSize: p(24),
    },
    textS:{
        color: '#595959',
        fontSize: p(24),
    },
    viewS:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: p(40),
    },
    lines:{
        height: p(2),
        backgroundColor: '#e6e6e6',
        width: width - p(60),
        marginTop: p(10),
    },
    promptText:{
        color: '#2b2b2b',
        fontSize: p(26),
        lineHeight: p(40),
        marginTop: p(20),
    },
    textRecord:{
        color: '#292b2c',
        textAlign: 'center',
    },
    ViewFlex:{
        width: width - p(20),
        marginLeft: p(40),
    }
});