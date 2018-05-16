/**
 * Created by 圆环之理 on 2018/5/16.
 *
 * 功能：C2C页面组件 => 顶部选择币种组件
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    Dimensions,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native'
import Modal from 'react-native-modalbox';

import p from '../../utils/tranfrom';
import config from '../../utils/config';

const { width } = Dimensions.get('window');

export default class CTowModal extends PureComponent {

    static defaultProps = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen: false,
            headList: [],
            areaList: [],
            coinLength: 5,
        };
    }
    //组件接收到新的props时调用
    componentWillReceiveProps(props) {
        let { isOpen, coinAccount, coinAccountList } = props;
        this.setState({
            isOpen: isOpen,
            coinAccount: coinAccount,
            coinAccountList: coinAccountList,
        });
    }
    /*选择币种*/
    ListClick = (item)=>{
        this.props.setOpen(false);
        this.props.setItemText(item,'');
    };

    render() {
        let {isOpen} = this.state;

        return (
            <Modal style={[styles.modal, styles.modal3, {height:this.state.coinAccount ?
                    p(200 * Math.ceil(this.state.coinAccount.length / 4))
                    :
                    p(200)
            }]}
                   position={"top"}
                   entry="top"
                   swipeToClose={false}
                   animationDuration={0}
                   onClosed={()=>this.props.setOpen(false)}
                   isOpen={isOpen}>
                <View style={styles.ViewStyle}>
                    {
                        this.state.coinAccount ?
                            this.state.coinAccount.map(item => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this.ListClick(item)}
                                        style={styles.touchableOpacity}>
                                        <Image
                                            resizeMode='stretch'
                                            style={{width: p(60), height: p(40)}}
                                            source={{uri: config.api.host + ''}}/>
                                        <Text style={{fontSize: p(26), marginTop: p(10)}}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            :
                            null
                    }
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    touchableOpacity:{
        width:width/4,
        alignItems:'center',
        marginTop:p(30)
    },
    ViewStyle:{
        alignItems:'center',
        width:width,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    modal: {
        marginTop:p(120)
    },
    modal3: {
        width: width
    }
});
