/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：页面标题组件
 *
 */
'use strict';
import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import p from '../utils/tranfrom';

export default class Title extends PureComponent {
    //构建
    constructor(props) {
        super(props);
    }

    //渲染
    render() {
        const {canBack, backColor, titleNameColor, titleName, rightBtn, backgroundColor} = this.props;
        const {goBack} = this.props.navigation;
        return (
            <View style={[styles.header, {
                flexDirection: 'row',
                backgroundColor: backgroundColor ? backgroundColor : '#252932',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#1F2229',
            }]}>
                <TouchableOpacity style={{flex: 1}} onPress={() => goBack(null)}>
                    {canBack === true ?
                        <Icon name="ios-arrow-back-outline" size={25}
                              color={backColor ? backColor : '#fff'}
                              style={{paddingHorizontal: p(20)}}/>
                        :
                        <View/>}
                </TouchableOpacity>
                <Text style={[styles.headerTitle, {
                    flex: 1,
                    textAlign: 'center',
                    color: titleNameColor ? titleNameColor : '#fff'
                }]}>{titleName}</Text>
                {rightBtn ? rightBtn : <View style={{flex: 1}}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    back: {
        width: p(20),
        height: p(20),
        marginLeft: p(20)
    },
    header: {
        paddingTop: Platform.OS === 'android' ? p(50) : p(35),
        backgroundColor: '#252932',
        alignItems: 'center',
        height: p(120),
    },
    headerTitle: {
        color: '#fff',
        fontSize: p(28),
        textAlign: 'center',
        fontWeight: '400'
    },
    goBack: {
        borderLeftWidth: p(4),
        borderBottomWidth: p(4),
        borderColor: '#313840',
        width: p(26),
        height: p(26),
        transform: [{rotate: '45deg'}],
        marginLeft: p(20)
    }
});