/**
 * Created by 圆环之理 on 2018/5/18.
 *
 * 功能：交易大厅页面 => 顶部切换币种下拉组件
 *
 */
'use strict';

import React, {PureComponent} from 'react'
import {
    Dimensions,
    StyleSheet,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modalbox';

import p from '../../../utils/tranfrom';
import Currency from './Currency';

const {width} = Dimensions.get('window');

export default class BuessModal extends PureComponent {

    static defaultProps = {};

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen: false,
            headList: [],
            areaList: []
        };
    }

    //接收到一个新的props之后调用
    componentWillReceiveProps(props) {
        let {isOpen, headList, areaList} = props;
        this.setState({
            isOpen: isOpen,
            headList: headList,
            areaList: areaList
        });
    }

    render() {
        let {headList, areaList, isOpen} = this.state;

        return (
            <Modal
                style={[styles.modal, styles.modal3]}
                position={"top"}
                entry="top"
                swipeToClose={false}
                animationDuration={0}
                onClosed={() => this.props.setOpen(false)}
                isOpen={isOpen}
            >
                <ScrollableTabView
                    tabBarUnderlineStyle={{backgroundColor: '#EA2000', height: 3}}
                    tabBarBackgroundColor='#FFF'
                    tabBarActiveTextColor='#EA2000'
                    tabBarInactiveTextColor='#686868'
                    tabBarTextStyle={{fontSize: p(24), fontWeight: '400', paddingTop: p(10)}}
                    style={{flex: 1, height: p(350), width: width}}
                >
                    {
                        headList && headList.map((item, index) => {
                            return (
                                <Currency
                                    tabLabel={item}
                                    currList={areaList[item]}
                                    setOpen={this.props.setOpen}
                                    setItemText={this.props.setItemText}
                                    key={`Currency${index}`}
                                />
                            )
                        })
                    }
                </ScrollableTabView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        marginTop: p(120),
    },
    modal3: {
        height: p(350),
        width: width,
    }
});