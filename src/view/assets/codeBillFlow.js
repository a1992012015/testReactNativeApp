/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人资产页面 => 账单页面
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import{
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import p from '../../utils/tranfrom';
import Title from '../../components/title';
import Item_1 from './item_1';
import Item_2 from './item_2';

export default class CodeBillFlow extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selectedIndices: [0],
            customStyleIndex: 0,
            coinCode:''
        }
    }
    //真实DOM渲染出来之后调用
    componentDidMount() {
        const { params } = this.props.navigation.state;

        this.setState({
            titleName: params.intoData.coinCode+" 账单流水",
            moneyAndCoin: params.intoData.moneyAndCoin,
            coinCode: params.intoData.coinCode,
        });
    }

    handleCustomIndexSelect =  index => {
        this.setState({
            customStyleIndex: index,
        });
    };

    render() {
        return (
            <View style={{backgroundColor: '#1F2229', flex: 1}}>
                <Title titleName={this.state.titleName} canBack={true} {...this.props}/>
                <ScrollView style={{margin: p(20), flex: 1}}>
                    <SegmentedControlTab
                        values={this.state.moneyAndCoin === 0 ? ['充值', '提现'] : ['充币', '提币']}
                        selectedIndex={this.state.customStyleIndex}
                        onTabPress={this.handleCustomIndexSelect}
                        borderRadius={0}
                        tabsContainerStyle={{ height: p(70), backgroundColor: '#1F2229', marginVertical: p(20)}}
                        tabStyle={{backgroundColor: '#1F2229', borderWidth: StyleSheet.hairlineWidth, borderColor: '#313840'}}
                        activeTabStyle={{backgroundColor: '#313840'}}
                        tabTextStyle={{ color: '#FFFFFF'}}
                        activeTabTextStyle={{color: '#FFFFFF'}}/>
                    {
                        this.state.customStyleIndex === 0 ?
                            <Item_1  {...this.props} coinCode={this.state.coinCode}/>
                            :
                            <Item_2 {...this.props} coinCode={this.state.coinCode}/>
                    }
                </ScrollView>
            </View>
        );
    }
}