/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：我的委托页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import p from '../../../utils/tranfrom';
import Title from '../../../components/title';
import Item_1 from './Item_1';
import Item_2 from './Item_2';

export default class Entrusted extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selectedIndices: [0],
            customStyleIndex: 0
        }
    }

    handleCustomIndexSelect = (index) => {
        this.setState({
            ...this.state,
            customStyleIndex: index,
        });
    };

    render() {
        return (
            <View style={{backgroundColor: '#1F2229', flex: 1}}>
                <Title titleName="委托管理" canBack={true} {...this.props} />
                <View style={{margin: p(20)}}>
                    <SegmentedControlTab
                        values={['当前委托', '历史委托']}
                        selectedIndex={this.state.customStyleIndex}
                        onTabPress={this.handleCustomIndexSelect}
                        borderRadius={0}
                        tabsContainerStyle={{
                            height: p(70),
                            backgroundColor: '#1F2229',
                            marginVertical: p(20)
                        }}
                        tabStyle={{
                            backgroundColor: '#1F2229',
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: '#313840'
                        }}
                        activeTabStyle={{backgroundColor: '#313840'}}
                        tabTextStyle={{color: '#FFFFFF', fontWeight: 'bold'}}
                        activeTabTextStyle={{color: '#FFFFFF'}}/>
                    <View style={{flex: 1}}>
                        {this.state.customStyleIndex === 0 ?
                            <Item_1  {...this.props}/>
                            :
                            <Item_2 {...this.props}/>
                        }
                    </View>
                </View>
            </View>
        );
    }
}